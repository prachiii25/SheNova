import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  handleGenerateRoadmap,
  handleAnalyzeSkillGap,
  handleImproveResume,
  handleExplainCareerGap,
  handleGenerateInterviewQuestions,
  handleEvaluateAnswer,
  handleRecommendCourses,
} from '../controllers/aiController.js';

const router = express.Router();

// All AI endpoints are protected
router.use(protect);

router.post('/roadmap', handleGenerateRoadmap);
router.post('/skill-gap', handleAnalyzeSkillGap);
router.post('/improve-resume', handleImproveResume);
router.post('/explain-gap', handleExplainCareerGap);
router.post('/interview-questions', handleGenerateInterviewQuestions);
router.post('/evaluate-answer', handleEvaluateAnswer);
router.post('/recommend-courses', handleRecommendCourses);

export default router;
