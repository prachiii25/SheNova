import express from 'express';
import {
  getSkillAnalyses,
  createSkillAnalysis,
} from '../controllers/skillAnalysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getSkillAnalyses);
router.post('/', createSkillAnalysis);
router.post('/analyze', createSkillAnalysis);

export default router;
