import React, { useEffect, useState } from 'react';
import Navbar from "../shared/Navbar";
import RosterFilter from "./RosterFilter"; // Corrected import to match your file name
import PlayerCard from "./PlayerCard"; 
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

/**
 * The main page for displaying the entire team roster.
 * It features filtering capabilities to easily find specific players.
 */
const Team = () => {
  // 1. Get all players from the 'player' slice in the Redux store
  const { allPlayers } = useSelector((store) => store.player);
  
  // State for filter values
  const [searchText, setSearchText] = useState("");
  const [position, setPosition] = useState(""); // e.g., 'Defender', 'Midfielder'
  const [status, setStatus] = useState(""); // e.g., 'Available', 'Injured'

  // State to hold the players that match the current filters
  const [filteredPlayers, setFilteredPlayers] = useState(allPlayers || []);

  // 2. This effect re-runs the filter logic whenever players or filter criteria change
  useEffect(() => {
    let playersToFilter = allPlayers ? [...allPlayers] : [];

    // Filter by search text (player name)
    if (searchText) {
      playersToFilter = playersToFilter.filter(player =>
        player.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by position
    if (position) {
      playersToFilter = playersToFilter.filter(player =>
        player.position?.toLowerCase() === position.toLowerCase()
      );
    }
    
    // Filter by status
    if (status) {
      playersToFilter = playersToFilter.filter(player =>
        player.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredPlayers(playersToFilter);
  }, [allPlayers, searchText, position, status]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 3. Left Side - Player Filter Panel */}
          <div className="lg:w-1/4">
            {/* Corrected component name to match the import */}
            <RosterFilter 
              setSearchText={setSearchText}
              setPosition={setPosition}
              setStatus={setStatus}
            />
          </div>

          {/* 4. Right Side - Player Roster Grid */}
          <div className="flex-1 max-h-[88vh] overflow-y-auto pb-5">
            {filteredPlayers.length === 0 ? (
              <div className="text-center text-lg font-medium text-gray-400 pt-10">
                No players found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map(player => (
                  <motion.div
                    key={player._id} // Assuming player object has a unique _id
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PlayerCard player={player} />
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

export default Team;

