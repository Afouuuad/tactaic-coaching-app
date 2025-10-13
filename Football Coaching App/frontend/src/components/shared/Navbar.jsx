import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, ArrowLeft, Menu } from "lucide-react";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
// Corrected import: Using PLAYER_API_END_POINT
import { PLAYER_API_END_POINT } from "@/utils/constant";
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

  const logoutHandler = async () => {
    try {
      // Corrected usage of the imported constant
      const res = await axios.get(`${PLAYER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  // Helper component for sidebar links to reduce repetition
  const SidebarLink = ({ to, children }) => (
    <li>
      <Link to={to} onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors duration-200">
        {children}
      </Link>
    </li>
  );

  return (
    <div className="relative">
      {/* Sidebar Menu (Mobile/Desktop) */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white shadow-lg z-50 p-5 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 self-start"
        >
          <ArrowLeft className="w-6 h-6" />
          Close
        </button>
        <ul className="flex flex-col gap-6 text-lg font-medium">
          <SidebarLink to="/">Dashboard</SidebarLink>
          <SidebarLink to="/events">Events</SidebarLink>
          <SidebarLink to="/team">Team Roster</SidebarLink>
          <SidebarLink to="/activities">Activity Library</SidebarLink>
          {user && <SidebarLink to="/profile">Profile</SidebarLink>}
        </ul>
      </div>

      {/* Navbar (Main Content) */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-2xl font-bold text-white">
            Tact<span className="text-blue-400">AIQ</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/create-event">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
              Plan Event
            </button>
          </Link>

          <NavIcons />

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Signup
                </button>
              </Link>
            </div>
          ) : (
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 text-white hover:text-red-400"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

