import express from 'express';
import { getStandings } from '../controllers/standings.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// router.use(protect); 

router.get('/standings/:tournamentId/:seasonId', getStandings);

export default router;