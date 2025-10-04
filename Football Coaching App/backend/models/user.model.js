import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  location: {
    country: { type: String },
    city: { type: String }
  },
  password: { type: String, required: true },
  // Role options: customer (posts jobs), user (applies), admin
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  portfolio: { type: String },
  skills: [String],
  isSuspended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
