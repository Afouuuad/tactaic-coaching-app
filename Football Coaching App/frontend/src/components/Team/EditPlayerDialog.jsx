import React, { useState } from 'react';
import axios from 'axios';
import { AUTH_API_END_POINT, BASE_ASSET_URL } from '@/utils/constant';
import { toast } from 'sonner';
import { X, Save, Shield, Briefcase, GraduationCap, Laptop, AlignLeft, User } from 'lucide-react';

const UpdateProfileDialog = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    yearsOfExperience: user.yearsOfExperience || 1,
    coachingLicense: user.coachingLicense || 'None',
    specialization: user.specialization || 'Tactics',
    bio: user.bio || ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      // Final sanitization of the token string
      const token = (storedToken && storedToken !== 'null' && storedToken !== 'undefined' && storedToken !== '[object Object]') ? storedToken : null;

      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }

      const headers = {};

      // Only add Bearer token if it's actually valid/present
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await axios.put(`${AUTH_API_END_POINT}/update`, submitData, {
        headers,
        withCredentials: true // Crucial for cookie fallback
      });
      if (res.data.success) {
        toast.success("Profile evolved, Coach!");
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Evolution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 italic font-black">
              TIQ
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Focus: Profile Evolution</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Update your professional dossier</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-4 border-b border-gray-50 pb-8">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profile Picture</label>
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-gray-100 shadow-inner bg-slate-50 flex items-center justify-center text-blue-200">
                {profilePicture ? (
                  <img src={URL.createObjectURL(profilePicture)} alt="Preview" className="w-full h-full object-cover" />
                ) : user.profilePicture ? (
                  <img
                    src={`${BASE_ASSET_URL}${user.profilePicture.replace(/^(uploads[/\\])+/, "")}`}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg pointer-events-none">
                <Shield size={16} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase italic">Click to evolve identity</p>
          </div>

          {/* Identity Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                <User size={12} className="text-blue-500" /> Full Professional Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Coach Alex Ferguson"
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-slate-50/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  <Briefcase size={12} className="text-blue-500" /> Years Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-slate-50/30"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                  <GraduationCap size={12} className="text-blue-500" /> License
                </label>
                <select
                  name="coachingLicense"
                  value={formData.coachingLicense}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-slate-50/30 cursor-pointer"
                >
                  <option value="UEFA Pro">UEFA Pro</option>
                  <option value="UEFA A">UEFA A</option>
                  <option value="UEFA B">UEFA B</option>
                  <option value="UEFA C">UEFA C</option>
                  <option value="Grassroots">Grassroots</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                <Shield size={12} className="text-blue-500" /> Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-slate-50/30 cursor-pointer"
              >
                <option value="Tactics">Tactics</option>
                <option value="Player Development">Player Development</option>
                <option value="Goalkeeping">Goalkeeping</option>
                <option value="Fitness & Conditioning">Fitness & Conditioning</option>
                <option value="Mental Performance">Mental Performance</option>
                <option value="Scouting">Scouting</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                <AlignLeft size={12} className="text-blue-500" /> Professional Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your coaching philosophy..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-slate-50/30 resize-none"
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-gray-100 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-gray-400 hover:bg-white hover:text-gray-600 transition-all border-2 border-transparent hover:border-gray-100"
          >
            Abort
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>Apply Changes <Save size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileDialog;
