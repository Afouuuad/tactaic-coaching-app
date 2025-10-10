import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  // Personal details of the player
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
  },
  // Link to the User account for login purposes
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user can only have one player profile
  },
  // The team this player belongs to
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  position: {
    type: String,
    trim: true,
    default: 'Not Assigned',
  },
  number: { // Jersey number
    type: Number,
  },
  // Player-specific statistics
  stats: {
    appearances: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
  },
  // Player's availability for events
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Injured', 'Absent'],
    default: 'Available',
  },
}, {
  timestamps: true,
});

const Player = mongoose.model('Player', playerSchema);

export default Player;

