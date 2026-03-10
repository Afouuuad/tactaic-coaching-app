const fs = require('fs');

const part1 = `import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BASE_ASSET_URL } from '@/utils/constant';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Calendar,
  Users,
  Activity,
  Video,
  Trophy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Plus,
  Shield,
  Bell,
  Settings,
  UserCircle,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Assets
import possessionGameImg from '@/assets/possession.png';
import counterAttackImg from '@/assets/counter-attack.png';
import longBallsImg from '@/assets/long-balls.png';
import highPressImg from '@/assets/high-press.png';
import zoneMarkingImg from '@/assets/zone-marking.png';

const DashboardCard = ({ title, icon: Icon, children, className = "", action }) => (
  <div className={\`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow duration-150 \${className}\`}>
    <div className="p-4 border-b-2 border-cyan-500 flex justify-between items-center bg-white">
      <div className="flex items-center gap-3">
        {Icon && <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-md"><Icon size={18} /></div>}
        <h3 className="font-bold tracking-tight text-slate-800">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon, trend, action }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-sm transition-shadow duration-150">
    <div>
      <p className="text-xs font-bold text-slate-500 mb-1 tracking-wide uppercase flex items-center gap-2">
        {label}
        {action && (
          <button
            onClick={action.onClick}
            className="text-cyan-600 hover:text-white bg-cyan-50 hover:bg-cyan-500 rounded p-0.5 transition-colors"
            title={action.tooltip}
          >
            <Plus size={12} strokeWidth={3} />
          </button>
        )}
      </p>
      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
      {trend && <p className="text-xs text-cyan-600 font-bold mt-1 tracking-tight">{trend}</p>}
    </div>
    <div className="h-12 w-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 border border-cyan-100">
      <Icon size={24} />
    </div>
  </div>
);

// LeagueTableWidget removed per pivot to internal Event-Based data.

const SquadStatusWidget = ({ players, navigate }) => {
  if (!players || players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Users className="text-slate-300" size={32} />
        </div>
        <h4 className="font-bold tracking-tight text-slate-800">Roster Management</h4>
        <p className="text-xs text-slate-500 max-w-[200px] mb-4 font-medium">Add players to your squad to start building lineups.</p>
        <Button onClick={() => navigate('/team')} variant="outline" size="sm" className="font-bold text-slate-800">Add First Player</Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex flex-col">
        {players.slice(0, 5).map((player) => (
          <div key={player._id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-150 cursor-pointer px-2"
            onClick={() => navigate('/team')}
          >
            <div className="flex items-center gap-3">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-800">{player.firstName} {player.lastName}</h4>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">{player.position || 'Unassigned'}</p>
              </div>
            </div>
            {/* Tiny Blue Dot Indicator */}
            <div className="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_4px_rgba(59,130,246,0.8)]"></div>
          </div>
        ))}
      </div>
      {players.length > 5 && (
        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-2 pt-2 border-t border-slate-50">
          + {players.length - 5} MORE PLAYERS
        </p>
      )}
    </div>
  );
};


const PlayerLeaderboard = ({ players, navigate }) => {
  const sortedPlayers = [...(players || [])].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0)).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex-1 flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><Trophy size={18} /></div>
          <h3 className="font-bold tracking-tight text-slate-800">Player Leaderboard</h3>
        </div>
        <Button size="sm" variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-800" onClick={() => navigate('/team')}>Full List</Button>
      </div>
      <div className="p-0 flex-1 flex flex-col">
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <div key={player._id || index} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate('/team')}>
              <div className={"w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 " + (index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400')}>
                {index + 1}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-slate-800 truncate">{player.firstName} {player.lastName}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{player.position || 'Unassigned'}</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-lg font-black text-[#00a6c7] leading-none">{player.overallRating || Math.floor(Math.random() * 15 + 75)}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">OVR</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <UserCircle size={32} className="mb-2 opacity-50 text-slate-300" />
            <span className="text-xs font-bold uppercase tracking-widest">No players</span>
          </div>
        )}
      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Squad Form Avg:</span>
          <span className="text-emerald-600 flex items-center gap-1"><TrendingUp size={12} /> +2.4%</span>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [activeFormation, setActiveFormation] = useState([4, 3, 3]);
  const [activeStyle, setActiveStyle] = useState('High Press');

  const [matchStats, setMatchStats] = useState({ wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 });
  const [playerOutput, setPlayerOutput] = useState({ goals: 0, assists: 0, motmAwards: 0 });
  const [discipline, setDiscipline] = useState({ yellowCards: 0, redCards: 0, foulsConceded: 0 });
  const [participation, setParticipation] = useState({ totalAppearances: 0, totalMinutes: 0 });

  // Extended Event-Based Data (Mock defaults for new manual fields)
  const [detailedStats, setDetailedStats] = useState({
    recentForm: ['W', 'D', 'W', 'W', 'L'],
    setPieceGoalsFor: 0,
    setPieceGoalsAgainst: 0,
    secondHalfGoals: 0,
    trainingSessions: 0,
    firstToScoreGames: 0,
    benchImpactGoals: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user?.teams?.[0]) return;
      const teamId = user.teams[0];
      try {
        const [playersRes, eventsRes] = await Promise.all([
          fetch(\`http://localhost:5001/api/players/team/\${teamId}\`, {
            headers: { 'Authorization': \`Bearer \${token}\` }
          }),
          fetch(\`http://localhost:5001/api/events/team/\${teamId}\`, {
            headers: { 'Authorization': \`Bearer \${token}\` }
          })
        ]);

        if (playersRes.ok) {
          const pData = await playersRes.json();
          setPlayers(pData.players || []);
          setPlayerCount(pData.players?.length || 0);
        }

        if (eventsRes.ok) {
          const eData = await eventsRes.json();
          const now = new Date();

          // Split events into upcoming and past
          const upcoming = eData
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setUpcomingEvents(upcoming);

          // Calculate Real Telemetry from Past Logged Matches
          const pastMatches = eData
            .filter(e => e.eventType === 'Match' && e.matchLogged && new Date(e.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setRecentMatches(pastMatches.slice(0, 5));

          let wins = 0, draws = 0, losses = 0;
          let gf = 0, ga = 0, cs = 0, assists = 0;
          let spFor = 0, spAgainst = 0, shg = 0, big = 0, fts = 0;
          let form = [];

          // Training Session Count
          const trainingCount = eData.filter(e => e.eventType === 'Training').length;

          pastMatches.forEach(m => {
            gf += (m.goalsFor || 0);
            ga += (m.goalsAgainst || 0);
            assists += (m.totalAssists || 0);
            spFor += (m.setPieceGoalsFor || 0);
            spAgainst += (m.setPieceGoalsAgainst || 0);
            shg += (m.secondHalfGoals || 0);
            big += (m.benchImpactGoals || 0);
            if (m.firstToScore) fts++;
            if (m.goalsAgainst === 0) cs++;

            if (m.goalsFor > m.goalsAgainst) {
              wins++;
              if (form.length < 5) form.unshift('W'); // Add to start so newer is left
            } else if (m.goalsFor < m.goalsAgainst) {
              losses++;
              if (form.length < 5) form.unshift('L');
            } else {
              draws++;
              if (form.length < 5) form.unshift('D');
            }
          });

          setMatchStats({
            wins, draws, losses, goalsFor: gf, goalsAgainst: ga, cleanSheets: cs
          });

          setPlayerOutput(prev => ({ ...prev, assists }));

          setDetailedStats({
            recentForm: form.length > 0 ? form : ['-'],
            setPieceGoalsFor: spFor,
            setPieceGoalsAgainst: spAgainst,
            secondHalfGoals: shg,
            trainingSessions: trainingCount,
            firstToScoreGames: fts,
            benchImpactGoals: big
          });

        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };
    fetchDashboardData();
  }, [token, user]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const gameStyles = [
    { title: "Possession", img: possessionGameImg },
    { title: "Counter", img: counterAttackImg },
    { title: "High Press", img: highPressImg },
    { title: "Long Balls", img: longBallsImg },
    { title: "Zone Marking", img: zoneMarkingImg },
  ];

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsToShow = 3;
  const maxIndex = Math.max(0, gameStyles.length - itemsToShow);

  const nextSlide = () => {
    setCarouselIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCarouselIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    // Remove bg color so the pattern from Home.jsx shows through
    <div className="font-sans tracking-tight text-slate-800">

      {/* 1. UNIFIED TEAL COMMAND HEADER */}
      <div className="bg-slate-900 text-white shadow-md relative z-10 w-full overflow-hidden">
        <div className="max-w-[1600px] mx-auto">

          {/* Top Row: Global Nav */}
          <div className="flex items-center justify-between px-6 lg:px-10 py-3 border-b border-transparent">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Trophy size={22} className="text-[#00a6c7]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none tracking-tight text-white drop-shadow-sm">TACT AIQ</span>
                <span className="text-[11px] font-medium text-white/90 mt-0.5 tracking-wide">Football Analytics</span>
              </div>
            </div>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm ml-8 lg:ml-12 flex-1">
              <button className="bg-transparent text-white font-bold border-b-2 border-white pb-1" onClick={() => navigate('/')}>Dashboard</button>
              <button className="bg-transparent text-white/80 hover:text-white transition-colors font-medium pb-1" onClick={() => navigate('/team')}>Squad</button>
              <button className="bg-transparent text-white/80 hover:text-white transition-colors font-medium pb-1" onClick={() => navigate('/events')}>Matches</button>
              <button className="bg-transparent text-white/80 hover:text-white transition-colors font-medium pb-1" onClick={() => navigate('/video-analyser')}>Analytics</button>
              <button className="bg-transparent text-white/80 hover:text-white transition-colors font-medium pb-1" onClick={() => {/* Reports */}}>Reports</button>
            </div>

            {/* Right Nav Icons */}
            <div className="flex items-center gap-5">
              <button className="bg-transparent text-white hover:bg-white/10 p-2 rounded-full transition-colors relative">
                <Bell size={20} strokeWidth={2} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#00a6c7]"></span>
              </button>
              <button className="bg-transparent text-white hover:bg-white/10 p-2 rounded-full transition-colors" onClick={() => navigate('/team-setup')}>
                <Settings size={20} strokeWidth={2} />
              </button>
              <div className="w-px h-8 bg-white/20 mx-1 hidden sm:block"></div>
              <div className="flex items-center cursor-pointer bg-[#1e293b] rounded-[18px] p-1 pr-3 border border-white/5 hover:bg-[#334155] transition-colors shadow-sm ml-2" onClick={() => navigate('/profile')}>
                {user?.profilePicture ? (
                  <img src={\`\${BASE_ASSET_URL}\${user.profilePicture.replace(/^(uploads[\\/\\\\])+/, "")}\`} alt="Profile" className="w-[42px] h-[42px] rounded-[16px] object-cover shrink-0" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className="w-[42px] h-[42px] rounded-l-[16px] rounded-r-[6px] bg-[#008ba8] flex items-center justify-center text-white font-black text-sm shrink-0" style={{ display: user?.profilePicture ? 'none' : 'flex' }}>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AA'}
                </div>
                <div className="flex flex-col hidden sm:flex justify-center ml-3 mr-2">
                  <span className="text-sm font-bold text-white leading-none mb-[3px]">{user?.name || 'Alvaro Arbeloa'}</span>
                  <span className="text-[9px] font-black tracking-widest text-[#3b82f6] uppercase leading-none">{user?.role || 'COACH'}</span>
                </div>
                <ChevronDown size={14} strokeWidth={2.5} className="text-white/40 ml-1 hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Middle Row: Club Info */}
          <div className="px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-5 relative group">
              {user?.teamLogo || user?.clubLogo || user?.crest ? (
                <img
                  src={\`\${BASE_ASSET_URL}\${(user.teamLogo || user.clubLogo || user.crest).replace(/^(uploads[\\/\\\\])+/, "")}\`}
                  alt="Club Crest"
                  className="w-20 h-20 lg:w-[110px] lg:h-[110px] rounded-full object-cover border-2 border-slate-700 shadow-lg shrink-0 bg-slate-800"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-20 h-20 lg:w-[110px] lg:h-[110px] rounded-full flex items-center justify-center shrink-0 shadow-lg bg-slate-800 border-2 border-slate-700"
                style={{ display: (user?.teamLogo || user?.clubLogo || user?.crest) ? 'none' : 'flex' }}
              >
                <Shield size={40} className="text-white/20" />
              </div>
              <div className="flex flex-col ml-2">
                <h1 className="text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-none mb-1 shadow-sm">
                  {user?.teamName || 'Marghreb United'}
                </h1>
                <p className="text-sm text-white/90 font-medium">
                  2025/26 Season • La Liga
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 border-none transition-colors font-bold px-5 py-2.5 rounded-xl shadow-sm tracking-wide text-sm"
                onClick={() => navigate('/create-event')}
              >
                <Plus size={18} strokeWidth={3} />
                <span>PLAN EVENT</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: 5 Stat Cards */}
          <div className="px-6 lg:px-10 pb-6 overflow-x-auto no-scrollbar">
            <div className="flex md:grid md:grid-cols-5 gap-4 min-w-[800px]">

              {/* Stat 1: Matches Played */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-5 flex flex-col shadow-sm border border-slate-700/50 transition-transform hover:-translate-y-1">
                <span className="text-xs text-white/95 mb-3 font-medium tracking-wide">Matches Played</span>
                <span className="text-4xl font-bold text-white mb-2 leading-none tracking-tighter">{matchStats.wins + matchStats.draws + matchStats.losses}</span>
                <span className="text-xs text-white/80 font-medium">{matchStats.wins}W {matchStats.draws}D {matchStats.losses}L</span>
              </div>

              {/* Stat 2: Points */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-5 flex flex-col shadow-sm border border-slate-700/50 transition-transform hover:-translate-y-1">
                <span className="text-xs text-white/95 mb-3 font-medium tracking-wide">Points</span>
                <span className="text-4xl font-bold text-white mb-2 leading-none tracking-tighter">{(matchStats.wins * 3) + matchStats.draws}</span>
                <span className="text-xs text-white/80 font-medium">{(matchStats.wins + matchStats.draws + matchStats.losses) > 0 ? Math.round((matchStats.wins / (matchStats.wins + matchStats.draws + matchStats.losses)) * 100) : 0}% Win Rate</span>
              </div>

              {/* Stat 3: Goals Scored */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-5 flex flex-col shadow-sm border border-slate-700/50 transition-transform hover:-translate-y-1">
                <span className="text-xs text-white/95 mb-3 font-medium tracking-wide">Goals</span>
                <span className="text-4xl font-bold text-white mb-2 leading-none tracking-tighter">{matchStats.goalsFor}</span>
                <span className="text-xs text-white/80 font-medium">{(matchStats.wins + matchStats.draws + matchStats.losses) > 0 ? (matchStats.goalsFor / (matchStats.wins + matchStats.draws + matchStats.losses)).toFixed(1) : 0} per match</span>
              </div>

              {/* Stat 4: Clean Sheets */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-5 flex flex-col shadow-sm border border-slate-700/50 transition-transform hover:-translate-y-1">
                <span className="text-xs text-white/95 mb-3 font-medium tracking-wide">Clean Sheets</span>
                <span className="text-4xl font-bold text-white mb-2 leading-none tracking-tighter">{matchStats.cleanSheets}</span>
                <span className="text-xs text-white/80 font-medium">{(matchStats.wins + matchStats.draws + matchStats.losses) > 0 ? Math.round((matchStats.cleanSheets / (matchStats.wins + matchStats.draws + matchStats.losses)) * 100) : 0}% of games</span>
              </div>

              {/* Stat 5: Goals Conceded */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 lg:p-5 flex flex-col shadow-sm border border-slate-700/50 transition-transform hover:-translate-y-1">
                <span className="text-xs text-white/95 mb-3 font-medium tracking-wide">Goals <span className="font-bold">Conceded</span></span>
                <span className="text-4xl font-bold text-white mb-2 leading-none tracking-tighter">{matchStats.goalsAgainst}</span>
                <span className="text-xs text-white/80 font-medium">{(matchStats.wins + matchStats.draws + matchStats.losses) > 0 ? (matchStats.goalsAgainst / (matchStats.wins + matchStats.draws + matchStats.losses)).toFixed(1) : 0} per match</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8">

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
`;
const part2 = `          {/* Column 1: Left (Action & Results) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <DashboardCard title="Upcoming Schedule" icon={Calendar}
              action={<Button onClick={() => navigate('/events')} variant="outline" size="sm" className="font-bold shadow-sm text-xs border-slate-200 text-slate-700 bg-white hover:bg-slate-50">View All</Button>}
            >
              <div className="h-full flex flex-col justify-center">
                {upcomingEvents.length > 0 ? (
                  <div className="flex flex-col gap-4 p-1 px-2 items-center text-center">
                    {(() => {
                      const nextMatch = upcomingEvents.find(e => e.eventType === 'Match') || upcomingEvents[0];
                      const daysAway = Math.max(0, Math.ceil((new Date(nextMatch.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                      return (
                        <div className="w-full relative mt-2">
                          <div className="absolute -top-5 -right-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm z-10 border border-blue-200 flex items-center gap-1">
                            {daysAway === 0 ? 'Today' : \`In \${daysAway} Days\`}
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 h-28 relative overflow-hidden">
                            {nextMatch.eventType === 'Training' ? (
                              <div className="flex flex-col items-center justify-center w-full z-10 relative">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-sm border border-emerald-200">
                                  <ClipboardList size={22} className="text-emerald-600" />
                                </div>
                                <span className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Training Session</span>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs font-bold text-slate-500">{new Date(nextMatch.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                  <div className="flex items-center gap-1">
                                    <MapPin size={10} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{nextMatch.location || 'Training Ground'}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Team A */}
                                <div className="flex flex-col items-center flex-1 z-10 mt-1">
                                  <div className="w-12 h-12 bg-white rounded-full shadow-md border-2 border-slate-200 flex items-center justify-center mb-2">
                                    <Shield size={24} className="text-slate-300" />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 w-[75px] truncate px-1">{user?.teamName || 'Home'}</span>
                                </div>
                                {/* VS & Time */}
                                <div className="flex flex-col items-center justify-center z-10 w-28">
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 drop-shadow-sm">VS</span>
                                  <span className="text-xl font-black text-slate-800 tracking-tighter bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{new Date(nextMatch.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  <div className="flex items-center gap-1 mt-1.5 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-slate-200">
                                    <MapPin size={10} className="text-slate-500" />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">Venue: {nextMatch.location || 'Home'}</span>
                                  </div>
                                </div>
                                {/* Team B */}
                                <div className="flex flex-col items-center flex-1 z-10 mt-1">
                                  <div className="w-12 h-12 bg-white rounded-full shadow-md border-2 border-slate-200 flex items-center justify-center mb-2">
                                    <Shield size={24} className="text-slate-300" />
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 w-[75px] truncate px-1">{nextMatch.opponent || 'TBA'}</span>
                                </div>
                              </>
                            )}
                            {/* BG Texture */}
                            <Activity size={120} className="absolute text-slate-200/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
                          </div>
                          <Button className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold tracking-wider uppercase text-xs h-11 shadow-sm transition-all" onClick={() => navigate('/team')}>
                            Check available Players
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 relative overflow-hidden h-full">
                    <Calendar size={28} className="mb-2 opacity-50 text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No events planned</span>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Matches - New Styled Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm w-full flex flex-col">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-950 p-5">
                <h3 className="font-bold text-lg text-white tracking-tight leading-none mb-1">Recent Matches</h3>
                <p className="text-blue-100/80 text-sm font-medium">Last 5 games performance</p>
              </div>

              {/* Match List */}
              <div className="p-4 flex flex-col gap-3">
                {recentMatches.length > 0 ? (
                  recentMatches.map((m) => {
                    const isWin = m.goalsFor > m.goalsAgainst;
                    const isLoss = m.goalsFor < m.goalsAgainst;

                    // Generate mock xG data for visuals if not available
                    const xGFor = m.xGFor || (Math.random() * (4.0 - 0.5) + 0.5).toFixed(1);
                    const xGAgainst = m.xGAgainst || (Math.random() * (3.0 - 0.2) + 0.2).toFixed(1);

                    return (
                      <div key={m._id} className="bg-[#fbfcff] border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-slate-200 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer" onClick={() => navigate(\`/events/\${m._id}\`)}>

                        {/* Left: Team & Opponent */}
                        <div className="flex flex-col w-[35%] shrink-0">
                          <span className="text-[11px] font-bold text-slate-400 mb-2 leading-none">
                            {new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className={\`text-[15px] font-black leading-tight \${isWin ? 'text-[#00a6c7]' : isLoss ? 'text-slate-800' : 'text-[#00a6c7]'}\`}>Marghreb</span>
                          <span className={\`text-[15px] font-black leading-tight \${isLoss ? 'text-[#00a6c7]' : isWin ? 'text-slate-800' : 'text-slate-800'}\`}>{m.opponent}</span>
                        </div>

                        {/* Center: Score & xG */}
                        <div className="flex flex-col items-center justify-center min-w-[80px]">
                          <span className="text-[22px] font-black text-slate-900 tracking-widest leading-none mb-1">
                            {m.goalsFor} - {m.goalsAgainst}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                            xG: {xGFor} - {xGAgainst}
                          </span>
                        </div>

                        {/* Right: W/D/L Badge & Icon */}
                        <div className="flex flex-col items-end justify-center w-[30%] shrink-0 gap-2">
                          {isWin ? (
                            <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-black text-sm shadow-sm">W</div>
                          ) : isLoss ? (
                            <div className="w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-black text-sm shadow-sm">L</div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-black text-sm shadow-sm">D</div>
                          )}

                          {isWin ? (
                            <TrendingUp size={18} strokeWidth={2.5} className="text-[#10b981] mr-1" />
                          ) : isLoss ? (
                            <TrendingDown size={18} strokeWidth={2.5} className="text-[#ef4444] mr-1" />
                          ) : (
                            <div className="w-4 h-[3px] bg-[#f59e0b] rounded-full mr-2 mt-2" />
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-12 text-center flex-1 flex flex-col justify-center items-center">
                    <Trophy size={32} className="mx-auto text-slate-300 mb-3" />
                    <span className="text-sm font-bold text-slate-500">No Match Data Logged</span>
                  </div>
                )}
              </div>

              {/* Bottom Telemetry Summary Row */}
              {recentMatches.length > 0 && (
                <div className="grid grid-cols-3 gap-3 p-4 pt-1 mt-2">
                  <div className="bg-[#f0fdf4] rounded-xl flex flex-col items-center justify-center p-3 border border-[#bbf7d0]/50">
                    <span className="text-xl font-black text-[#15803d] leading-none mb-1">
                      {Math.round((recentMatches.filter(m => m.goalsFor > m.goalsAgainst).length / recentMatches.length) * 100)}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide cursor-default">Win Rate</span>
                  </div>
                  <div className="bg-[#f0f9ff] rounded-xl flex flex-col items-center justify-center p-3 border border-[#bae6fd]/50">
                    <span className="text-xl font-black text-[#0369a1] leading-none mb-1">
                      {(recentMatches.reduce((acc, curr) => acc + curr.goalsFor, 0) / recentMatches.length).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide cursor-default">Avg Goals</span>
                  </div>
                  <div className="bg-[#faf5ff] rounded-xl flex flex-col items-center justify-center p-3 border border-[#e9d5ff]/50">
                    <span className="text-xl font-black text-[#7e22ce] leading-none mb-1">
                      2.1
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide cursor-default">Avg xG</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Center (Preparation & Leaderboard) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <DashboardCard title="Squad Status" icon={Users}
              action={<Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md text-xs" onClick={() => navigate('/team')}>Manage</Button>}
            >
              <SquadStatusWidget players={players} navigate={navigate} />
            </DashboardCard>

            <PlayerLeaderboard players={players} navigate={navigate} />
          </div>

          {/* Column 3: Right (Tactics) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Tactical Setup (Blue Gradient Card) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 bg-blue-900 border-b border-blue-950 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-1.5 bg-white/20 text-white rounded-md backdrop-blur-sm"><Activity size={18} /></div>
                  <h3 className="font-bold tracking-tight text-white">Tactical Setup</h3>
                </div>
                <Activity size={120} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.08] text-white pointer-events-none" />
              </div>
              <div className="p-6">
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Formation Base</span>
                    <div className="flex flex-wrap gap-2">
                      {[[4, 3, 3], [4, 2, 3, 1], [3, 5, 2], [4, 4, 2]].map((formArr) => {
                        const formLabel = formArr.join('-');
                        const isActive = activeFormation.join('-') === formLabel;
                        return (
                          <button key={formLabel}
                            onClick={() => setActiveFormation(formArr)}
                            className={\`px-4 py-1.5 text-xs font-bold rounded-full transition-all border \${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'}\`}
                          >
                            {formLabel}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <Button onClick={() => navigate('/game-plan')} className="text-xs font-bold bg-blue-800 text-white hover:bg-blue-900 transition-colors shadow-sm">Tactical Board</Button>
                </div>

                <div className="mb-6">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Playing Style</span>
                  <div className="flex flex-wrap gap-2">
                    {['High Press', 'Possession', 'Counter Attack', 'Deep Defense'].map((style) => {
                      const isActive = style === activeStyle;
                      return (
                        <button key={style}
                          onClick={() => setActiveStyle(style)}
                          className={\`px-4 py-1.5 text-xs font-bold rounded-full transition-all border \${isActive ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-600/20' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'}\`}
                        >
                          {style}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-[#3e8533] rounded-xl p-4 h-[220px] relative border-4 border-white shadow-inner flex flex-col justify-between overflow-hidden">
                  {/* Draw Field Lines visually */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40 -translate-y-1/2 z-0"></div>
                  <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
                  <div className="absolute left-1/2 top-[48%] h-2 w-2 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
                  {/* Penalty box mock */}
                  <div className="absolute left-1/2 bottom-0 w-32 h-10 border-2 border-b-0 border-white/40 -translate-x-1/2 z-0"></div>
                  <div className="absolute left-1/2 top-0 w-32 h-10 border-2 border-t-0 border-white/40 -translate-x-1/2 z-0"></div>

                  {/* Render active formation grid dynamically */}
                  <div className="relative w-full h-full flex flex-col justify-end gap-3 z-10 py-1">

                    {/* Render Att -> Mid -> Def -> GK logic simply by mapping rows */}
                    {/* Reverse the array to map lines from top of field to bottom */}
                    <div className="flex justify-around items-center w-full px-12 mt-2">
                      {Array.from({ length: activeFormation[activeFormation.length - 1] || 1 }).map((_, j) => (
                        <div key={j} className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                      ))}
                    </div>

                    {/* Middle lines */}
                    {activeFormation.slice(1, -1).reverse().map((count, i) => (
                      <div key={i} className="flex justify-around items-center w-full px-8 mt-auto">
                        {Array.from({ length: count }).map((_, j) => (
                          <div key={j} className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                        ))}
                      </div>
                    ))}

                    {/* Defensive line */}
                    <div className="flex justify-around items-center w-full px-6 mt-auto">
                      {Array.from({ length: activeFormation[0] || 4 }).map((_, j) => (
                        <div key={j} className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                      ))}
                    </div>

                    {/* Goalkeeper */}
                    <div className="flex justify-center w-full mt-auto mb-1">
                      <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-white shadow-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
`;

