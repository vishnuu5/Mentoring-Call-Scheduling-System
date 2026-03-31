import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  createCall,
  getCall,
  getAllCalls,
  getCallsByUser,
  getCallsByMentor,
  updateCall,
  deleteCall
} from '../controllers/callController.js';

const router = express.Router();

router.post('/', protect, adminOnly, createCall);
router.get('/', protect, adminOnly, getAllCalls);
router.get('/:id', protect, getCall);
router.patch('/:id', protect, adminOnly, updateCall);
router.delete('/:id', protect, adminOnly, deleteCall);
router.get('/user/:userId', protect, getCallsByUser);
router.get('/mentor/:mentorId', protect, getCallsByMentor);

export default router;
