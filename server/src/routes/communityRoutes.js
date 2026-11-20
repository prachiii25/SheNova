import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  getMentors,
  getMentorById,
  requestMentorship,
  getMyMentorshipRequests,
  getSuccessStories,
  getForumPosts,
  getForumPostById,
  createForumPost,
  replyToForumPost,
  cheerForumPost,
} from '../controllers/communityController.js';

const router = express.Router();

// Mentors
router.get('/mentors', optionalAuth, getMentors);
router.get('/mentors/:id', optionalAuth, getMentorById);

// Mentorship Requests (Protected)
router.post('/mentorship', protect, requestMentorship);
router.get('/mentorship/my-requests', protect, getMyMentorshipRequests);

// Success Stories
router.get('/stories', getSuccessStories);

// Forums
router.get('/forums', optionalAuth, getForumPosts);
router.get('/forums/:id', optionalAuth, getForumPostById);
router.post('/forums', protect, createForumPost);
router.post('/forums/:id/reply', protect, replyToForumPost);
router.post('/forums/:id/cheer', protect, cheerForumPost);

export default router;
