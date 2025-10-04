import express from 'express';
import { applyJob, getApplicationsForJob } from '../controllers/application.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/', protect, applyJob);
router.get('/:jobId', protect, getApplicationsForJob);

export default router;
