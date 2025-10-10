import express from 'express';
import {
  createEvent,
  getEventsByTeam,
  getEventById,
  updateEvent,
  deleteEvent,
  updateAttendance
} from '../controllers/event.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createEvent);
router.get('/team/:teamId', getEventsByTeam);
router.put('/:id/attendance', updateAttendance);

router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

export default router;