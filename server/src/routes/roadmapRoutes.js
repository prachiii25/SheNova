import express from 'express';
import {
  getRoadmap,
  createOrUpdateRoadmap,
  updateRoadmapTask,
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all roadmap routes

router.get('/', getRoadmap);
router.post('/', createOrUpdateRoadmap);
router.put('/task', updateRoadmapTask);

export default router;
