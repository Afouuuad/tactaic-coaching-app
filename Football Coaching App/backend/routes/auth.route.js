import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes for user registration and login
router.post('/register', register);
router.post('/login', login);

// Protected route to get the current authenticated user's details.
// It uses the 'protect' middleware to ensure the user is logged in.
router.get('/me', protect, getMe);

export default router;