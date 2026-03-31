import * as Mentor from '../models/Mentor.js';

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.getAllMentors();
    res.json(mentors);
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
};

export const getMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.getMentorById(id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor' });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, tags, timezone } = req.body;

    const mentor = await Mentor.updateMentor(id, { description, tags, timezone });
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ error: 'Failed to update mentor' });
  }
};

export const searchMentors = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const mentors = await Mentor.getAllMentors();
    const filtered = mentors.filter(mentor =>
      mentor.name.toLowerCase().includes(q.toLowerCase()) ||
      mentor.email.toLowerCase().includes(q.toLowerCase()) ||
      (mentor.tags || []).some(tag => tag.toLowerCase().includes(q.toLowerCase()))
    );

    res.json(filtered);
  } catch (error) {
    console.error('Search mentors error:', error);
    res.status(500).json({ error: 'Failed to search mentors' });
  }
};
