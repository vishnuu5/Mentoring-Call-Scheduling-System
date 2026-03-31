import * as User from '../models/User.js';
import * as Mentor from '../models/Mentor.js';
import * as Call from '../models/Call.js';
import * as Availability from '../models/Availability.js';

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    const mentors = await Mentor.getAllMentors();
    const calls = await Call.getAllCalls();

    res.json({
      totalUsers: users.length,
      totalMentors: mentors.length,
      totalCalls: calls.length,
      upcomingCalls: calls.filter(c => c.status === 'scheduled').length,
      completedCalls: calls.filter(c => c.status === 'completed').length
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAdminMentors = async (req, res) => {
  try {
    const mentors = await Mentor.getAllMentors();
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
};

export const updateMentorMetadata = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { description, tags } = req.body;

    const mentor = await Mentor.updateMentor(mentorId, { description, tags });
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
};

export const getAllCalls = async (req, res) => {
  try {
    const calls = await Call.getAllCalls();
    res.json(calls);
  } catch (error) {
    console.error('Get calls error:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
};

export const getCallDetails = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.getCallById(callId);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    console.error('Get call error:', error);
    res.status(500).json({ error: 'Failed to fetch call' });
  }
};
