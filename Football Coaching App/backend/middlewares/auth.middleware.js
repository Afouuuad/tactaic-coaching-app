import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect routes by verifying the JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from the 'Bearer <token>' header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token payload and attach it to the request object
      // We exclude the password field for security
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to authorize admin-only routes
export const admin = (req, res, next) => {
  // This middleware must run *after* the 'protect' middleware
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};