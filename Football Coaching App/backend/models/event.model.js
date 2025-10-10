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
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Event = mongoose.model('Event', eventSchema);

export default Event;