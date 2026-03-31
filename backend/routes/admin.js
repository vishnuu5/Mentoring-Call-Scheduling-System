import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getDashboardStats,
  getAdminUsers,
  getAdminMentors,
  updateMentorMetadata,
  getAllCalls,
  getCallDetails
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAdminUsers);
router.get('/mentors', protect, adminOnly, getAdminMentors);
router.patch('/mentors/:mentorId', protect, adminOnly, updateMentorMetadata);
router.get('/calls', protect, adminOnly, getAllCalls);
router.get('/calls/:callId', protect, adminOnly, getCallDetails);

export default router;
