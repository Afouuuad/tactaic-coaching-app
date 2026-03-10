import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Target } from 'lucide-react';
import { EVENT_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';

const LogMatchModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, token } = useSelector((store) => store.auth);

    const initialFormState = {
        opponent: '',
        date: new Date().toISOString().split('T')[0],
        homeAway: 'Home',
        goalsFor: 0,
        goalsAgainst: 0,
        totalAssists: 0,
        setPieceGoalsFor: 0,
        setPieceGoalsAgainst: 0,
        secondHalfGoals: 0,
        benchImpactGoals: 0,
        firstToScore: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'number' ? (value === '' ? 0 : parseInt(value, 10)) :
                    value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !user?.teams?.[0]) return;

        setLoading(true);
        const toastId = toast.loading('Saving match report...');

        try {
            const teamId = user.teams[0];
            const payload = {
                ...formData,
                teamId,
                type: 'Match',
                title: `Match vs ${formData.opponent} (${formData.homeAway})`,
                matchLogged: true // Flag indicating this has telemetry data
            };

            await axios.post(EVENT_API_END_POINT, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success('Match report saved globally.', { id: toastId });
            setFormData(initialFormState);
            onSuccess(); // Refresh parent data
            onClose();   // Close modal
        } catch (error) {
            console.error(error);
            toast.error('Failed to save match report.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const NumberInput = ({ id, label, value }) => (
        <div className="space-y-1.5 flex-1">
            <Label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none block">{label}</Label>
            <Input
                id={id}
                name={id}
                type="number"
                min="0"
                value={value}
                onChange={handleChange}
                className="font-mono font-black text-lg h-10 border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md bg-white hover:border-slate-300"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dark Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Stark White Surface Modal */}
            <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col border border-slate-200 max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-2">
                        <Target className="text-cyan-500" size={18} strokeWidth={3} />
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Log Match Report</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md p-1.5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                    <form id="match-log-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Core Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="col-span-1 md:col-span-2 space-y-1.5">
                                <Label htmlFor="opponent" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opponent Team</Label>
                                <Input
                                    id="opponent"
                                    name="opponent"
                                    value={formData.opponent}
                                    onChange={handleChange}
                                    placeholder="e.g. Manchester City"
                                    required
                                    className="h-10 border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md bg-white font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="date" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="h-10 border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-md bg-white font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Core Result Panel */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-5">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Core Result</h3>
                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md">
                                    {['Home', 'Away', 'Neutral'].map(loc => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, homeAway: loc }))}
                                            className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider transition-colors ${formData.homeAway === loc ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 items-center justify-center p-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="goalsFor" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Goals For</Label>
                                    <Input
                                        id="goalsFor"
                                        name="goalsFor"
                                        type="number"
                                        min="0"
                                        value={formData.goalsFor}
                                        onChange={handleChange}
                                        className="w-24 h-16 text-center text-4xl font-mono font-black border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 bg-slate-50"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Label htmlFor="goalsAgainst" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Goals Against</Label>
                                    <Input
                                        id="goalsAgainst"
                                        name="goalsAgainst"
                                        type="number"
                                        min="0"
                                        value={formData.goalsAgainst}
                                        onChange={handleChange}
                                        className="w-24 h-16 text-center text-4xl font-mono font-black border-slate-200 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 bg-slate-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Tally Panel */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Technical Telemetry</h3>

                            <div className="flex flex-wrap gap-4">
                                <NumberInput id="totalAssists" label="Total Assists" value={formData.totalAssists} />
                                <NumberInput id="secondHalfGoals" label="2nd Half Gls" value={formData.secondHalfGoals} />
                                <NumberInput id="benchImpactGoals" label="Bench Goals" value={formData.benchImpactGoals} />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <NumberInput id="setPieceGoalsFor" label="Set-Piece (For)" value={formData.setPieceGoalsFor} />
                                <NumberInput id="setPieceGoalsAgainst" label="Set-Piece (Agnst)" value={formData.setPieceGoalsAgainst} />
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <Label htmlFor="firstToScore" className="text-sm font-bold text-slate-800 cursor-pointer">Did we score first?</Label>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Crucial for tracking in-game momentum and resilience.</p>
                                </div>
                                <Switch
                                    id="firstToScore"
                                    name="firstToScore"
                                    checked={formData.firstToScore}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, firstToScore: checked }))}
                                    className="data-[state=checked]:bg-cyan-500"
                                />
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3 z-10">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="font-bold border-slate-200 text-slate-600 hover:bg-slate-50 uppercase tracking-wider text-xs px-6"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="match-log-form"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md uppercase tracking-wider text-xs px-8"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Match Report'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogMatchModal;
