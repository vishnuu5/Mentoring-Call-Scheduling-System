import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getAllMentors, getMentor, updateMentor, searchMentors } from '../controllers/mentorController.js';

const router = express.Router();

router.get('/', protect, getAllMentors);
router.get('/search', protect, adminOnly, searchMentors);
router.get('/:id', protect, getMentor);
router.patch('/:id', protect, adminOnly, updateMentor);

export default router;
