import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TEAM_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/canvasUtils';
import {
    Upload,
    ArrowRight,
    ArrowLeft,
    Trophy,
    Users,
    CheckCircle2,
    Calendar,
    Globe,
    Crop as CropIcon,
    X,
    Zap,
    Camera,
    MapPin,
    Briefcase,
    Shield,
    Target,
    UserCircle
} from 'lucide-react';
import Navbar from '../shared/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';

// --- Constants ---
const AGE_GROUPS = [
    'Under 8 (U8)', 'Under 10 (U10)', 'Under 12 (U12)',
    'Under 14 (U14)', 'Under 16 (U16)', 'Under 18 (U18)',
    'Seniors / Adults', 'Veterans'
];

const DIVISIONS = [
    'Premier League', 'Championship', 'National League',
    'Regional League', 'County League', 'Amateur / Grassroots',
    'Youth Academy', 'School / University'
];

const PHILOSOPHIES = [
    'High Pressing (Gegenpressing)', 'Tiki-taka (Possession)',
    'Counter-Attacking', 'Direct / Long Ball',
    'Defensive (Park the Bus)', 'Balanced / Adaptive'
];

const LICENSES = ['UEFA Pro', 'UEFA A', 'UEFA B', 'UEFA C', 'Grassroots', 'None'];
const SPECIALIZATIONS = ['Tactics', 'Player Development', 'Goalkeeping', 'Fitness & Conditioning', 'Mental Performance', 'Scouting'];

