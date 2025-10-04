import React, { useEffect, useState } from 'react';
import Navbar from "../shared/Navbar";
import EventFilter from "./EventFilter"; // 1. Renamed to a specific filter component
import EventDetails from "./EventDetails"; // The card component we just refactored
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

/**
 * The main page for displaying a filterable list of all events (matches and training).
 */
const Events = () => {
  // 2. Getting data from the correct 'event' slice
  const { allEvents, searchedQuery } = useSelector((store) => store.event);

  // 3. State for event-specific filters
  const [searchText, setSearchText] = useState("");
  const [eventType, setEventType] = useState(""); // 'Match' or 'Training'
  const [dateFilter, setDateFilter] = useState(""); // e.g., 'upcoming', 'past'

  // State to hold the events that match the current filters
  const [filteredEvents, setFilteredEvents] = useState(allEvents || []);

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
        event.type?.toLowerCase() === eventType.toLowerCase()
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 5. Left Side - Event Filter Panel */}
          <div className="lg:w-1/4">
            <EventFilter 
              setSearchText={setSearchText}
              setEventType={setEventType} 
              setDateFilter={setDateFilter}
            />
          </div>

          {/* 6. Right Side - Event Listings */}
          <div className="flex-1 max-h-[88vh] overflow-y-auto pb-5">
            {filteredEvents.length === 0 ? (
              <div className="text-center text-lg font-medium text-gray-500 pt-10">
                No events found matching your criteria.
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredEvents.map(event => (
                  <motion.div
                    key={event._id} // Assuming event object has a unique _id
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 7. Rendering the EventDetails component */}
                    <EventDetails event={event} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
