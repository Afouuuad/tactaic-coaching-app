import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, ArrowLeft, Menu, Settings, ChevronDown, UserCircle } from "lucide-react";
import { setUser, clearAuth } from "@/redux/authSlice";
import axios from "axios";
// Corrected import: Using PLAYER_API_END_POINT
import { PLAYER_API_END_POINT, AUTH_API_END_POINT, BASE_ASSET_URL } from "@/utils/constant";
import { toast } from "sonner";
import NavIcons from "./NavIcons";

/**
 * The main navigation bar and sidebar for the application.
 */
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const profilePicPath = user?.profilePicture ? user.profilePicture.replace(/^(uploads[/\\])+/, "") : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${AUTH_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(clearAuth());
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  // Helper component for sidebar links
  const SidebarLink = ({ to, children }) => (
    <li>
      <Link to={to} onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors duration-200">
        {children}
      </Link>
    </li>
  );

  return (
    <div className="relative">
      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-gray-900 text-white shadow-2xl z-50 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="mb-10 flex items-center gap-2 text-white/60 hover:text-white transition-all self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Close</span>
        </button>
        <ul className="flex flex-col gap-6 text-lg font-semibold">
          <SidebarLink to="/">Dashboard</SidebarLink>
          <SidebarLink to="/events">Events</SidebarLink>
          <SidebarLink to="/team">Team Roster</SidebarLink>
          <SidebarLink to="/activities">Activity Library</SidebarLink>
          {user && <SidebarLink to="/profile">Profile</SidebarLink>}
          <li>
            <Link to="/video-analyser" className="hover:text-blue-400">Video Analyser</Link>
          </li>
        </ul>
      </div>

      {/* Navbar */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-white/5 shadow-lg relative z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="text-2xl font-black text-white flex items-center gap-2 tracking-tighter italic uppercase">
            Tact<span className="text-blue-500">AIQ</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <Link to="/create-event">
              <button
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 font-black text-sm uppercase tracking-wider hidden md:block hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-500/20"
              >
                Plan Event
              </button>
            </Link>
          )}

          <NavIcons />

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="text-white/80 px-5 py-2 rounded-xl hover:text-white hover:bg-white/5 font-bold transition-all">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className="bg-white text-black px-6 py-2 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all shadow-md"
                >
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative profile-dropdown">
              <div
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-2xl border border-white/10 transition-all cursor-pointer group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl border-2 border-white/10 group-hover:border-blue-500/50 transition-all overflow-hidden bg-gray-800 flex-shrink-0">
                  {user?.profilePicture && !imgError ? (
                    <img
                      src={`${BASE_ASSET_URL}${profilePicPath}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500/20 bg-blue-500/10">
                      <UserCircle size={28} className="text-blue-500/40" />
                    </div>
                  )}
                </div>

                {/* Name & Role (Desktop) */}
                <div className="hidden md:flex flex-col items-start pr-2">
                  <span className="text-sm font-bold text-white/95 leading-none tracking-tight">
                    {user?.name || 'Manager'}
                  </span>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                    {user?.role === 'coach' ? 'COACH' : (user?.role || 'TACTICIAN')}
                  </span>
                </div>

                <ChevronDown size={14} className={`text-white/40 mr-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-2 flex flex-col items-start border-b border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Authenticated as</p>
                    <p className="text-[15px] font-bold text-white truncate w-full">{user?.name || 'Alvaro Arbeloa'}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-200 bg-transparent hover:bg-slate-800 border-l-2 border-transparent hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <UserCircle size={18} className="text-slate-400" /> Edit Profile
                  </Link>

                  <Link
                    to="/team-setup"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-200 bg-transparent hover:bg-slate-800 border-l-2 border-transparent hover:border-cyan-400 transition-colors cursor-pointer"
                  >
                    <Settings size={18} className="text-slate-400" /> Settings
                  </Link>

                  <div className="h-px bg-slate-800 my-1" />

                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 bg-transparent hover:bg-rose-500/10 hover:text-rose-300 border-l-2 border-transparent transition-colors cursor-pointer"
                  >
                    <LogOut size={18} className="text-rose-400" /> Logout
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

