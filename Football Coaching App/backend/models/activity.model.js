import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    trim: true,
  },
  // Optional fields for more detail
  duration: { // e.g., in minutes
    type: Number, 
  },
  category: { // e.g., 'Passing', 'Defense', 'Shooting'
    type: String,
    trim: true,
  },
  // URL to an uploaded tutorial image or video
  mediaUrl: {
    type: String,
    trim: true,
  },
  // Key coaching points or notes
  coachingPoints: {
    type: String,
    trim: true,
  },
  // The coach who created this activity
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;