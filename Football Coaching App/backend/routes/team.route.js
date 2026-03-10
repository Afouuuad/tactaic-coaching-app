import express from 'express';
import multer from 'multer';
import {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  setupTeam
} from '../controllers/team.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.use(protect);

router.route('/')
  .post(createTeam);

router.get('/myteams', getMyTeams);

router.route('/:id')
  .get(getTeamById)
  .put(updateTeam)
  .delete(deleteTeam);

// Route to handle team setup
router.post('/setup', upload.fields([
  { name: 'teamLogo', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 },
]), setupTeam);

export default router;
