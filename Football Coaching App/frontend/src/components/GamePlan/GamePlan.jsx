import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import formationsData from './formations.json';
import { GAMEPLAN_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { RefreshCw, Users } from 'lucide-react';

const initialLineup = [];

export default function GamePlan() {
  const { user, token } = useSelector((state) => state.auth);
  const [lineup, setLineup] = useState(initialLineup);
  const [roster, setRoster] = useState([]); // All players
  const [formation, setFormation] = useState("4-3-3_Attack");

  // Drag State for Pitch
  const [draggingId, setDraggingId] = useState(null);

  // Drag State for Sidebar
  const [sidebarDragPlayer, setSidebarDragPlayer] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);

  const [activeSwapId, setActiveSwapId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fieldRef = useRef(null);

  const teamId = user?.teams?.[0];

  // Fetch Full Roster (for the Sidebar)
  const fetchRoster = async () => {
    if (!teamId || !token) return;
    try {
      const response = await fetch(`http://localhost:5001/api/players/team/${teamId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRoster(data.players || []);
      }
    } catch (e) {
      console.error("Roster fetch error:", e);
    }
  };

  // Load an Empty Formation Template
  const loadEmptyFormation = (selectedFormation) => {
    const formationCoords = formationsData[selectedFormation];
    if (!formationCoords) {
      console.error("Visual coordinates not found for formation:", selectedFormation);
      setLineup([]);
      return;
    }

    const emptyLineup = formationCoords.map((coord, index) => ({
      id: `empty-${index}`,
      role: coord.role,
      name: "Empty",
      fit: 0,
      x: coord.x,
      y: coord.y,
      alternatives: []
    }));

    setLineup(emptyLineup);
  };

  // Fetch Latest Saved Game Plan
  const fetchLatestGamePlan = async () => {
    if (!teamId || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${GAMEPLAN_API_END_POINT}/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      const savedPlans = response.data;
      if (savedPlans && savedPlans.length > 0) {
        // Use the most recently saved
        const latestPlan = savedPlans[0];
        setFormation(latestPlan.formation);

        const formationCoords = formationsData[latestPlan.formation];
        if (!formationCoords) return loadEmptyFormation("4-3-3_Attack");

        // We need player details. Fortunately we just fetched the roster!
        // The lineup restoration must wait for roster to populate if we do it cleanly, 
        // so we map with fallback names until the roster sync kicks in, or we do a bulk roster fetch first.

        const restoredLineup = formationCoords.map((coord, index) => {
          const playerId = latestPlan.startingXI ? latestPlan.startingXI[coord.role] : null;
          // If we have roster data, map the name
          let playerName = "Unknown";
          if (playerId) {
            // We will sync names in a secondary effect after roster loads, or just rely on backend IDs for now
            // Since roster is fetched asynchronously parallel to this, we might not have it yet.
            playerName = "Player"; // Placeholder
          }

          if (playerId) {
            return {
              id: playerId,
              backendId: playerId,
              role: coord.role,
              name: playerName, // Will be updated by useEffect sync
              fit: 85, // Mock generic fit
              x: coord.x,
              y: coord.y,
              alternatives: []
            };
          } else {
            return {
              id: `empty-${index}`,
              role: coord.role,
              name: "Empty",
              fit: 0,
              x: coord.x,
              y: coord.y,
              alternatives: []
            };
          }
        });
        setLineup(restoredLineup);
        toast.success("Loaded your latest Game Plan.");
      } else {
        // Fallback to empty default
        loadEmptyFormation(formation);
      }
    } catch (e) {
      console.error("Failed to fetch latest game plan", e);
      loadEmptyFormation(formation);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Game Plan from Backend (Smart AI Suggestion)
  const suggestBest11 = async (selectedFormation) => {
    if (!teamId || !token) {
      console.warn("Missing teamId or token for Game Plan fetch");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post(
        `${GAMEPLAN_API_END_POINT}/generate`,
        { teamId, formation: selectedFormation },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      const { startingXI = {}, analysis = [] } = response.data || {};
      const formationCoords = formationsData[selectedFormation];

      if (!formationCoords) {
        setLineup([]);
        return;
      }

      // Merge Visual Coordinates with API Player Data
      const newLineup = formationCoords.map((coord, index) => {
        const playerData = Array.isArray(analysis) ? analysis.find(a => a.position === coord.role) : null;

        if (playerData) {
          return {
            id: playerData.id || playerData.name || `player-${index}`,
            backendId: startingXI[coord.role],
            role: coord.role,
            name: playerData.name || "Unknown",
            fit: Math.round(playerData.score || 0),
            x: coord.x,
            y: coord.y,
            alternatives: [] // For local alternatives later
          };
        } else {
          return {
            id: `empty-${index}`,
            role: coord.role,
            name: "Empty",
            fit: 0,
            x: coord.x,
            y: coord.y,
            alternatives: []
          };
        }
      });

      setLineup(newLineup);
      toast.success("AI suggested optimal lineup applied!");

    } catch (error) {
      console.error("Error fetching game plan:", error);
      toast.error("Could not generate lineup. Ensure your squad has enough players.");
      // We don't wipe the lineup on error anymore, just keep the current state or empty it if it's completely broken
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Game Plan to Backend
  const saveGamePlan = async () => {
    if (!teamId || !token) return;

    // Convert lineup array back to startingXI dictionary map
    const startingXI = {};
    lineup.forEach(p => {
      if (p.backendId) {
        startingXI[p.role] = p.backendId;
      }
    });

    const substitutes = reservePlayers.map(p => p._id);

    try {
      const payload = {
        teamId,
        name: `Tactical Setup ${new Date().toLocaleDateString()}`,
        formation,
        style: 'Balanced', // Defaulting for now
        startingXI,
        substitutes
      };

      await axios.post(`${GAMEPLAN_API_END_POINT}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      toast.success("Game plan saved successfully!");
    } catch (e) {
      console.error("Failed to save game plan", e);
      toast.error("Failed to save your game plan.");
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchRoster();
      fetchLatestGamePlan();
    }
  }, [teamId]);

  // Sync player names from roster once roster is loaded
  useEffect(() => {
    if (roster.length > 0 && lineup.length > 0) {
      setLineup(prev => prev.map(p => {
        if (p.backendId && p.name === "Player") {
          const rosterMatch = roster.find(r => r._id === p.backendId);
          if (rosterMatch) {
            return { ...p, name: `${rosterMatch.firstName} ${rosterMatch.lastName}` };
          }
        }
        return p;
      }));
    }
  }, [roster]);

  const handleFormationChange = (e) => {
    const selected = e.target.value;
    setFormation(selected);
    loadEmptyFormation(selected);
  };

  // Recalculate Reserves (Roster minus Starting XI)
  const activeBackendIds = lineup.map(p => p.backendId).filter(id => id);
  const reservePlayers = roster.filter(player => !activeBackendIds.includes(player._id));

  // --- Drag & Drop Handlers (Sidebar to Pitch) ---
  const handleDragStartFromSidebar = (e, player) => {
    setSidebarDragPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOverNode = (e, role) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
    if (hoveredRole !== role) setHoveredRole(role);
  };

  const handleDragLeaveNode = () => {
    setHoveredRole(null);
  };

  const handleDropOnNode = (e, targetRole) => {
    e.preventDefault();
    setHoveredRole(null);
    if (!sidebarDragPlayer) return;

    // Direct swap from sidebar to node
    setLineup(prev => prev.map(p => {
      if (p.role === targetRole) {
        return {
          ...p,
          id: sidebarDragPlayer._id,
          backendId: sidebarDragPlayer._id,
          name: `${sidebarDragPlayer.firstName} ${sidebarDragPlayer.lastName}`,
          // Optional: Calculate fit client-side or assign generic fit until backend sync
          fit: 85 // Mock generic fit for manual drops
        };
      }
      return p;
    }));

    // Clear drag state
    setSidebarDragPlayer(null);
  };

  const handleDragEndSidebar = () => {
    setSidebarDragPlayer(null);
    setHoveredRole(null);
  };

  // --- Click & Swap Handlers (Pitch to Pitch) ---
  const handlePitchPlayerDoubleClick = (e, player) => {
    e.stopPropagation();
    if (activeSwapId === player.id) {
      setActiveSwapId(null);
    } else {
      setActiveSwapId(player.id);
    }
  };

  const handlePitchPlayerClick = (e, player) => {
    e.stopPropagation();
    if (activeSwapId) {
      if (activeSwapId === player.id) {
        // Deselect
        setActiveSwapId(null);
      } else {
        // SWAP!
        setLineup(prev => {
          const source = prev.find(p => p.id === activeSwapId);
          const target = prev.find(p => p.id === player.id);
          if (!source || !target) return prev;

          return prev.map(p => {
            if (p.role === source.role) {
              return { ...p, id: target.id, backendId: target.backendId, name: target.name, fit: target.fit };
            }
            if (p.role === target.role) {
              return { ...p, id: source.id, backendId: source.backendId, name: source.name, fit: source.fit };
            }
            return p;
          });
        });
        setActiveSwapId(null);
      }
    }
  };

  const handleSubstituteAlternative = (e, targetPlayerNode, reservePlayer) => {
    e.stopPropagation();
    setLineup(prev => prev.map(p => {
      if (p.id === targetPlayerNode.id) {
        return {
          ...p,
          id: reservePlayer._id,
          backendId: reservePlayer._id,
          name: `${reservePlayer.firstName} ${reservePlayer.lastName}`,
          fit: 85 // mock score for manual drops
        };
      }
      return p;
    }));
    setActiveSwapId(null);
  };

  // --- Map Movement Handlers ---
  const handleMouseMove = (e) => {
    if (draggingId === null || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const newX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const newY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setLineup(prev => prev.map(p =>
      p.id === draggingId ? { ...p, x: newX, y: newY } : p
    ));
  };

  useEffect(() => {
    const stopDragging = () => setDraggingId(null);
    if (draggingId !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [draggingId]);

  return (
    <div className="flex flex-col h-screen bg-[#f3f6f9] select-none font-sans overflow-hidden">
      {/* Universal Navbar replaces custom header */}
      <Navbar />

      {/* Main Content Area: Pitch + Sidebar */}
      <div className="flex flex-grow overflow-hidden relative">

        {/* Left Side: Game Plan */}
        <main className="flex-1 flex flex-col p-4 z-10 min-w-0">

          {/* Tactical Control Bar */}
          <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-4 z-20">
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Tactical Board</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => suggestBest11(formation)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 ${isGenerating ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-emerald-500/20'}`}
              >
                <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                {isGenerating ? 'Analyzing...' : 'Suggest Best 11'}
              </button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <select
                value={formation}
                onChange={handleFormationChange}
                disabled={isGenerating}
                className="bg-slate-100/50 hover:bg-slate-100 focus:bg-white focus:ring-2 ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm font-bold py-2 px-4 rounded-lg border border-slate-200 outline-none cursor-pointer transition-all"
              >
                {Object.keys(formationsData).map(f => (
                  <option key={f} value={f}>Formation: {f.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex-1 flex overflow-hidden relative flex-col">
            {isGenerating && <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 font-bold border-2 border-white/40">Loading Formation Data...</div>}

            <div
              ref={fieldRef}
              onClick={() => setActiveSwapId(null)}
              className="relative flex-1 overflow-hidden m-4 rounded-xl shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border-4 border-emerald-900 bg-emerald-600"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.1) 20%)' }}
            >
              {/* --- Realistic Pitch Markings (unchanged) --- */}
              <div className="absolute inset-4 border-2 border-white/60 pointer-events-none rounded-sm">
                <div className="absolute w-full h-[2px] bg-white/60 top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute w-32 h-32 border-2 border-white/60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute w-2 h-2 bg-white/60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60%] lg:w-[45%] h-[16%] border-2 border-t-0 border-white/60"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[30%] lg:w-[20%] h-[6%] border-2 border-t-0 border-white/60"></div>
                <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-20 h-10 border-2 border-t-0 border-white/60 rounded-b-full overflow-hidden">
                  <div className="w-full h-full border-b-2 border-white/60 rounded-b-full"></div>
                </div>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[60%] lg:w-[45%] h-[16%] border-2 border-b-0 border-white/60"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[30%] lg:w-[20%] h-[6%] border-2 border-b-0 border-white/60"></div>
                <div className="absolute bottom-[16%] left-1/2 transform -translate-x-1/2 w-20 h-10 border-2 border-b-0 border-white/60 rounded-t-full overflow-hidden">
                  <div className="w-full h-full border-t-2 border-white/60 rounded-t-full"></div>
                </div>
              </div>

              {/* --- Players on Pitch --- */}
              {lineup.map(player => (
                <div
                  key={player.id}
                  onMouseDown={() => !activeSwapId && setDraggingId(player.id)}
                  onClick={(e) => handlePitchPlayerClick(e, player)}
                  onDoubleClick={(e) => handlePitchPlayerDoubleClick(e, player)}
                  onDragOver={(e) => handleDragOverNode(e, player.role)}
                  onDragLeave={handleDragLeaveNode}
                  onDrop={(e) => handleDropOnNode(e, player.role)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 ${draggingId === player.id ? 'z-50' : 'z-10'}`}
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transition: draggingId ? 'none' : 'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Drop Target Glow */}
                  {sidebarDragPlayer && hoveredRole === player.role && (
                    <div className="absolute -inset-4 bg-yellow-400/50 rounded-full animate-ping z-0 pointer-events-none"></div>
                  )}

                  {/* Token */}
                  <div className={`relative flex flex-col items-center cursor-grab active:cursor-grabbing z-10 transition-transform ${activeSwapId === player.id ? 'scale-110' : draggingId === player.id ? 'scale-110 drop-shadow-2xl' : hoveredRole === player.role ? 'scale-125' : 'hover:scale-105'}`}>
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] shadow-lg flex items-center justify-center text-white transition-colors duration-300 ${player.name === "Empty"
                      ? 'border-dashed border-white/40 bg-black/20 hover:bg-black/30'
                      : 'border-white bg-gradient-to-tr from-slate-900 via-blue-900 to-blue-700 shadow-blue-900/50'
                      } ${activeSwapId === player.id || hoveredRole === player.role ? 'ring-4 ring-yellow-400 border-yellow-400 !bg-gradient-to-tr !from-yellow-600 !to-yellow-400' : ''}`}>
                      {player.name === "Empty" ? (
                        <span className="text-xl md:text-2xl opacity-50 font-light">+</span>
                      ) : (
                        <span className="font-bold text-base md:text-lg tracking-wider text-shadow">
                          {player.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="absolute -top-2 -right-3 md:-right-4 bg-white text-slate-900 text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded shadow-md border border-slate-200 z-20">
                      {player.role}
                    </div>

                    <div className="mt-1.5 bg-black/70 backdrop-blur-md rounded px-2 py-0.5 shadow-md border border-white/10 max-w-[80px] md:max-w-[100px]">
                      <p className={`text-[9px] md:text-[10px] font-bold text-center truncate ${player.name === "Empty" ? 'text-white/50 italic' : 'text-white'} tracking-wide`}>
                        {player.name}
                      </p>
                    </div>

                    {player.name !== "Empty" && (
                      <div className="mt-1 flex gap-1">
                        <div className={`h-1.5 w-8 rounded-full shadow-inner ${player.fit >= 80 ? 'bg-green-500' : player.fit >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
                      </div>
                    )}
                  </div>

                  {/* Alternatives Pop-up */}
                  {activeSwapId === player.id && (
                    <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-b border-slate-100">
                        Top Alternatives
                      </div>
                      {reservePlayers.length > 0 ? (
                        (() => {
                          const exactMatches = reservePlayers.filter(p => p.position === player.role);
                          const top2 = exactMatches.length > 0 ? exactMatches.slice(0, 2) : reservePlayers.slice(0, 2);
                          return top2.map((alt) => (
                            <div
                              key={alt._id}
                              onClick={(e) => handleSubstituteAlternative(e, player, alt)}
                              className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
                                {alt.number || alt.firstName?.[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{alt.firstName} {alt.lastName}</p>
                                <p className="text-[9px] text-slate-500 uppercase">{alt.position || 'Sub'}</p>
                              </div>
                              <div className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Swap</div>
                            </div>
                          ));
                        })()
                      ) : (
                        <div className="p-3 text-xs text-slate-500 text-center italic">No reserves left</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-3 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Double-click player to view AI alternatives • Drag to reposition</p>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Reserves */}
        <aside className="w-80 bg-white border-l border-slate-200 shadow-[-10px_0_20px_rgba(0,0,0,0.02)] flex flex-col z-20 transition-all duration-300 shrink-0 hidden lg:flex">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              Reserves & Replacements
            </h3>
            <p className="text-xs text-slate-500 mt-1">Drag players onto the pitch to make substitutions.</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 relative">
            {sidebarDragPlayer && (
              <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <p className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg ring-4 ring-blue-600/20 drop-shadow-xl animate-bounce">
                  Drop {sidebarDragPlayer.lastName} onto a position
                </p>
              </div>
            )}

            {reservePlayers.length > 0 ? reservePlayers.map(player => (
              <div
                key={player._id}
                draggable
                onDragStart={(e) => handleDragStartFromSidebar(e, player)}
                onDragEnd={handleDragEndSidebar}
                className={`flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${sidebarDragPlayer?._id === player._id ? 'opacity-30 scale-95' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    <span className="font-bold text-slate-700 group-hover:text-blue-700 text-sm">
                      {player.number || (player.firstName?.[0] + player.lastName?.[0])?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">{player.firstName} {player.lastName}</h4>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{player.position || 'Sub'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center h-6 w-6 rounded-md bg-slate-50 border border-slate-200 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-200 transition-all">
                  <span className="text-lg leading-none cursor-grab">⋮⋮</span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  <Users className="text-slate-300" size={32} />
                </div>
                <h4 className="font-semibold text-slate-700">No Reserves Left</h4>
                <p className="text-sm text-slate-500 mt-2">All players are currently on the pitch.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={saveGamePlan}
              disabled={loading || isGenerating}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Bench & Reserves
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}