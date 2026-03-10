import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect routes by verifying the JWT token
export const protect = async (req, res, next) => {
  let token;

  // DIAGNOSTIC LOGS
  console.log(`[AUTH-DEBUG] Path: ${req.path}`);
  console.log(`[AUTH-DEBUG] Auth Header Present: ${!!req.headers.authorization}`);
  console.log(`[AUTH-DEBUG] Cookies Present: ${Object.keys(req.cookies || {}).join(', ')}`);

  // 1. Check Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const headerToken = req.headers.authorization.split(' ')[1];
    console.log(`[AUTH-DEBUG] Raw Header Token: "${headerToken}"`);

    // Ignore malformed strings from frontend
    if (headerToken && headerToken !== 'null' && headerToken !== 'undefined' && headerToken !== '[object Object]') {
      token = headerToken;
      console.log(`[AUTH-DEBUG] Header Token Accepted`);
    } else {
      console.log(`[AUTH-DEBUG] Header Token Rejected (Malformed)`);
    }
  }

  // 2. Fallback to Cookie if no valid Header token found
  if (!token && req.cookies && req.cookies.token) {
    const cookieToken = req.cookies.token;
    if (cookieToken && cookieToken !== 'null' && cookieToken !== 'undefined') {
      token = cookieToken;
    }
  }

  // 3. Final verification if we have any token
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    console.log(`[AUTH] Verifying token from ${req.headers.authorization ? 'Header' : 'Cookie'}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[AUTH] Token valid for user ID: ${decoded.id}`);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.warn(`[AUTH] User not found for ID: ${decoded.id}`);
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    console.error(`[AUTH] Verification failed: ${error.message}`);
    // Log a substring of the token for debugging without exposing the whole thing
    console.error(`[AUTH] Failing Token Prefix: ${token ? token.substring(0, 10) + '...' : 'null'}`);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
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
}


// Middleware to authorize coach routes
export const coach = (req, res, next) => {
  if (req.user && (req.user.role === 'coach' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Coach access required' });
  }
};