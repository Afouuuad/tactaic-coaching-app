import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

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
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg space-y-6">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="text-blue-400" />
        <h2 className="text-xl font-bold text-white">Filter Events</h2>
      </div>

      {/* Search by Text */}
      <div>
        <Label className="text-gray-300">Search Events</Label>
        <Input
          id="eventSearchText"
          type="text"
          placeholder="e.g., Defensive Drills"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Event Type Filter */}
      <div>
        <Label className="text-gray-300">Event Type</Label>
        <select
          id="eventType"
          onChange={(e) => setEventType(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="Match">Match</option>
          <option value="Training">Training</option>
        </select>
      </div>

      {/* Date Filter */}
      <div>
        <Label className="text-gray-300">Timeframe</Label>
        <select
          id="dateFilter"
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="pt-2">
        <Button 
          onClick={handleClearFilters}
          className="w-full p-2 bg-gray-600 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <X size={16} />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default EventFilter;
