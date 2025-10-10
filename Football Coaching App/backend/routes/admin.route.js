import express from 'express';
import { getAllUsers, updateUser, deleteUser, generateReports } from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/reports', generateReports);

export default router;
