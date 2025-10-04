import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
import adminRoutes from './routes/admin.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // if you plan to send cookies or use authorization headers
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/v1/user', userRoutes);

// Force use PORT from .env or fallback to 5001
const PORT = process.env.PORT || 5001;
console.log("PORT from .env:", process.env.PORT, "Using PORT:", PORT);

// Force binding to IPv4 address (0.0.0.0 binds to all IPv4 interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
