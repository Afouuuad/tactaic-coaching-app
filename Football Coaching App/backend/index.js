import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.route.js';
import teamRoutes from './routes/team.route.js';
import playerRoutes from './routes/player.route.js';
import eventRoutes from './routes/event.route.js';
import activityRoutes from './routes/activity.route.js';
import adminRoutes from './routes/admin.route.js';
import standingsRoutes from './routes/standingsRoutes.js';

const app = express();

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json()); 

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB successfully connected for TactAIQ.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// All routes are now organized under their respective paths
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/external', standingsRoutes);

// --- Root URL ---
app.get('/', (req, res) => {
  res.send('TactAIQ API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`TactAIQ server running on port ${PORT}`);
});
