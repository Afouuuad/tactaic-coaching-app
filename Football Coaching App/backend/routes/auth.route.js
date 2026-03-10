import express from 'express';
import { register, login, getMe, updateProfile, logout } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import multer from 'multer';

// Configure multer for file uploads (Disk Storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const router = express.Router();

// Public routes for user registration and login
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update', protect, upload.single('profilePicture'), updateProfile);

export default router;