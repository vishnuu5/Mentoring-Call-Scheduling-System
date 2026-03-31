import * as Availability from '../models/Availability.js';
import * as User from '../models/User.js';
import * as Mentor from '../models/Mentor.js';
import { getWeekDates } from '../utils/timezone.js';

export const addUserAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, timezone } = req.body;
    const userId = req.user.id;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Date, start time, and end time are required' });
    }

    const availability = await Availability.addAvailability({
      userId,
      mentorId: null,
      date,
      startTime,
      endTime,
      timezone: timezone || 'GMT',
      type: 'user'
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ error: 'Failed to add availability' });
  }
};

export const addMentorAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, timezone } = req.body;
    const mentorId = req.user.id;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Date, start time, and end time are required' });
    }

    const availability = await Availability.addAvailability({
      userId: null,
      mentorId,
      date,
      startTime,
      endTime,
      timezone: timezone || 'GMT',
      type: 'mentor'
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ error: 'Failed to add availability' });
  }
};

export const getUserAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ error: 'userId, startDate, and endDate are required' });
    }

    const availability = await Availability.getAvailabilityByUser(userId, startDate, endDate);
    res.json(availability);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const getMentorAvailability = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { startDate, endDate } = req.query;

    if (!mentorId || !startDate || !endDate) {
      return res.status(400).json({ error: 'mentorId, startDate, and endDate are required' });
    }

    const availability = await Availability.getAvailabilityByMentor(mentorId, startDate, endDate);
    res.json(availability);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Availability.deleteAvailability(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    res.json({ message: 'Availability deleted', availability: deleted });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ error: 'Failed to delete availability' });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    const updated = await Availability.updateAvailability(id, { startTime, endTime });
    if (!updated) {
      return res.status(404).json({ error: 'Availability not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};
