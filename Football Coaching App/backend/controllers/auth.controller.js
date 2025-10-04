import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const register = async (req, res) => {
  try {
    const { firstName, surname, email, phoneNumber, location, password, role } = req.body;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      surname,
      email: normalizedEmail,
      phoneNumber,
      location,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.error("Login failed: Missing email or password");
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Normalized email:", normalizedEmail); // Debugging log

    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    console.log("User found:", user); // Debugging log
    if (!user) {
      console.error("Login failed: User not found");
      return res.status(404).json({ message: 'Incorrect email or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch); // Debugging log
    if (!isMatch) {
      console.error("Login failed: Invalid password");
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ access_token: token, user });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the authenticated user's details
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
};