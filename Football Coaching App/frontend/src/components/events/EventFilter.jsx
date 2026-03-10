import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, Search, Calendar, Folder } from 'lucide-react';

/**
 * A filter card component for the Events page.
 * Allows filtering events by search text, type, and date.
 * @param {function} setSearchText - State setter for the text search input.
 * @param {function} setEventType - State setter for the event type filter.
 * @param {function} setDateFilter - State setter for the date filter.
 */
const EventFilter = ({ setSearchText, setEventType, setDateFilter }) => {

  const handleClearFilters = () => {
    // Reset the parent component's state
    setSearchText("");
    setEventType("");
    setDateFilter("");
    // Visually clear the form fields
    document.getElementById("eventSearchText").value = "";
    document.getElementById("eventType").value = "";
    document.getElementById("dateFilter").value = "";
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6 sticky top-24">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
          <SlidersHorizontal size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Filters</h2>
      </div>

      {/* Search by Text */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Search size={14} /> Search
        </Label>
        <div className="relative border border-slate-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
          <Input
            id="eventSearchText"
            type="text"
            placeholder="e.g., Tactics"
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-slate-50 border-0 focus-visible:ring-0 rounded-none text-slate-800 placeholder:text-slate-400 h-10"
          />
        </div>
      </div>

      {/* Event Type Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Folder size={14} /> Type
        </Label>
        <div className="relative border border-slate-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
          <select
            id="eventType"
            onChange={(e) => setEventType(e.target.value)}
            className="w-full bg-slate-50 border-0 outline-none text-slate-800 h-10 px-3 text-sm font-medium"
          >
            <option value="">All Types</option>
            <option value="Match">Match</option>
            <option value="Training">Training</option>
          </select>
        </div>
      </div>

      {/* Date Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={14} /> Timeframe
        </Label>
        <div className="relative border border-slate-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
          <select
            id="dateFilter"
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-50 border-0 outline-none text-slate-800 h-10 px-3 text-sm font-medium"
          >
            <option value="">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-2">
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 font-bold uppercase tracking-wider text-xs"
        >
          <X size={14} className="mr-2" />
          Clear Fiters
        </Button>
      </div>
    </div>
  );
};

export default EventFilter;
