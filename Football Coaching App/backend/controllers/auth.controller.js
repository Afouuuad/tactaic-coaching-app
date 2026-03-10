import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user (Coach or Player)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password.',
        style: { backgroundColor: "#007BFF", color: "#FFFFFF" },
      });
    }

    const role = 'coach'; // Automatically set role to 'coach'

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Create the new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password, // tailored for the pre-save hook in the User model
      role,
    });

    await user.save();

    // Auto-login: Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User registered successfully.',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

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
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teams: user.teams,
        teamName: user.teamName,
        teamLogo: user.teamLogo,
        profilePicture: user.profilePicture,
        yearsOfExperience: user.yearsOfExperience,
        coachingLicense: user.coachingLicense,
        specialization: user.specialization,
        bio: user.bio
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not log in.', error: err.message });
  }
};

// @desc    Get the current authenticated user's details
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        teams: req.user.teams,
        teamName: req.user.teamName,
        teamLogo: req.user.teamLogo,
        profilePicture: req.user.profilePicture,
        yearsOfExperience: req.user.yearsOfExperience,
        coachingLicense: req.user.coachingLicense,
        specialization: req.user.specialization,
        bio: req.user.bio
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found or not authenticated.' });
  }
};

// @desc    Update the current authenticated user's profile
// @route   PUT /api/auth/update
export const updateProfile = async (req, res) => {
  try {
    const { name, yearsOfExperience, coachingLicense, specialization, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (yearsOfExperience !== undefined) user.yearsOfExperience = Number(yearsOfExperience);
    if (coachingLicense) user.coachingLicense = coachingLicense;
    if (specialization) user.specialization = specialization;
    if (bio) user.bio = bio;

    // Support for profile picture update
    if (req.file) {
      // Store just the filename, not the path
      user.profilePicture = req.file.filename;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teams: user.teams,
        yearsOfExperience: user.yearsOfExperience,
        coachingLicense: user.coachingLicense,
        specialization: user.specialization,
        bio: user.bio,
        profilePicture: user.profilePicture
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server Error: Could not update profile.', error: err.message });
  }
};

// @desc    Logout user / Clear cookie
// @route   GET /api/auth/logout
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};