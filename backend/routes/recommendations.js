import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getRecommendations, getMentorCompatibility } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getRecommendations);
router.get('/compatibility', protect, adminOnly, getMentorCompatibility);

export default router;
