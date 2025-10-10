import express from 'express';
import {
  createActivity,
  getMyActivities,
  getActivityById,
  updateActivity,
  deleteActivity
} from '../controllers/activity.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { singleUpload } from '../middlewares/mutler.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyActivities)
  .post(singleUpload, createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(singleUpload, updateActivity)
  .delete(deleteActivity);

export default router;
