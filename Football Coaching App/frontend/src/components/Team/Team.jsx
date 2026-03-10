import React, { useState, Fragment, useEffect } from 'react';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, UploadIcon } from 'lucide-react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { TEAM_API_END_POINT, PLAYER_API_END_POINT, BASE_ASSET_URL } from '@/utils/constant';
import { ATTRIBUTE_CATEGORIES } from '@/utils/attributeCategories';
import AttributeEditor from './AttributeEditor';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle } from 'lucide-react';
import { toast } from 'sonner';

// --- Initial State (Fallbacks) ---
const initialTeamData = {
  name: 'No Team Selected',
  coach: '',
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

// --- Helper Functions ---
const calculateAge = (player) => {
  if (player?.age) return player.age;
  if (!player?.dateOfBirth) return "-";
  const birthDate = new Date(player.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const TeamSidebar = ({ team }) => {
  const { user } = useSelector(state => state.auth);

  const stats = team.stats || initialTeamData.stats;
  const streak = stats.streak || [];

  // Resolve paths for team logo and coach picture with robust sanitization
  const sanitizePath = (path) => path ? path.replace(/^(uploads[/\\])+/, "") : null;
  const teamLogoPath = (team.teamLogo || user?.teamLogo) ? `${BASE_ASSET_URL}${sanitizePath(team.teamLogo || user?.teamLogo)}` : null;
  const coachPicPath = user?.profilePicture ? `${BASE_ASSET_URL}${sanitizePath(user.profilePicture)}` : null;

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-white p-5 rounded-xl shadow-sm h-full border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="relative">
          {teamLogoPath ? (
            <img src={teamLogoPath} alt="Team Logo" className="w-20 h-20 rounded-full mr-4 object-cover border-4 border-slate-50 shadow-md" />
          ) : (
            <div className="w-20 h-20 rounded-full mr-4 bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Logo</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            {team.name === 'No Team Selected' && user?.teamName ? user.teamName : team.name}
          </h1>
          <div className="flex items-center gap-3">
            {coachPicPath ? (
              <img src={coachPicPath} alt="Coach" className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <UserCircle size={20} className="text-slate-300" />
              </div>
            )}
            <div>
              <p className="text-slate-800 font-bold text-sm leading-tight">{user?.name || team.coachName || "Alvaro Arbeloa"}</p>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter leading-none mt-0.5">
                {user?.coachingLicense || "Elite Manager"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start space-x-2 mb-6 h-7">
        {streak.length > 0 ?
          streak.map((result, index) => <StreakBox key={index} result={result} />)
          : <p className="text-sm text-gray-400 italic">No matches played yet.</p>
        }
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-center mb-8">
        <div><p className="text-gray-500 text-sm">Matches</p><p className="font-bold text-2xl text-gray-800">{stats.matches || 0}</p></div>
        <div><p className="text-gray-500 text-sm">Goals Scored</p><p className="font-bold text-2xl" style={{ color: '#00529F' }}>{stats.goalsScored || 0}</p></div>
        <div><p className="text-gray-500 text-sm">Goals Conceded</p><p className="font-bold text-2xl text-gray-800">{stats.goalsConceded || 0}</p></div>
        <div><p className="text-gray-500 text-sm">Assists</p><p className="font-bold text-2xl" style={{ color: '#00529F' }}>{stats.assists || 0}</p></div>
      </div>
      {/* Disabled Scorer/Assist Lists for now as backend doesn't aggregate them yet */}
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

const AddPlayerModal = ({ isOpen, onClose, onAddPlayer, teamId, verifiedToken, onResync }) => {
  // Use passed verifiedToken if available, fallback to Redux just in case
  const { token: reduxToken } = useSelector(state => state.auth);
  const token = verifiedToken || reduxToken;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: '',
    position: 'Forward',
    number: '',
    preferredFoot: 'Right',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem('token');
      // Diagnostic logging
      console.log("[AddPlayerModal] Submit triggered", {
        firstName: !!formData.firstName,
        lastName: !!formData.lastName,
        teamId: teamId,
        reduxToken: token ? `${token.substring(0, 5)}...${token.substring(token.length - 5)}` : 'null',
        lsToken: storedToken ? `${storedToken.substring(0, 5)}...${storedToken.substring(storedToken.length - 5)}` : 'null'
      });

      // Basic validation
      if (!formData.firstName || !formData.lastName || !teamId) {
        toast.error("Please fill in required fields. Missing: " +
          (!formData.firstName ? "First Name " : "") +
          (!formData.lastName ? "Last Name " : "") +
          (!teamId ? "Team Identifier" : ""));
        return;
      }

      const response = await axios.post(`${PLAYER_API_END_POINT}/`, {
        ...formData,
        teamId: teamId // Send teamId as expected by backend
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success("Player added successfully!");
        onAddPlayer(response.data.player);
        onClose();
        setFormData({ // Reset form
          firstName: '', lastName: '', age: '', height: '', weight: '', position: 'Forward', number: '', preferredFoot: 'Right'
        });
      }
    } catch (error) {
      console.error("Error adding player:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired or corrupted. [Click to Resync]", {
          onClick: onResync,
          duration: 5000
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to add player.");
      }
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Add New Player</Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="e.g. 25" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Number</label><input type="number" name="number" value={formData.number} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Position</label>
                      <select name="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                        <option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option>
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Preferred Foot</label>
                      <select name="preferredFoot" value={formData.preferredFoot} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                        <option>Right</option><option>Left</option><option>Both</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none" onClick={onClose}>Cancel</button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">Add Player</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const PlayerRoster = ({ players, onOpenAddModal }) => {
  const [filter, setFilter] = useState('All');

  const filteredPlayers = players.filter(player => {
    if (filter === 'All') return true;
    return player.availabilityStatus === filter; // Changed from attendance to availabilityStatus
  });

  return (
    <div className="w-full lg:w-2/3 xl:w-3/4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">All Players</h2>
        <button onClick={onOpenAddModal} className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition duration-200 shadow-sm">
          Add players
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-4 border-b pb-4">
        <span className="font-semibold text-gray-700">Availability</span>
        <AttendanceDropdown filter={filter} setFilter={setFilter} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{['Name', 'Age', 'Height', 'Weight', 'Position', 'Foot', 'Status'].map(header => (<th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>))}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <tr key={player._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.firstName} {player.lastName} <span className='text-gray-400 text-xs'>#{player.number}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(player)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.height ? `${player.height}cm` : "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.weight ? `${player.weight}kg` : "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.preferredFoot || "Right"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${player.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{player.availabilityStatus || 'Available'}</span>
                  </td>
                </tr>
              ))
            ) : (<tr><td colSpan="7" className="text-center py-20 text-gray-500">No players found.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PlayerStatisticsTable = ({ players, onPlayerClick }) => {
  const categories = Object.entries(ATTRIBUTE_CATEGORIES);

  // Build flat array of all attribute keys in category order
  const allAttrEntries = categories.flatMap(([catName, cat]) =>
    Object.entries(cat.attributes).map(([key, label]) => ({ key, label, catName }))
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {/* Category header row */}
          <tr>
            <th rowSpan="2" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 sticky left-0 z-10">
              Player Name
            </th>
            {categories.map(([catName, cat]) => (
              <th
                key={catName}
                colSpan={Object.keys(cat.attributes).length}
                className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider ${cat.bgClass} ${cat.textClass}`}
              >
                {catName}
              </th>
            ))}
          </tr>
          {/* Sub-attribute header row */}
          <tr>
            {allAttrEntries.map(({ key, label }) => (
              <th
                key={key}
                className="px-3 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {players.length > 0 ? (
            players.map((player) => {
              const attr = player.attributes || {};
              return (
                <tr
                  key={player._id}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  onClick={() => onPlayerClick?.(player)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-0 bg-white z-10">
                    {player.firstName} {player.lastName}
                  </td>
                  {allAttrEntries.map(({ key }) => {
                    const val = attr[key] ?? 50;
                    return (
                      <td key={key} className="px-3 py-3 text-sm text-center whitespace-nowrap">
                        <span className={`font-mono font-semibold ${val >= 80 ? 'text-emerald-600' :
                          val >= 60 ? 'text-blue-600' :
                            val >= 40 ? 'text-gray-600' :
                              'text-red-500'
                          }`}>
                          {val}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={allAttrEntries.length + 1} className="text-center py-20 text-gray-500">
                No statistics available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const PlayerStatisticsPage = ({ players, token, onUpdatePlayer }) => {
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handlePlayerUpdate = (updatedPlayer) => {
    onUpdatePlayer?.(updatedPlayer);
    // Keep local editing state in sync
    if (editingPlayer && editingPlayer._id === updatedPlayer._id) {
      setEditingPlayer(updatedPlayer);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Player Statistics</h2>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          Click a player to edit attributes
        </p>
      </div>
      <PlayerStatisticsTable
        players={players}
        onPlayerClick={(player) => setEditingPlayer(player)}
      />
      {editingPlayer && (
        <AttributeEditor
          player={editingPlayer}
          token={token}
          onUpdate={handlePlayerUpdate}
          onClose={() => setEditingPlayer(null)}
        />
      )}
    </div>
  );
};


// --- Main Page Component ---
export default function TeamPage() {
  const { token, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(initialTeamData);
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('Team');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleResync = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleAddPlayer = (newPlayer) => {
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    setPlayers(prev => prev.map(p => p._id === updatedPlayer._id ? updatedPlayer : p));
  };

  useEffect(() => {
    console.log("[TeamPage] Effect triggered. Token present:", !!token);

    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        };

        // 1. Fetch User's Teams
        const teamRes = await axios.get(`${TEAM_API_END_POINT}/myteams`, config);

        if (teamRes.data.success && teamRes.data.teams.length > 0) {
          const myTeam = teamRes.data.teams[0];
          setTeamData(myTeam);

          // 2. Fetch Players for this Team
          const playerRes = await axios.get(`${PLAYER_API_END_POINT}/team/${myTeam._id}`, config);
          if (playerRes.data.success) {
            setPlayers(playerRes.data.players);
          }
        } else {
          toast.error("No team found for this user.");
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans" style={{ '--primary-blue': '#00529F' }}>
        <header className="mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('Team')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'Team'
                ? 'bg-[var(--primary-blue)] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-blue-100'
                }`}
            >
              Roster
            </button>
            <button
              onClick={() => setActiveTab('Statistics')}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'Statistics'
                ? 'bg-[var(--primary-blue)] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-blue-100'
                }`}
            >
              Player Statistics
            </button>
          </div>
        </header>
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">Loading Team Data...</p>
            </div>
          ) : activeTab === 'Team' ? (
            <div className="flex flex-col lg:flex-row gap-6">
              <TeamSidebar team={teamData} />
              <PlayerRoster
                players={players}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />

              <AddPlayerModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddPlayer={handleAddPlayer}
                teamId={teamData._id || (user?.teams && user.teams[0])}
                verifiedToken={token}
                onResync={handleResync}
              />
            </div>
          ) : (
            <PlayerStatisticsPage players={players} token={token} onUpdatePlayer={handleUpdatePlayer} />
          )}
        </main>
      </div>
    </>
  );
}