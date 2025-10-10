import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user (Coach or Player)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
    }

    // Validate role
    if (!['coach', 'player'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'coach' or 'player'." });
    }
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not register user.', error: err.message });
  }
};

// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message for security
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Generic message
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Return the token and user info (excluding password)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not log in.', error: err.message });
  }
};

// @desc    Get the current authenticated user's details
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  // The 'protect' middleware should have already attached the user to the request object
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found or not authenticated.' });
  }
};