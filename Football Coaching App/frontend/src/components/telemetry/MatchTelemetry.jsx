import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Activity, Plus, Trophy, ChevronRight, Edit2, Trash2, ClipboardList } from 'lucide-react';
import Navbar from '../shared/Navbar';
import LogMatchModal from './LogMatchModal';
import { EVENT_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const MatchTelemetry = () => {
    const { user, token } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);

    // Aggregate stats derived from fetched matches
    const [stats, setStats] = useState({
        recentForm: [],
        wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0,
        cleanSheets: 0,
        totalAssists: 0,
        setPieceGoalsFor: 0,
        setPieceGoalsAgainst: 0,
        secondHalfGoals: 0,
        benchImpactGoals: 0,
        firstToScoreGames: 0
    });

    const fetchMatches = async () => {
        if (!token || !user?.teams?.[0]) return;
        try {
            const teamId = user.teams[0];
            const res = await axios.get(`${EVENT_API_END_POINT}/team/${teamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Filter only Match events that have been logged (i.e. past/completed with data)
            // For now, we consider a match "logged" if it has opponent data and we can derive a result
            const allEvents = res.data || [];
            const matchEvents = allEvents.filter(e => e.eventType === 'Match' && e.matchLogged);

            // Sort newest first
            const sortedMatches = matchEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMatches(sortedMatches);

            // Calculate aggregate stats
            let wins = 0, draws = 0, losses = 0;
            let gf = 0, ga = 0, cs = 0, assists = 0, spFor = 0, spAgainst = 0;
            let shg = 0, big = 0, fts = 0;
            let form = [];

            sortedMatches.forEach(m => {
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
                    if (form.length < 5) form.push('W');
                } else if (m.goalsFor < m.goalsAgainst) {
                    losses++;
                    if (form.length < 5) form.push('L');
                } else {
                    draws++;
                    if (form.length < 5) form.push('D');
                }
            });

            setStats({
                recentForm: form,
                wins, draws, losses,
                goalsFor: gf, goalsAgainst: ga,
                cleanSheets: cs,
                totalAssists: assists,
                setPieceGoalsFor: spFor,
                setPieceGoalsAgainst: spAgainst,
                secondHalfGoals: shg,
                benchImpactGoals: big,
                firstToScoreGames: fts
            });

        } catch (error) {
            console.error("Failed to fetch match telemetry:", error);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [token, user]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this match record?")) return;
        try {
            await axios.delete(`${EVENT_API_END_POINT}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Match record deleted.");
            fetchMatches();
        } catch (error) {
            toast.error("Failed to delete match.");
            console.error(error);
        }
    };

    const MetricCard = ({ label, value }) => (
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:border-cyan-300 transition-colors shadow-sm flex flex-col justify-center min-h-[100px]">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
            <span className="block text-3xl font-mono font-black text-slate-800 tracking-tighter">{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-12">
            <Navbar />

            {/* Header Banner */}
            <div className="bg-slate-900 border-b border-slate-800 py-10 px-6 lg:px-10">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-cyan-400" size={20} />
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Performance Analysis</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                            Match Telemetry <span className="text-slate-600">&</span> Logs
                        </h1>
                        <p className="text-sm text-slate-400 mt-3 font-medium max-w-2xl">
                            Comprehensive high-level tracking of match outcomes, goal distributions, and specialized team metrics.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsLogModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg font-bold gap-2 transition-all duration-200 uppercase tracking-wider text-sm px-8 py-6 rounded-lg border border-blue-400/30"
                    >
                        <Plus size={18} strokeWidth={3} /> Log New Match
                    </Button>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-8">

                {/* Top Section: Macro Stats */}
                <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                        <Trophy size={18} className="text-cyan-500" /> Executive Metrics
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">

                        {/* Recent Form Panel */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-center shadow-sm col-span-2 md:col-span-4 xl:col-span-1 min-h-[100px]">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Form (Last 5)</span>
                            <div className="flex gap-2.5">
                                {stats.recentForm.length > 0 ? stats.recentForm.map((result, i) => (
                                    <span key={i} className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-black text-white shadow-sm ${result === 'W' ? 'bg-green-500' : result === 'D' ? 'bg-slate-400' : 'bg-rose-500'}`}>
                                        {result}
                                    </span>
                                )) : <span className="text-sm text-slate-400 italic">No matches logged</span>}
                            </div>
                        </div>

                        <MetricCard label="Match Record" value={`${stats.wins}-${stats.draws}-${stats.losses}`} />
                        <MetricCard label="Goal Difference" value={`${stats.goalsFor > stats.goalsAgainst ? '+' : ''}${stats.goalsFor - stats.goalsAgainst}`} />
                        <MetricCard label="Goals Scored" value={stats.goalsFor} />
                        <MetricCard label="Goals Conceded" value={stats.goalsAgainst} />
                        <MetricCard label="Clean Sheets" value={stats.cleanSheets} />
                        <MetricCard label="Total Assists" value={stats.totalAssists} />
                        <MetricCard label="Set-Piece Gls (F/A)" value={`${stats.setPieceGoalsFor} / ${stats.setPieceGoalsAgainst}`} />
                        <MetricCard label="2nd Half Goals" value={stats.secondHalfGoals} />
                        <MetricCard label="Bench Impact Goals" value={stats.benchImpactGoals} />
                    </div>
                </div>

                {/* Bottom Section: Match Archive */}
                <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2 mt-12">
                        <ClipboardList size={18} className="text-cyan-500" /> Match Archive
                    </h2>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Opponent</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Result</th>
                                        <th className="px-6 py-4 text-center">Score</th>
                                        <th className="px-6 py-4 text-center">xStats</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                                    {matches.length > 0 ? matches.map((match) => {
                                        const matchDate = new Date(match.date);
                                        const isWin = match.goalsFor > match.goalsAgainst;
                                        const isLoss = match.goalsFor < match.goalsAgainst;
                                        const resultLabel = isWin ? 'W' : isLoss ? 'L' : 'D';
                                        const resultColor = isWin ? 'bg-green-100 text-green-700 border-green-200' : isLoss ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200';

                                        return (
                                            <tr key={match._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {matchDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900">
                                                    {match.opponent || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {match.homeAway || 'Home'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-black border ${resultColor}`}>
                                                        {resultLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-mono font-black text-lg text-slate-800">
                                                        {match.goalsFor} - {match.goalsAgainst}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-xs text-slate-400">
                                                    {match.firstToScore ? '1stG' : ''} {match.cleanSheets > 0 ? 'CS' : ''}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50"
                                                            onClick={() => navigate(`/events/${match._id}`)}
                                                            title="View Event Details"
                                                        >
                                                            <ChevronRight size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                            onClick={() => handleDelete(match._id)}
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                                <Activity size={32} className="mx-auto mb-3 opacity-30" />
                                                <p className="font-bold text-slate-500">No match records found.</p>
                                                <p className="text-sm mt-1">Log a new match to see telemetry data.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <LogMatchModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSuccess={fetchMatches}
            />
        </div>
    );
};

export default MatchTelemetry;
