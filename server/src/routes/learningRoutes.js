import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  getAllCourses,
  getCourseById,
  getUserProgress,
  updateCourseProgress,
} from '../controllers/learningController.js';

const router = express.Router();

router.get('/courses', optionalAuth, getAllCourses);
router.get('/courses/:id', optionalAuth, getCourseById);
router.get('/progress', protect, getUserProgress);
router.put('/courses/:id/progress', protect, updateCourseProgress);

export default router;
