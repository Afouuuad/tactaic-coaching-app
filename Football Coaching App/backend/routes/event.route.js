import express from 'express';
import {
  createEvent,
  getEventsByTeam,
  getEventById,
  updateEvent,
  deleteEvent,
  updateAttendance,
  logMatchResult
} from '../controllers/event.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createEvent);
router.get('/team/:teamId', getEventsByTeam);
router.put('/:id/attendance', updateAttendance);
router.put('/:id/log-match', logMatchResult);

router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

export default router;