import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  role: {
    type: String,
    enum: ['admin', 'coach', 'player'],
    default: 'player',
    required: true,
  },
  // A coach can manage multiple teams
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  teamName: {
    type: String,
    trim: true,
    default: null,
  },
  teamLogo: {
    type: String,
    default: null, // URL of the uploaded team logo
  },
  profilePicture: {
    type: String,
    default: null, // URL of the uploaded profile picture
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  coachingLicense: {
    type: String,
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Middleware to hash the password before saving the user document
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// const CoachingAppDB = mongoose.connection.useDb('CoachingAppDB');
// const User = CoachingAppDB.model('User', userSchema);

const User = mongoose.model('User', userSchema);

export default User;