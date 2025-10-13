import React, { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UploadIcon } from 'lucide-react';
import Navbar from '../shared/Navbar';


// --- Initial State (No Mock Data) ---
const initialTeamData = {
  name: 'Team Name',
  coach: 'Coach Name',
  stats: {
    matches: 0,
    goalsScored: 0,
    goalsConceded: 0,
    assists: 0,
    streak: [],
  },
  topScorers: [],
  topAssists: [],
};

const initialPlayersData = [];

// --- Helper & Sub-Components ---

const StreakBox = ({ result }) => {
  const getStreakStyle = (res) => {
    switch (res) {
      case 'W': return 'bg-green-500 text-white';
      case 'L': return 'bg-red-500 text-white';
      case 'D': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200';
    }
  };
  return (
    <div className={`w-7 h-7 flex items-center justify-center rounded-md font-bold text-sm shadow-sm ${getStreakStyle(result)}`}>
      {result}
    </div>
  );
};

const TeamSidebar = ({ team, onLogoUpload }) => {
    const [logo, setLogo] = useState(null);

    const handleLogoChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => setLogo(e.target.result);
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    return (
        <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-5 rounded-xl shadow-sm h-full border border-gray-200">
            <div className="flex items-center mb-6">
                <label htmlFor="logo-upload" className="cursor-pointer group relative">
                    {logo ? (
                        <img src={logo} alt="Team Logo" className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-200" />
                    ) : (
                        <div className="w-16 h-16 rounded-full mr-4 bg-gray-100 flex items-center justify-center border-2 border-dashed">
                            <span className="text-xs text-gray-500 text-center">Logo</span>
                        </div>
                    )}
                    <div className="absolute inset-0 w-16 h-16 rounded-full mr-4 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                        <UploadIcon className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                    </div>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
                    <p className="text-gray-500">{team.coach}</p>
                    <p className="text-sm text-gray-400">Manager</p>
                </div>
            </div>
            <div className="flex justify-start space-x-2 mb-6 h-7">
                {team.stats.streak.length > 0 ?
                    team.stats.streak.map((result, index) => <StreakBox key={index} result={result} />)
                    : <p className="text-sm text-gray-400 italic">No matches played yet.</p>
                }
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-center mb-8">
                <div><p className="text-gray-500 text-sm">Matches</p><p className="font-bold text-2xl text-gray-800">{team.stats.matches}</p></div>
                <div><p className="text-gray-500 text-sm">Goals Scored</p><p className="font-bold text-2xl" style={{color: '#00529F'}}>{team.stats.goalsScored}</p></div>
                <div><p className="text-gray-500 text-sm">Goals Conceded</p><p className="font-bold text-2xl text-gray-800">{team.stats.goalsConceded}</p></div>
                <div><p className="text-gray-500 text-sm">Assists</p><p className="font-bold text-2xl" style={{color: '#00529F'}}>{team.stats.assists}</p></div>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-3 text-gray-800">Goals</h3>
                {team.topScorers.length > 0 ? (
                    <ul className="space-y-3 mb-6">
                        {team.topScorers.map(player => (
                            <li key={player.name} className="flex justify-between items-center text-sm">
                                <div><p className="font-semibold">{player.name}</p><p className="text-gray-500">{player.position}</p></div>
                                <p className="font-bold text-gray-800">{player.goals}</p>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-gray-400 italic">No goals recorded yet.</p>}
            </div>
            <div className="mt-6">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Assists</h3>
                {team.topAssists.length > 0 ? (
                    <ul className="space-y-3">
                        {team.topAssists.map(player => (
                            <li key={player.name} className="flex justify-between items-center text-sm">
                                <div><p className="font-semibold">{player.name}</p><p className="text-gray-500">{player.position}</p></div>
                                <p className="font-bold text-gray-800">{player.assists}</p>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-gray-400 italic">No assists recorded yet.</p>}
            </div>
        </div>
    );
};

const AttendanceDropdown = ({ filter, setFilter }) => (
    <Menu as="div" className="relative inline-block text-left">
        <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                {filter}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
        </div>
        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                    <Menu.Item>{({ active }) => (<button onClick={() => setFilter('All')} className={`${active ? 'bg-white-900 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}>All</button>)}</Menu.Item>
                    <Menu.Item>{({ active }) => (<button onClick={() => setFilter('Confirmed')} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}>Confirmed</button>)}</Menu.Item>
                    <Menu.Item>{({ active }) => (<button onClick={() => setFilter('Pending')} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}>Pending</button>)}</Menu.Item>
                </div>
            </Menu.Items>
        </Transition>
    </Menu>
);

const PlayerRoster = ({ players }) => {
  const [filter, setFilter] = useState('All');

  const filteredPlayers = players.filter(player => {
    if (filter === 'All') return true;
    return player.attendance === filter;
  });

  return (
    <div className="w-full lg:w-2/3 xl:w-3/4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">All Players</h2>
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-200 shadow-sm">
          Add players
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-4 border-b pb-4">
        <span className="font-semibold text-gray-700">Attendance</span>
        <AttendanceDropdown filter={filter} setFilter={setFilter} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{['Name', 'Age', 'Height', 'Weight', 'Position', 'Preferred Foot', 'Attendance'].map(header => (<th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>))}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.height}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.preferredFoot}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${player.attendance === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{player.attendance}</span>
                  </td>
                </tr>
              ))
            ) : (<tr><td colSpan="7" className="text-center py-20 text-gray-500">No players found.</td></tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
        <span>0-0 of 0</span>
        <div className="flex space-x-1 ml-4">
          <button disabled className="p-2 text-gray-300 cursor-not-allowed rounded-md hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
          <button disabled className="p-2 text-gray-300 cursor-not-allowed rounded-md hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>
    </div>
  );
};

const PlayerStatisticsPage = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Player Statistics</h2>
      <p className="mt-4 text-gray-500">Detailed player statistics and performance metrics will be displayed here.</p>
    </div>
);


// --- Main Page Component ---
export default function TeamPage() {
  const [teamData] = useState(initialTeamData);
  const [players] = useState(initialPlayersData);
  const [activeTab, setActiveTab] = useState('Team');

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans" style={{'--primary-blue': '#00529F'}}>
        <header className="mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('Team')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'Team'
                  ? 'bg-[var(--primary-blue)] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-100'
              }`}
            >
              Roster
            </button>
            <button
              onClick={() => setActiveTab('Statistics')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'Statistics'
                  ? 'bg-[var(--primary-blue)] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-100'
              }`}
            >
              Player Statistics
            </button>
          </div>
        </header>
        <main>
          {activeTab === 'Team' ? (
            <div className="flex flex-col lg:flex-row gap-6">
              <TeamSidebar team={teamData} />
              <PlayerRoster players={players} />
            </div>
          ) : (
            <PlayerStatisticsPage />
          )}
        </main>
      </div>
    </>
  );
}