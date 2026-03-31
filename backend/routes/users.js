import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getAllUsers, getUser, updateUser, searchUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.get('/search', protect, adminOnly, searchUsers);
router.get('/:id', protect, getUser);
router.patch('/:id', protect, updateUser);

export default router;
