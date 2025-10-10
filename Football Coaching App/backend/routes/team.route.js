import express from 'express';
import {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam
} from '../controllers/team.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTeam);

router.get('/myteams', getMyTeams);

router.route('/:id')
  .get(getTeamById)
  .put(updateTeam)
  .delete(deleteTeam);

export default router;
