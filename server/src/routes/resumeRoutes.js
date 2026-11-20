import express from 'express';
import { getResume, createOrUpdateResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getResume);
router.post('/', createOrUpdateResume);

export default router;
