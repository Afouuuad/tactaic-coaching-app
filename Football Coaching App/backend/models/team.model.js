import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required.'],
    trim: true,
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  }],
  // A team can have multiple game plans, linking to a future 'GamePlan' model
  gamePlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GamePlan', 
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Team = mongoose.model('Team', teamSchema);

export default Team;