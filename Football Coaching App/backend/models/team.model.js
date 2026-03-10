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
  ageGroup: {
    type: String,
    trim: true,
  },
  division: {
    type: String,
    trim: true,
  },
  philosophy: {
    type: String,
    trim: true,
  },
  homeGround: {
    type: String,
    trim: true,
  },
  teamFormat: {
    type: String,
    enum: ['5v5', '7v7', '9v9', '11v11'],
    default: '11v11',
  },
  teamLogo: {
    type: String,
    default: null,
  },
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