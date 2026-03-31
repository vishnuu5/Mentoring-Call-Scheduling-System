import * as Mentor from '../models/Mentor.js';
import * as User from '../models/User.js';
import { getTopRecommendations } from '../utils/semantic-search.js';

export const getRecommendations = async (req, res) => {
  try {
    const { userId, callType } = req.query;

    if (!userId || !callType) {
      return res.status(400).json({ error: 'userId and callType are required' });
    }
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const mentors = await Mentor.getAllMentors();
    const recommendations = getTopRecommendations(mentors, user, callType, 5);

    res.json({
      userId,
      callType,
      user: {
        id: user.id,
        name: user.name,
        description: user.description,
        tags: user.tags
      },
      recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

export const getMentorCompatibility = async (req, res) => {
  try {
    const { userId, mentorId, callType } = req.query;

    if (!userId || !mentorId || !callType) {
      return res.status(400).json({ error: 'userId, mentorId, and callType are required' });
    }

    const user = await User.getUserById(userId);
    const mentor = await Mentor.getMentorById(mentorId);

    if (!user || !mentor) {
      return res.status(404).json({ error: 'User or mentor not found' });
    }

    const userTags = user.tags || [];
    const mentorTags = mentor.tags || [];
    const commonTags = userTags.filter(tag => mentorTags.includes(tag));

    let compatibilityScore = 0;
    const maxScore = 100;
    compatibilityScore += commonTags.length * 20;
    const userDesc = (user.description || '').toLowerCase();
    const mentorDesc = (mentor.description || '').toLowerCase();

    if (userDesc && mentorDesc) {
      const userWords = userDesc.split(' ');
      const mentorWords = mentorDesc.split(' ');
      const commonWords = userWords.filter(word => mentorWords.includes(word));
      compatibilityScore += commonWords.length * 10;
    }

    compatibilityScore = Math.min(compatibilityScore, maxScore);

    res.json({
      userId,
      mentorId,
      callType,
      compatibilityScore,
      commonTags,
      recommendation: compatibilityScore > 60 ? 'Highly Recommended' : compatibilityScore > 40 ? 'Recommended' : 'Consider'
    });
  } catch (error) {
    console.error('Get compatibility error:', error);
    res.status(500).json({ error: 'Failed to calculate compatibility' });
  }
};
