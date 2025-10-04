import express from 'express';
import { registerUser, login, logout } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/user.controller.js';
const router = express.Router();


router.post('/register', registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
