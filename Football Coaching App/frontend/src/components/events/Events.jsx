import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../shared/Navbar";
import EventFilter from "./EventFilter"; // 1. Renamed to a specific filter component
import EventDetails from "./EventDetails"; // The card component we just refactored
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calendar, Target, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setAllEvents } from '../../redux/eventSlice';
import { EVENT_API_END_POINT } from '../../utils/constant';

/**
 * The main page for displaying a filterable list of all events (matches and training).
 */
const Events = () => {
  const dispatch = useDispatch();
  // 2. Getting data from the correct 'event' slice
  const { allEvents, searchedQuery } = useSelector((store) => store.event);
  const { user, token } = useSelector((store) => store.auth);

  // 3. State for event-specific filters
  const [searchText, setSearchText] = useState("");
  const [eventType, setEventType] = useState(""); // 'Match' or 'Training'
  const [dateFilter, setDateFilter] = useState(""); // e.g., 'upcoming', 'past'

  // State to hold the events that match the current filters
  const [filteredEvents, setFilteredEvents] = useState(allEvents || []);

  // Fetch events when the page loads
  useEffect(() => {
    const fetchEvents = async () => {
      if (!token || !user?.teams?.[0]) return;

      try {
        const teamId = user.teams[0];
        const res = await axios.get(`${EVENT_API_END_POINT}/team/${teamId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.data) {
          dispatch(setAllEvents(res.data));
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [dispatch, token, user]);

  // 4. Effect to re-run the filter logic when events or filters change
  useEffect(() => {
    let eventsToFilter = allEvents ? [...allEvents] : [];

    // Filter by search text (title or description)
    const queryText = (typeof searchedQuery === 'string' ? searchedQuery : searchedQuery?.query || '').toLowerCase();
    if (queryText) {
      eventsToFilter = eventsToFilter.filter(event =>
        event.title?.toLowerCase().includes(queryText) ||
        event.description?.toLowerCase().includes(queryText)
      );
    }

    if (searchText) {
      eventsToFilter = eventsToFilter.filter(event =>
        event.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by event type
    if (eventType) {
      eventsToFilter = eventsToFilter.filter(event =>
        (event.eventType || event.type)?.toLowerCase() === eventType.toLowerCase()
      );
    }

    // Filter by date (upcoming or past)
    const now = new Date();
    if (dateFilter === 'upcoming') {
      eventsToFilter = eventsToFilter.filter(event => new Date(event.date) >= now);
    } else if (dateFilter === 'past') {
      eventsToFilter = eventsToFilter.filter(event => new Date(event.date) < now);
    }

    setFilteredEvents(eventsToFilter);
  }, [allEvents, searchedQuery, searchText, eventType, dateFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <Navbar />

      {/* Premium Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Schedule & Planning</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tighter uppercase">
                Team Events
              </h1>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                Manage your upcoming fixtures, training sessions, and team meetings.
              </p>
            </div>

            <Link to="/create-event">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-md font-bold gap-2 transition-all duration-150 uppercase tracking-wider text-xs px-6 py-5">
                <Plus size={16} /> Plan Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto 2xl:px-0 mt-8 px-6 lg:px-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* 5. Left Side - Event Filter Panel */}
          <div className="lg:w-1/4 xl:w-1/5 shrink-0">
            <EventFilter
              setSearchText={setSearchText}
              setEventType={setEventType}
              setDateFilter={setDateFilter}
            />
          </div>

          {/* 6. Right Side - Event Listings */}
          <div className="flex-1 min-h-[500px]">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                <Calendar size={48} className="mb-4 opacity-30" />
                <h3 className="text-lg font-bold text-slate-700 tracking-tight">No events scheduled</h3>
                <p className="text-sm mt-1 text-slate-500">Try adjusting your filters or plan a new event.</p>
                <Link to="/create-event" className="mt-6">
                  <Button variant="outline" className="font-bold uppercase tracking-wider text-xs border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                    Plan Event Now
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                <AnimatePresence>
                  {filteredEvents.map(event => (
                    <motion.div
                      key={event._id}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <EventDetails event={event} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
