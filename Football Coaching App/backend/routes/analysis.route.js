import express from 'express';
import multer from 'multer';
import { uploadVideo } from '../controllers/analysis.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Multer setup for temporary storage
const upload = multer({ dest: 'temp_uploads/' });

router.use(protect);

router.post('/upload', upload.single('video'), uploadVideo);

export default router;
