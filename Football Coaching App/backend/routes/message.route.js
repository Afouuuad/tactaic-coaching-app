import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protect routes so only authenticated users can send or view messages
router.post('/', protect, sendMessage);
router.get('/', protect, getMessages);

export default router;
