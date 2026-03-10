import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required.'],
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['Training', 'Match'],
    required: [true, 'Event type is required.'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required.'],
  },
  location: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  // Track player attendance for this specific event
  attendance: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    status: {
      type: String,
      enum: ['Attending', 'Absent', 'Maybe'],
      default: 'Maybe',
    }
  }],
  // --- New Match Telemetry Fields ---
  opponent: {
    type: String,
    trim: true,
  },
  homeAway: {
    type: String,
    enum: ['Home', 'Away', 'Neutral'],
    default: 'Home'
  },
  goalsFor: {
    type: Number,
    default: 0
  },
  goalsAgainst: {
    type: Number,
    default: 0
  },
  totalAssists: {
    type: Number,
    default: 0
  },
  setPieceGoalsFor: {
    type: Number,
    default: 0
  },
  setPieceGoalsAgainst: {
    type: Number,
    default: 0
  },
  secondHalfGoals: {
    type: Number,
    default: 0
  },
  benchImpactGoals: {
    type: Number,
    default: 0
  },
  firstToScore: {
    type: Boolean,
    default: false
  },
  // We can derive W/D/L and Goal Diff on the frontend or save it here.
  // For now, simpler to calculate dynamically based on goals.
  matchLogged: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Event = mongoose.model('Event', eventSchema);

export default Event;