import express from 'express';
import {
  createPlayer,
  getPlayersForTeam,
  getPlayerById,
  updatePlayer,
  deletePlayer
} from '../controllers/Player.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes in this file are protected and require a user to be logged in.
router.use(protect);

// POST /api/players - Create a new player for a team
router.post('/', createPlayer);

// GET /api/players/team/:teamId - Get all players for a specific team
router.get('/team/:teamId', getPlayersForTeam);

// Routes for a specific player by their ID
router.route('/:id')
  .get(getPlayerById)      // GET /api/players/:id
  .put(updatePlayer)       // PUT /api/players/:id
  .delete(deletePlayer);   // DELETE /api/players/:id

export default router;