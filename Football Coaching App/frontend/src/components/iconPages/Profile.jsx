import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateProfileDialog from '../Team/EditPlayerDialog';
import { AUTH_API_END_POINT, BASE_ASSET_URL } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUser as setReduxUser } from '@/redux/authSlice';
import {
  User,
  Shield,
  Briefcase,
  GraduationCap,
  Zap,
  Mail,
  Settings,
  Dna,
  History,
  Target
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector(state => state.auth);
  const [user, setUser] = useState(reduxUser);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  // Sync local state if redux updates (e.g., from App.jsx session restore)
  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  const profilePicPath = user?.profilePicture?.replace(/^uploads\//, "").replace(/^\/uploads\//, "");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const token = (storedToken && storedToken !== 'null' && storedToken !== 'undefined') ? storedToken : null;

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    axios.get(`${AUTH_API_END_POINT}/me`, {
      headers,
      withCredentials: true
    })
      .then((res) => {
        const userData = res.data.user || res.data;
        setUser(userData);
        // Sync to Redux for global consistency (especially for Navbar)
        dispatch(setReduxUser({ user: userData, token }));
      })
      .catch((err) => {
        console.error(err);
        if (!user) {
          setError("Unable to sync dossier. Please re-authenticate.");
        }
      });
  }, [dispatch]);

  if (error) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <Shield size={40} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Sync Interrupted</h2>
      <p className="text-gray-500 font-bold max-w-md">{error}</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Decrypting Dossier...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden font-sans">
      {/* Dynamic Background Assets */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 pt-12 relative z-10">

        {/* Header / Identity Bar */}
        <section className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Dna size={300} className="rotate-12" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            {/* Avatar Shield */}
            <div className="relative">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-blue-500/10 ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-500">
                {user.profilePicture && !imgError ? (
                  <img
                    src={`${BASE_ASSET_URL}${profilePicPath}`}
                    alt="Coach"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-blue-200">
                    <User size={80} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-500/40 animate-bounce">
                <Zap size={20} className="fill-current" />
              </div>
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">{user.name}</h2>
                  <span className="bg-gray-900 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg italic">
                    Master Coach
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-lg">
                  <span className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> {user.email}</span>
                </div>
              </div>

              <button
                onClick={() => setShowDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3.5 px-8 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 text-xs"
              >
                Modify Profile <Settings size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Intelligence Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Col: Professional Dossier */}
          <div className="lg:col-span-2 space-y-8">
            {/* DNA Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <History size={24} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Service History</h4>
                <p className="text-2xl font-black text-gray-900 italic">{user.yearsOfExperience || 0} Years</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <GraduationCap size={24} className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Accreditation</h4>
                <p className="text-2xl font-black text-gray-900 italic">{user.coachingLicense || 'Pending'}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <Target size={24} className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Core Focus</h4>
                <p className="text-xl font-black text-gray-900 italic uppercase truncate">{user.specialization || 'Tactics'}</p>
              </div>
            </div>

            {/* Personal Statement / Bio */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-8 opacity-5">
                <Shield size={120} />
              </div>
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] mb-8 border-b border-gray-50 pb-4">Professional Manifesto</h3>
              <p className="text-xl text-gray-600 font-medium leading-relaxed italic relative z-10">
                "{user.bio || "No tactical manifesto established. Define your philosophy to guide the squad toward victory."}"
              </p>
            </section>
          </div>

          {/* Right Col: Performance / Stats (Placeholders for future integration) */}
          <div className="space-y-8">
            <section className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 text-blue-500">
                <Zap size={80} className="fill-current" />
              </div>
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">Tactical Identity</h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/60">Philosophy Alignment</span>
                  <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/60">System Knowledge</span>
                  <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Master</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[92%] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                </div>
              </div>

              <div className="mt-12 bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Next Milestone</p>
                <p className="text-sm font-bold text-white/80">Index 50 sessions for Ultra-Elite Tactical badge.</p>
              </div>
            </section>

            <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/20 group hover:scale-[1.02] transition-transform duration-300">
              <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Squad Status</h4>
              <p className="text-3xl font-black italic mb-6">Battle Ready</p>
              <div className="w-12 h-1 bg-white/20 rounded-full mb-6" />
              <p className="text-sm font-bold text-white/80 leading-relaxed italic">
                The elite intelligence engine is analyzing your coaching style to optimize starting XI recommendations.
              </p>
            </div>
          </div>
        </div>
      </main>

      {showDialog && (
        <UpdateProfileDialog user={user} onClose={() => {
          setShowDialog(false);
          // Refresh logic handled in dialog normally via reload, 
          // but we could improve this with a local refresh if needed.
        }} />
      )}
    </div>
  );
};

export default Profile;
