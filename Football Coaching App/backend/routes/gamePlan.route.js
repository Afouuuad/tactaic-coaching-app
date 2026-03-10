import express from 'express';
import { generateGamePlan, saveGamePlan, getGamePlans } from '../controllers/gamePlan.controller.js';
import { protect, coach } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Generate suggestion (Coach only)
router.post('/generate', coach, generateGamePlan);

// Save Plan (Coach only)
router.post('/', coach, saveGamePlan);

// Get Plans
router.get('/team/:teamId', getGamePlans);

export default router;
