import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { getMe } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.get("/me", authenticateUser, getCurrentUser);

export default router;

