import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar, MapPin, AlignLeft, ShieldAlert, Trophy, Target } from 'lucide-react';

const CreateEvent = () => {
  const [input, setInput] = useState({
    type: "Training", // 'Training' or 'Match'
    title: "",
    description: "",
    date: "",
    location: "",
    opponent: "", // new field for matches
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // We need both the auth token AND the coach's team ID
  const { token, user } = useSelector(store => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const setEventType = (type) => {
    setInput({ ...input, type, opponent: "" }); // Reset opponent if switching to training
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create an event.");
      navigate("/login");
      return;
    }

    if (!user?.teams || user.teams.length === 0) {
      toast.error("You must set up a team first before planning events.");
      navigate("/team-setup");
      return;
    }

    try {
      setLoading(true);

      const teamId = user.teams[0]; // Assuming coach manages one team for now

      const eventData = {
        teamId: teamId,
        type: input.type,
        title: input.title,
        description: input.description,
        location: input.location,
        date: new Date(input.date).toISOString(),
      };

      // Only attach opponent if it's a Match
      if (input.type === 'Match' && input.opponent) {
        eventData.opponent = input.opponent;
      }

      const res = await axios.post(EVENT_API_END_POINT, eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        toast.success(`${input.type} planned successfully!`);
        navigate("/events");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-extrabold text-blue-950 tracking-tight">Plan an Event</h1>
          <p className="text-slate-500 mt-2 text-lg">Organize your next session or fixture with precision.</p>
        </div>

        <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Event Type (Card 1) */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Target size={20} strokeWidth={1.5} className="text-blue-600" />
              Event Type
            </h2>

            <div className="space-y-4">
              {/* Training Toggle */}
              <div
                onClick={() => setEventType('Training')}
                className={`cursor-pointer rounded-lg p-5 border transition-all duration-200 flex items-start gap-4 ${input.type === 'Training'
                    ? 'border-cyan-500 bg-cyan-50/30'
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
              >
                <div className={`mt-1 p-2 rounded-md ${input.type === 'Training' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Target size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`font-bold ${input.type === 'Training' ? 'text-blue-950' : 'text-slate-700'}`}>Training Session</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Schedule drills, tactical work, and fitness sessions.</p>
                </div>
              </div>

              {/* Match Toggle */}
              <div
                onClick={() => setEventType('Match')}
                className={`cursor-pointer rounded-lg p-5 border transition-all duration-200 flex items-start gap-4 ${input.type === 'Match'
                    ? 'border-cyan-500 bg-cyan-50/30'
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
              >
                <div className={`mt-1 p-2 rounded-md ${input.type === 'Match' ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Trophy size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`font-bold ${input.type === 'Match' ? 'text-blue-950' : 'text-slate-700'}`}>Competitive Match</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">Plan for league games, cups, or friendlies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle/Right Column: Event Details & Logistics (Main Content) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Card 2: Event Details */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-8 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <AlignLeft size={20} strokeWidth={1.5} className="text-blue-600" />
                Event Details
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-2 block">Event Title</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder={input.type === 'Match' ? 'e.g., Home vs. City FC' : 'e.g., High Pressing & Transitions'}
                    value={input.title}
                    onChange={changeEventHandler}
                    className="h-12 bg-white border-[#E0E0E0] text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md transition-all"
                    required
                  />
                </div>

                {/* Opponent (Only if Match) */}
                {input.type === 'Match' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      Opponent Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldAlert size={18} strokeWidth={1.5} className="text-slate-400" />
                      </div>
                      <Input
                        type="text"
                        name="opponent"
                        placeholder="e.g., Manchester Red"
                        value={input.opponent}
                        onChange={changeEventHandler}
                        className="h-12 pl-10 bg-white border-[#E0E0E0] text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md transition-all"
                        required={input.type === 'Match'}
                      />
                    </div>
                  </div>
                )}

                {/* Description / Notes */}
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-2 block">Objectives & Notes</Label>
                  <textarea
                    name="description"
                    placeholder="Add key goals, required equipment, or tactical focus..."
                    value={input.description}
                    onChange={changeEventHandler}
                    rows="4"
                    className="w-full p-4 bg-white border border-[#E0E0E0] text-slate-800 placeholder:text-slate-400 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none resize-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Logistics (Date & Location) */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-8 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <MapPin size={20} strokeWidth={1.5} className="text-blue-600" />
                Time & Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date & Time */}
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                    <Calendar size={16} strokeWidth={1.5} className="text-slate-400" /> Date & Time
                  </Label>
                  <Input
                    type="datetime-local"
                    name="date"
                    value={input.date}
                    onChange={changeEventHandler}
                    className="h-12 bg-white border-[#E0E0E0] text-slate-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md transition-all"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                    <MapPin size={16} strokeWidth={1.5} className="text-slate-400" /> Venue / Pitch
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="e.g., Main Stadium or Pitch B"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="h-12 bg-white border-[#E0E0E0] text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
              {loading ? (
                <Button className="h-12 px-8 bg-blue-600 opacity-80 cursor-not-allowed font-semibold rounded-md text-white" disabled>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Saving Event...
                </Button>
              ) : (
                <Button type="submit" className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-all focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
                  Save Event
                </Button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
