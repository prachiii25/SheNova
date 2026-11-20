import express from 'express';
import {
  getJobs,
  getJobById,
  applyForJob,
  getMyApplications,
  toggleSaveJob,
  getMySavedJobs,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Publicly viewable directory
router.get('/', getJobs);

// Protected specific endpoints (placed before /:id to prevent slug clash)
router.get('/applications', protect, getMyApplications);
router.get('/saved', protect, getMySavedJobs);

// Single job & Protected actions
router.get('/:id', getJobById);
router.post('/:id/apply', protect, applyForJob);
router.post('/:id/save', protect, toggleSaveJob);

export default router;
