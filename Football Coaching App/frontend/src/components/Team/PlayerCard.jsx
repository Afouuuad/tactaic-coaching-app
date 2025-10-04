import React from 'react';
import { Edit3 } from 'lucide-react';

/**
 * A card component to display a summary of a single player's information.
 * It shows their name, position, status, and provides an action to edit their details.
 *
 * @param {object} player - The player object containing details like name, position, status, and an optional photoUrl.
 */
const PlayerCard = ({ player }) => {

  // Function to determine the color of the status badge based on the player's status
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-500/20 text-green-400';
      case 'injured':
        return 'bg-red-500/20 text-red-400';
      case 'absent':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/20">
      
      {/* Player Image Placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center border-2 border-gray-600">
        {/* You can replace this with an <img /> tag when you have player photos */}
        <span className="text-4xl font-bold text-gray-500">
          {player.name ? player.name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>

      {/* Player Name */}
      <h3 className="text-xl font-semibold text-white truncate w-full">{player.name || 'Unknown Player'}</h3>
      
      {/* Player Position */}
      <p className="text-gray-400 text-sm mb-3">{player.position || 'No Position Assigned'}</p>

      {/* Player Status Badge */}
      <div className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(player.status)}`}>
        {player.status || 'No Status'}
      </div>

      {/* Action Button */}
      <div className="mt-4 w-full">
        <button
          onClick={() => {
            // This is where you would trigger the EditPlayerDialog to open
            // For now, it just logs to the console.
            console.log(`Editing player: ${player.name}`);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200"
        >
          <Edit3 size={16} />
          Edit Player
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;
 