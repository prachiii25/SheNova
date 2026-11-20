import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMyInterviewSessions,
  startInterviewSession,
  submitAnswer,
  getInterviewSessionById,
} from '../controllers/interviewController.js';

const router = express.Router();

router.use(protect);

router.get('/sessions', getMyInterviewSessions);
router.post('/start', startInterviewSession);
router.get('/sessions/:id', getInterviewSessionById);
router.post('/sessions/:id/submit-answer', submitAnswer);

export default router;
