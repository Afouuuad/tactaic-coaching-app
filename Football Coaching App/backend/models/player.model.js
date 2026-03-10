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
  dateOfBirth: {
    type: Date,
  },
  age: {
    type: Number,
  },
  height: { // in cm
    type: Number,
  },
  weight: { // in kg
    type: Number,
  },
  preferredFoot: {
    type: String,
    enum: ['Right', 'Left', 'Both'],
    default: 'Right',
  },
  // Player-specific statistics
  stats: {
    appearances: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
  },
  // Detailed football attributes (0-100)
  attributes: {
    // Athleticism
    Speed: { type: Number, default: 50 },
    Acceleration: { type: Number, default: 50 },
    Agility: { type: Number, default: 50 },
    Jumping: { type: Number, default: 50 },
    Physical: { type: Number, default: 50 },
    Balance: { type: Number, default: 50 },
    Stamina: { type: Number, default: 50 },

    // Attacking
    Finishing: { type: Number, default: 50 },
    LongShots: { type: Number, default: 50 },
    ShotPower: { type: Number, default: 50 },
    Volleys: { type: Number, default: 50 },
    Penalties: { type: Number, default: 50 },
    Heading: { type: Number, default: 50 },
    AttackingPositioning: { type: Number, default: 50 },
    Composure: { type: Number, default: 50 },
    AttackingAwareness: { type: Number, default: 50 },

    // Passing
    Passing: { type: Number, default: 50 },
    Vision: { type: Number, default: 50 },
    Crossing: { type: Number, default: 50 },
    LongPasses: { type: Number, default: 50 },
    ShortPasses: { type: Number, default: 50 },

    // Dribbling
    Dribbling: { type: Number, default: 50 },
    BallControl: { type: Number, default: 50 },
    tightpossession: { type: Number, default: 50 },
    creativity: { type: Number, default: 50 },

    // Defending
    Defendingawareness: { type: Number, default: 50 },
    engagment: { type: Number, default: 50 },
    Aggression: { type: Number, default: 50 },
    Tackling: { type: Number, default: 50 },
    Marking: { type: Number, default: 50 },

    // Goalkeeping
    Positioning: { type: Number, default: 50 },
    Reflexes: { type: Number, default: 50 },
    Diving: { type: Number, default: 50 },
    Handling: { type: Number, default: 50 },
    Kicking: { type: Number, default: 50 },

    // Mental
    OffTheBall: { type: Number, default: 50 },
    Teamwork: { type: Number, default: 50 },
    WorkRate: { type: Number, default: 50 },
    Bravery: { type: Number, default: 50 },
    Determination: { type: Number, default: 50 },
    Leadership: { type: Number, default: 50 },
    Sportsmanship: { type: Number, default: 50 },
    Temperament: { type: Number, default: 50 },
  },
  // Calculated Role Fits
  roleFits: {
    type: Map,
    of: Number, // Stores "Role Name": Score (0-100)
    default: {}
  },
  bestRole: {
    type: String,
    default: null
  },
  emergencyRoles: [{
    type: String
  }],
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

