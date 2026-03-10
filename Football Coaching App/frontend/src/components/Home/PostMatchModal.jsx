import React, { useState, useEffect } from 'react';
import { X, Trophy, AlertCircle, Plus, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PostMatchModal = ({ isOpen, onClose, onSuccess, events, players, token }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [selectedEventId, setSelectedEventId] = useState('');
    const [goalsFor, setGoalsFor] = useState(1);
    const [goalsAgainst, setGoalsAgainst] = useState(0);

    const [goalscorers, setGoalscorers] = useState([]);
    const [assists, setAssists] = useState([]);

    // Fetch unlogged matches that are in the past
    const unloggedMatches = (events || []).filter(e => e.eventType === 'Match' && !e.matchLogged && new Date(e.date) < new Date());

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            if (unloggedMatches.length > 0) {
                setSelectedEventId(unloggedMatches[0]._id);
            } else {
                setSelectedEventId('');
            }
            setGoalsFor(1);
            setGoalsAgainst(0);
            setGoalscorers([]);
            setAssists([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNextScore = () => {
        if (!selectedEventId) {
            toast.error('Please select a match to log.');
            return;
        }

        // Automatically prefill rows
        const initGoals = [];
        if (goalsFor > 0) {
            initGoals.push({ playerId: players[0]?._id, amount: goalsFor });
        }
        setGoalscorers(initGoals);

        if (goalsFor === 0) {
            // Skip goalscorers and assists entirely if we scored 0 goals
            submitReport();
        } else {
            setStep(2);
        }
    };

    const handleNextGoalscorers = () => {
        // Validate sums
        const totalGoalsAssigned = goalscorers.reduce((s, g) => s + Number(g.amount || 0), 0);
        if (totalGoalsAssigned > goalsFor) {
            toast.error(`You assigned ${totalGoalsAssigned} goals, but only scored ${goalsFor}.`);
            return;
        }
        if (totalGoalsAssigned < goalsFor && goalscorers.length > 0) {
            toast.warning(`You achieved ${goalsFor} goals, but only tracked ${totalGoalsAssigned} scorers. Proceeding...`);
        }

        setAssists([]);
        setStep(3);
    };

    const submitReport = async () => {
        try {
            setLoading(true);

            const payload = {
                goalsFor: Number(goalsFor),
                goalsAgainst: Number(goalsAgainst),
                goalscorers: goalscorers.filter(g => g.playerId && g.amount > 0),
                assists: assists.filter(a => a.playerId && a.amount > 0)
            };

            const res = await fetch(`http://localhost:5001/api/events/${selectedEventId}/log-match`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            toast.success('Match result logged successfully!');
            onSuccess(); // Refresh dashboard stats
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to submit match report.');
        } finally {
            setLoading(false);
        }
    };

    const addScorerRow = () => setGoalscorers([...goalscorers, { playerId: players[0]?._id, amount: 1 }]);
    const updateScorer = (idx, field, val) => {
        const updated = [...goalscorers];
        updated[idx][field] = val;
        setGoalscorers(updated);
    };
    const removeScorer = (idx) => setGoalscorers(goalscorers.filter((_, i) => i !== idx));

    const addAssistRow = () => setAssists([...assists, { playerId: players[0]?._id, amount: 1 }]);
    const updateAssist = (idx, field, val) => {
        const updated = [...assists];
        updated[idx][field] = val;
        setAssists(updated);
    };
    const removeAssist = (idx) => setAssists(assists.filter((_, i) => i !== idx));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center border border-cyan-100 shadow-sm">
                            <Activity className="text-cyan-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Post-Match Report</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Log Result & Stats Step {step}/3</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {unloggedMatches.length === 0 ? (
                        <div className="text-center py-10">
                            <Trophy size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-sm font-bold text-slate-600">No unlogged matches available.</p>
                            <p className="text-xs text-slate-500 mt-1">Make sure you have past match events created.</p>
                        </div>
                    ) : (
                        <>
                            {/* STEP 1: SCORE */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Match</label>
                                        <select
                                            value={selectedEventId}
                                            onChange={(e) => setSelectedEventId(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                                        >
                                            {unloggedMatches.map(m => (
                                                <option key={m._id} value={m._id}>
                                                    {new Date(m.date).toLocaleDateString()} - vs {m.opponent || 'TBA'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Goals Scored</label>
                                            <input
                                                type="number" min="0"
                                                value={goalsFor} onChange={(e) => setGoalsFor(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xl font-black rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 text-center outline-none"
                                            />
                                            <p className="text-[10px] text-slate-400 font-bold text-center">OUR TEAM</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Goals Conceded</label>
                                            <input
                                                type="number" min="0"
                                                value={goalsAgainst} onChange={(e) => setGoalsAgainst(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xl font-black rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 text-center outline-none"
                                            />
                                            <p className="text-[10px] text-slate-400 font-bold text-center">OPPOSITION</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: GOALSCORERS */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Log Goalscorers ({goalsFor} Goals To Assign)</label>
                                        <Button size="sm" variant="outline" className="h-8 text-[10px] px-2" onClick={addScorerRow}>
                                            <Plus size={12} className="mr-1" /> Add Player
                                        </Button>
                                    </div>

                                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                                        {goalscorers.map((scorer, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <select
                                                    value={scorer.playerId}
                                                    onChange={(e) => updateScorer(i, 'playerId', e.target.value)}
                                                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 outline-none"
                                                >
                                                    {players.map(p => (
                                                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number" min="1"
                                                    value={scorer.amount} onChange={(e) => updateScorer(i, 'amount', e.target.value)}
                                                    className="w-16 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 text-center outline-none"
                                                />
                                                <button onClick={() => removeScorer(i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        {goalscorers.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No specific scorers tracked.</p>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: ASSISTS */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Log Assists</label>
                                        <Button size="sm" variant="outline" className="h-8 text-[10px] px-2" onClick={addAssistRow}>
                                            <Plus size={12} className="mr-1" /> Add Player
                                        </Button>
                                    </div>

                                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                                        {assists.map((assist, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <select
                                                    value={assist.playerId}
                                                    onChange={(e) => updateAssist(i, 'playerId', e.target.value)}
                                                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 outline-none"
                                                >
                                                    {players.map(p => (
                                                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number" min="1"
                                                    value={assist.amount} onChange={(e) => updateAssist(i, 'amount', e.target.value)}
                                                    className="w-16 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2 text-center outline-none"
                                                />
                                                <button onClick={() => removeAssist(i)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        {assists.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No assists tracked.</p>}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {unloggedMatches.length > 0 && (
                    <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                        {step > 1 && (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} className="font-bold text-slate-500 h-10">Back</Button>
                        )}

                        {step === 1 && (
                            <Button onClick={handleNextScore} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-10 px-6">Next</Button>
                        )}
                        {step === 2 && (
                            <Button onClick={handleNextGoalscorers} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-10 px-6">Next</Button>
                        )}
                        {step === 3 && (
                            <Button onClick={submitReport} disabled={loading} className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold h-10 px-8 shadow-md">
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostMatchModal;
