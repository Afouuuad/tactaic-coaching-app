import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.route.js';
import teamRoutes from './routes/team.route.js';
import playerRoutes from './routes/player.route.js';
import eventRoutes from './routes/event.route.js';
import activityRoutes from './routes/activity.route.js';
import adminRoutes from './routes/admin.route.js';
import standingsRoutes from './routes/standingsRoutes.js';
import gamePlanRoutes from './routes/gamePlan.route.js';
import analysisRoutes from './routes/analysis.route.js';

const app = express();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Middleware ---
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/CoachingAppDB';
console.log('MongoDB URI:', MONGO_URI);
mongoose.connect(MONGO_URI)
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
app.use('/api/gameplans', gamePlanRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/external', standingsRoutes);

// --- Root URL ---
app.get('/', (req, res) => {
  res.send('TactAIQ API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`TactAIQ server running on port ${PORT}`);
});
