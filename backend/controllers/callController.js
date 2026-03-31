import * as Call from '../models/Call.js';
import * as Availability from '../models/Availability.js';
import * as User from '../models/User.js';
import * as Mentor from '../models/Mentor.js';
import { checkAvailabilityOverlap } from '../utils/timezone.js';

export const createCall = async (req, res) => {
  try {
    const { userId, mentorId, callTypeId, callDate, startTime, endTime, timezone, notes } = req.body;

    if (!userId || !mentorId || !callDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'Required fields: userId, mentorId, callDate, startTime, endTime' });
    }

    // Verify user and mentor exist
    const user = await User.getUserById(userId);
    const mentor = await Mentor.getMentorById(mentorId);

    if (!user || !mentor) {
      return res.status(404).json({ error: 'User or mentor not found' });
    }
    const userAvailability = await Availability.getAvailabilityByUser(userId, callDate, callDate);
    const mentorAvailability = await Availability.getAvailabilityByMentor(mentorId, callDate, callDate);
    
    // Check if the requested time overlaps with existing availability
    const hasUserAvailability = userAvailability.some(slot => 
      checkAvailabilityOverlap(slot, { startTime, endTime, timezone: timezone || 'GMT' })
    );
    
    const hasMentorAvailability = mentorAvailability.some(slot => 
      checkAvailabilityOverlap(slot, { startTime, endTime, timezone: timezone || 'GMT' })
    );

    if (!hasUserAvailability || !hasMentorAvailability) {
      return res.status(400).json({ 
        error: 'Requested time conflicts with availability. Please check user and mentor availability.' 
      });
    }

    const call = await Call.createCall({
      userId,
      mentorId,
      callTypeId: callTypeId || null,
      callDate,
      startTime,
      endTime,
      timezone: timezone || 'GMT',
      googleMeetLink: null,
      notes: notes || ''
    });

    res.status(201).json(call);
  } catch (error) {
    console.error('Create call error:', error);
    res.status(500).json({ error: 'Failed to create call' });
  }
};

export const getCall = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await Call.getCallById(id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    console.error('Get call error:', error);
    res.status(500).json({ error: 'Failed to fetch call' });
  }
};

export const getAllCalls = async (req, res) => {
  try {
    const calls = await Call.getAllCalls();
    res.json(calls);
  } catch (error) {
    console.error('Get all calls error:', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
};

export const getCallsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const calls = await Call.getCallsByUser(userId);
    res.json(calls);
  } catch (error) {
    console.error('Get user calls error:', error);
    res.status(500).json({ error: 'Failed to fetch user calls' });
  }
};

export const getCallsByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const calls = await Call.getCallsByMentor(mentorId);
    res.json(calls);
  } catch (error) {
    console.error('Get mentor calls error:', error);
    res.status(500).json({ error: 'Failed to fetch mentor calls' });
  }
};

export const updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, googleMeetLink, notes } = req.body;

    const call = await Call.updateCall(id, { status, googleMeetLink, notes });
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    console.error('Update call error:', error);
    res.status(500).json({ error: 'Failed to update call' });
  }
};

export const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await Call.deleteCall(id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json({ message: 'Call deleted', call });
  } catch (error) {
    console.error('Delete call error:', error);
    res.status(500).json({ error: 'Failed to delete call' });
  }
};
