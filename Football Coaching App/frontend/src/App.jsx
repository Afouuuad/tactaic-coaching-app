import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Core Pages ---
import Home from './components/Home/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PlayerSignup from './components/auth/PlayerSignup';
// --- Feature Pages (Refactored) ---
import Events from './components/events/Events';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './components/events/CreateEvent';
import Team from './components/Team/Team';
import ActivityLibrary from './components/ActivityLibrary';
import Notifications from './components/Notifications';
import VideoAnalyser from './components/VideoAnalyser';
import GamePlan from './components/GamePlan/GamePlan';
import TeamSetup from './components/Team/TeamSetup';
import MatchTelemetry from './components/telemetry/MatchTelemetry';

import Profile from './components/iconPages/Profile';

import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, clearAuth } from './redux/authSlice';
import { AUTH_API_END_POINT } from './utils/constant';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    // Session Restoration: If we have a token but no user, sync with backend
    const storedToken = localStorage.getItem('token');

    // Sanitize token: Ignore "null", "undefined", etc.
    const isMalformed = storedToken === 'null' || storedToken === 'undefined' || storedToken === '[object Object]';
    const token = (storedToken && !isMalformed) ? storedToken : null;

    if (isMalformed) {
      localStorage.removeItem('token');
    }

    if (token && !user) {
      axios.get(`${AUTH_API_END_POINT}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
        .then(res => {
          const userData = res.data.user || res.data;
          dispatch(setUser({ user: userData, token: token })); // Use sanitized token
        })
        .catch(err => {
          console.error("Session restoration failed:", err);
          // If token is invalid/expired, clear it
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            dispatch(clearAuth()); // Purge the invalid token from Redux state
          }
        });
    }
  }, [dispatch, user]);

  // Global Auth Guard: If we ever find a malformed token in the state, wipe EVERYTHING
  useEffect(() => {
    const isMalformed = token === 'null' || token === 'undefined' || token === '[object Object]';
    if (isMalformed || (user && !token)) {
      console.warn("[GlobalGuard] Inconsistent auth state detected. Purging session.");
      dispatch(clearAuth());
    }
  }, [token, user, dispatch]);

  return (
    <Routes>
      {/* --- Main Routes --- */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/join/:teamId" element={<PlayerSignup />} />
      <Route path="/player-signup" element={<PlayerSignup />} />

      {/* --- Publicly Accessible Feature Routes --- */}
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/team" element={<Team />} />
        <Route path="/team-setup" element={<TeamSetup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/game-plan" element={<GamePlan />} />
        <Route path="/video-analyser" element={<VideoAnalyser />} />
        <Route path="/library" element={<ActivityLibrary />} />
        <Route path="/telemetry" element={<MatchTelemetry />} />
      </Route>

    </Routes>
  );
}

export default App;