const leaderCode = `
const PlayerLeaderboard = ({ players, navigate }) => {
  const [activeTab, setActiveTab] = useState('goals');

  // Helper to ensure 'stats' object exists safely handling undefined
  const safePlayers = (players || []).map(p => ({
    ...p,
    stats: p.stats || { goals: 0, assists: 0, motmAwards: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0 }
  }));

  // Generous mock data if real data is all 0
  const hasRealData = safePlayers.some(p => p.stats?.goals > 0 || p.stats?.assists > 0);
  
  const playersToUse = hasRealData ? safePlayers : safePlayers.map((p, i) => ({
    ...p,
    stats: {
      goals: Math.floor(Math.random() * 8 + 1),
      assists: Math.floor(Math.random() * 6 + 1),
    }
  }));

  const topGoals = [...playersToUse].sort((a, b) => (b.stats.goals) - (a.stats.goals)).slice(0, 3);
  const topAssists = [...playersToUse].sort((a, b) => (b.stats.assists) - (a.stats.assists)).slice(0, 3);
  const topContributions = [...playersToUse].sort((a, b) => ((b.stats.goals + b.stats.assists) - (a.stats.goals + a.stats.assists))).slice(0, 3);

  const renderList = (list, statKey, label) => (
    <div className="flex flex-col">
      {list.length > 0 ? (
        list.map((player, index) => {
          const statValue = statKey === 'contributions' ? (player.stats.goals + player.stats.assists) : player.stats[statKey];
          return (
            <div key={player._id || index} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer px-1" onClick={() => navigate('/team')}>
              <div className={"w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 " + (index === 0 ? 'bg-amber-100 text-amber-600 shadow-sm ring-1 ring-amber-200' : index === 1 ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-600/80')}>
                {index + 1}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className={"text-sm font-bold truncate " + (index === 0 ? "text-slate-900" : "text-slate-700")}>{player.firstName} {player.lastName}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{player.position || 'Unassigned'}</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className={"text-xl font-black leading-none drop-shadow-sm " + (index === 0 ? "text-[#00a6c7]" : "text-slate-800")}>{statValue}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400">
          <UserCircle size={24} className="mb-2 opacity-50 text-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-widest">No Data</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><Trophy size={16} /></div>
          <h3 className="font-bold tracking-tight text-slate-800 text-sm">Player Leaderboard</h3>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 pt-2 bg-slate-50">
        <button 
          onClick={() => setActiveTab('goals')}
          className={"flex-1 pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 " + (activeTab === 'goals' ? 'border-[#00a6c7] text-[#00a6c7]' : 'border-transparent text-slate-400 hover:text-slate-600')}
        >
          Goals
        </button>
        <button 
          onClick={() => setActiveTab('assists')}
          className={"flex-1 pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 " + (activeTab === 'assists' ? 'border-[#00a6c7] text-[#00a6c7]' : 'border-transparent text-slate-400 hover:text-slate-600')}
        >
          Assists
        </button>
        <button 
          onClick={() => setActiveTab('contributions')}
          className={"flex-1 pb-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 " + (activeTab === 'contributions' ? 'border-[#00a6c7] text-[#00a6c7]' : 'border-transparent text-slate-400 hover:text-slate-600')}
        >
          Contribs
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-[220px]">
        {activeTab === 'goals' && renderList(topGoals, 'goals', 'Goals')}
        {activeTab === 'assists' && renderList(topAssists, 'assists', 'Assists')}
        {activeTab === 'contributions' && renderList(topContributions, 'contributions', 'G+A')}
      </div>
      
      <div className="bg-slate-50 p-3 border-t border-slate-100 mt-auto flex justify-center">
        <Button size="sm" variant="ghost" className="text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest w-full" onClick={() => navigate('/team')}>
          View Full Squad Stats
        </Button>
      </div>
    </div>
  );
};
`
fs.writeFileSync('c:/Users/fouad/Desktop/tactaiq-test - Copy/Football Coaching App/frontend/src/components/Home/HeroSection.jsx', part1.replace('const PlayerLeaderboard = ({ players, navigate }) => {', leaderCode + '\nconst _OldPlayerLeaderboard = ({ players, navigate }) => {') + part2);
