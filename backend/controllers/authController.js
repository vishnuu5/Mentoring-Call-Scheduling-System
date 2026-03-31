import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../models/User.js';
import { getMentorByEmail } from '../models/Mentor.js';
import { getAdminByEmail } from '../models/Admin.js';

const generateToken = (user, role) => {
  return jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    let user = null;
    let foundRole = null;

    if (role === 'user') {
      user = await getUserByEmail(email);
      foundRole = 'user';
    } else if (role === 'mentor') {
      user = await getMentorByEmail(email);
      foundRole = 'mentor';
    } else if (role === 'admin') {
      user = await getAdminByEmail(email);
      foundRole = 'admin';
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user, foundRole);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: foundRole,
        timezone: user.timezone || 'GMT'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const role = req.user.role;
    let user = null;

    if (role === 'user') {
      user = await getUserByEmail(req.user.email);
    } else if (role === 'mentor') {
      user = await getMentorByEmail(req.user.email);
    } else if (role === 'admin') {
      user = await getAdminByEmail(req.user.email);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      timezone: user.timezone || 'GMT'
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