const TeamSetup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // --- Form State ---
    const [formData, setFormData] = useState({
        name: '',
        ageGroup: AGE_GROUPS[4],
        division: DIVISIONS[5],
        philosophy: PHILOSOPHIES[5],
        homeGround: '',
        teamFormat: '11v11',
        yearsOfExperience: '1',
        coachingLicense: LICENSES[2],
        specialization: SPECIALIZATIONS[0],
        bio: ''
    });

    // --- Image / Cropping State ---
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(null); // 'logo' or 'profile'

    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [profileFile, setProfileFile] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setShowCropper(type);
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const previewUrl = URL.createObjectURL(croppedImageBlob);

            if (showCropper === 'logo') {
                setLogoPreview(previewUrl);
                setLogoFile(croppedImageBlob);
            } else {
                setProfilePreview(previewUrl);
                setProfileFile(croppedImageBlob);
            }

            setShowCropper(null);
            toast.success("Image adjusted perfectly!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to crop image.");
        }
    };

    const nextStep = () => {
        if (step === 1 && !formData.name) {
            toast.error("Club Name is mandatory.");
            return;
        }
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        if (logoFile) {
            const file = new File([logoFile], "team_logo.jpg", { type: "image/jpeg" });
            submitData.append('teamLogo', file);
        }
        if (profileFile) {
            const file = new File([profileFile], "profile_picture.jpg", { type: "image/jpeg" });
            submitData.append('profilePicture', file);
        }

        try {
            const storedToken = localStorage.getItem('token');
            const token = (storedToken && storedToken !== 'null' && storedToken !== 'undefined') ? storedToken : null;

            const headers = {};

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await axios.post(`${TEAM_API_END_POINT}/setup`, submitData, {
                headers,
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Welcome to the elite tier, Coach!", {
                    style: { backgroundColor: "#28a745", color: "#FFFFFF" },
                });
                setStep(4);
            }
        } catch (error) {
            console.error("Team Setup Error:", error);
            toast.error(error.response?.data?.message || "Failed to setup team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 relative overflow-hidden">
            <Navbar />

            {/* Background Blobs for Premium Feel */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* --- Cropper Modal --- */}
            {showCropper && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <CropIcon size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Adjust {showCropper === 'logo' ? 'Club Badge' : 'Profile Photo'}
                                </h3>
                            </div>
                            <button onClick={() => setShowCropper(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="relative h-96 bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape={showCropper === 'logo' ? "round" : "rect"}
                                showGrid={false}
                            />
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Zoom Intensity</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                            <button onClick={handleCropSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]">
                                Apply Custom Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-col items-center justify-center p-4 py-8 relative z-10">
                <div className="w-full max-w-xl">
                    {/* Stepper Header */}
                    <div className="flex items-center justify-between mb-10 px-4">
                        {[1, 2, 3, 4].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-bold transition-all duration-500 border-2 ${step === s
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-110'
                                    : step > s
                                        ? 'bg-green-500 text-white border-green-500'
                                        : 'bg-white text-gray-300 border-gray-100'
                                    }`}>
                                    {step > s ? <CheckCircle2 size={20} /> : s}
                                </div>
                                {s < 4 && (
                                    <div className="flex-1 mx-3 h-[3px] bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-blue-600 transition-all duration-700 ${step > s ? 'w-full' : 'w-0'}`} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-white/50 p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl">

                        <div className="min-h-[500px] flex flex-col relative z-10">

                            {/* --- Step 1: The Foundation --- */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                                    <div className="text-center space-y-3">
                                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-2 transform -rotate-3 hover:rotate-0 transition-transform shadow-sm">
                                            <Trophy size={40} />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Identity</h2>
                                        <p className="text-gray-500 font-medium">Define your club's presence and visual DNA.</p>
                                    </div>

                                    <div className="flex flex-col items-center py-2">
                                        <div className="relative group w-36 h-36">
                                            <div className={`w-full h-full rounded-full flex items-center justify-center border-4 border-dashed overflow-hidden transition-all duration-500 ${logoPreview ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Club Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center space-y-2">
                                                        <Upload className="w-10 h-10 text-gray-300 group-hover:text-blue-500 mx-auto transition-colors" />
                                                        <span className="text-[10px] font-black text-gray-300 group-hover:text-blue-400">UPLOAD LOGO</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            {logoPreview && (
                                                <div className="absolute top-0 right-0 bg-white p-2 rounded-full border shadow-sm text-blue-600 hover:bg-blue-50 transition-colors pointer-events-none">
                                                    <CropIcon size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Official Club Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. AFC Titans United"
                                                className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all text-gray-800 font-bold placeholder-gray-300 bg-slate-50/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Team Format</label>
                                            <div className="relative">
                                                <select
                                                    name="teamFormat"
                                                    value={formData.teamFormat}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 bg-slate-50/30 border-2 border-slate-100 rounded-2xl outline-none appearance-none font-bold text-gray-700 hover:bg-white hover:border-blue-100 transition-all cursor-pointer"
                                                >
                                                    <option value="5v5">5 v 5</option>
                                                    <option value="7v7">7 v 7</option>
                                                    <option value="9v9">9 v 9</option>
                                                    <option value="11v11">11 v 11 (Pro)</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 border-l pl-3">
                                                    <Users size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Step 2: The Competitive Edge --- */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                                    <div className="text-center space-y-3">
                                        <div className="w-20 h-20 bg-cyan-50 text-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-2 transform rotate-3 hover:rotate-0 transition-transform shadow-sm">
                                            <Zap size={40} />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Territory</h2>
                                        <p className="text-gray-500 font-medium">Where talent meets strategy and grit.</p>
                                    </div>

                                    <div className="space-y-5 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    <Calendar size={14} className="text-cyan-500" /> Age Bracket
                                                </label>
                                                <select
                                                    name="ageGroup"
                                                    value={formData.ageGroup}
                                                    onChange={handleInputChange}
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700 cursor-pointer"
                                                >
                                                    {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest pl-1">
                                                    <Globe size={14} className="text-cyan-500" /> League Tier
                                                </label>
                                                <select
                                                    name="division"
                                                    value={formData.division}
                                                    onChange={handleInputChange}
                                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700 cursor-pointer"
                                                >
                                                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Stadium / Home Base</label>
                                            <input
                                                type="text"
                                                name="homeGround"
                                                value={formData.homeGround}
                                                onChange={handleInputChange}
                                                placeholder="e.g. The Coliseum Grounds"
                                                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tactical Philosophy</label>
                                            <select
                                                name="philosophy"
                                                value={formData.philosophy}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700 cursor-pointer mb-2"
                                            >
                                                {PHILOSOPHIES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                            <p className="text-[10px] text-gray-400 font-medium italic pl-1 italic">This baseline helps our AI tailor your recommended Game Plan.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Step 3: Coach Profile --- */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
                                    <div className="text-center space-y-3">
                                        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-2 transform -rotate-3 hover:rotate-0 transition-transform shadow-sm">
                                            <UserCircle size={40} />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Coach</h2>
                                        <p className="text-gray-500 font-medium">Introduce your professional background.</p>
                                    </div>

                                    <div className="flex flex-col items-center py-2">
                                        <div className="relative group w-32 h-32">
                                            <div className={`w-full h-full rounded-2xl flex items-center justify-center border-4 border-dashed overflow-hidden transition-all duration-500 ${profilePreview ? 'border-purple-500 shadow-xl shadow-purple-50' : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50/30'}`}>
                                                {profilePreview ? (
                                                    <img src={profilePreview} alt="Coach Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center space-y-1">
                                                        <Camera className="w-8 h-8 text-gray-300 group-hover:text-purple-500 mx-auto transition-colors" />
                                                        <span className="text-[8px] font-black text-gray-300 group-hover:text-purple-400 uppercase">Profile Pic</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Experience (Years)</label>
                                                <input
                                                    type="number"
                                                    name="yearsOfExperience"
                                                    value={formData.yearsOfExperience}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">License</label>
                                                <select
                                                    name="coachingLicense"
                                                    value={formData.coachingLicense}
                                                    onChange={handleInputChange}
                                                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 outline-none bg-slate-50/30 font-bold text-gray-700 cursor-pointer"
                                                >
                                                    {LICENSES.map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Specialization</label>
                                            <select
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleInputChange}
                                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 outline-none bg-slate-50/30 font-bold text-gray-700 cursor-pointer"
                                            >
                                                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Short Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about your coaching style..."
                                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 outline-none transition-all bg-slate-50/30 font-bold text-gray-700 resize-none"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Step 4: Success --- */}
                            {step === 4 && (
                                <div className="space-y-10 animate-in zoom-in-95 duration-700 text-center py-6">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-green-500 animate-pulse blur-3xl opacity-20 rounded-full" />
                                        <div className="w-28 h-28 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 relative border-8 border-white shadow-xl">
                                            <CheckCircle2 size={56} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Battle Ready</h2>
                                        <p className="text-gray-500 font-bold text-lg max-w-xs mx-auto">
                                            Everything is set. <span className="text-blue-600">{formData.name}</span> is officially indexed.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-white inline-block text-left w-full shadow-inner relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Zap size={64} />
                                        </div>
                                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Manifest Summary</h4>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                                            <div className="space-y-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Insignia</span>
                                                <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-md overflow-hidden ring-4 ring-blue-50">
                                                    {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-600" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Structure</span>
                                                <p className="font-black text-slate-800 text-xl">{formData.teamFormat}</p>
                                            </div>
                                            <div className="space-y-1 col-span-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Philosophy</span>
                                                <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{formData.philosophy}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Actions */}
                            <div className="flex items-center gap-4 pt-10 mt-auto border-t border-slate-50/50">
                                {step > 1 && step < 4 && (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-white transition-all active:scale-95 group"
                                    >
                                        <ArrowLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={step === 1 && !formData.name}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black uppercase tracking-wider py-5 rounded-2xl shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 group transform active:scale-[0.98]"
                                    >
                                        Next Phase <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : step === 3 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-5 rounded-2xl shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Finalizing Entry...</span>
                                            </div>
                                        ) : (
                                            <>Unlock Dashboard <Zap className="w-5 h-5 fill-current" /></>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-5 rounded-2xl shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                    >
                                        Go to Dashboard <Zap className="w-5 h-5 fill-current" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Built for professionals · <span className="text-blue-500 cursor-pointer hover:underline">Support</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeamSetup;
