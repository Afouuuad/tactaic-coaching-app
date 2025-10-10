import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Core Pages ---
import Home from './components/Home/Home'; 
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// --- Feature Pages (Refactored) ---
import Events from './components/events/Events'; 
import EventDetails from './components/events/EventDetails'; 
import CreateEvent from './components/events/CreateEvent'; 
import Team from './components/team/Team'; 
import ActivityLibrary from './components/ActivityLibrary'; 
import Notifications from './components/Notifications'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Main Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>
          {/* --- Event-Related Routes --- */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          
          {/* --- Team & Plan Routes --- */}
          <Route path="/team" element={<Team />} />
          <Route path="/activities" element={<ActivityLibrary />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
