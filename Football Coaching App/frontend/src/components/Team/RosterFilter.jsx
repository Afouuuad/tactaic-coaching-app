import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

/**
 * A filter card component for the team roster page.
 * Allows filtering players by name, position, and status.
 * @param {function} setSearchText - State setter for the name search input.
 * @param {function} setPosition - State setter for the position filter.
 * @param {function} setStatus - State setter for the status filter.
 */
const RosterFilter = ({ setSearchText, setPosition, setStatus }) => {

  const handleClearFilters = () => {
    // This requires access to the input elements to clear them,
    // or the parent component needs to handle clearing state.
    // For now, we'll just reset the parent state.
    setSearchText("");
    setPosition("");
    setStatus("");
    // Clear the form fields visually
    document.getElementById("searchText").value = "";
    document.getElementById("position").value = "";
    document.getElementById("status").value = "";
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg space-y-6">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="text-blue-400" />
        <h2 className="text-xl font-bold text-white">Filter Roster</h2>
      </div>

      {/* Search by Name */}
      <div>
        <Label className="text-gray-300">Player Name</Label>
        <Input
          id="searchText"
          type="text"
          placeholder="e.g., John Doe"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Position Filter */}
      <div>
        <Label className="text-gray-300">Position</Label>
        <select
          id="position"
          onChange={(e) => setPosition(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Positions</option>
          <option value="Goalkeeper">Goalkeeper</option>
          <option value="Defender">Defender</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Forward">Forward</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <Label className="text-gray-300">Status</Label>
        <select
          id="status"
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mt-2 p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Any Status</option>
          <option value="Available">Available</option>
          <option value="Injured">Injured</option>
          <option value="Absent">Absent</option>
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

export default RosterFilter;
