import express from 'express';
import { protect, userOnly, mentorOnly, adminOnly } from '../middleware/auth.js';
import {
  addUserAvailability,
  addMentorAvailability,
  getUserAvailability,
  getMentorAvailability,
  deleteAvailability,
  updateAvailability
} from '../controllers/availabilityController.js';

const router = express.Router();
router.post('/user', protect, userOnly, addUserAvailability);
router.get('/user/:userId', protect, getUserAvailability);
router.post('/mentor', protect, mentorOnly, addMentorAvailability);
router.get('/mentor/:mentorId', protect, getMentorAvailability);
router.delete('/:id', protect, deleteAvailability);
router.patch('/:id', protect, updateAvailability);

export default router;
