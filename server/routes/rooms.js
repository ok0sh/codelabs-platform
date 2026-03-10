const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const authMiddleware = require('../middleware/auth');

// Create room
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name, description, roomType, maxParticipants, enabledFeatures } = req.body;

    const room = new Room({
      roomId: uuidv4(),
      name,
      description,
      owner: req.userId,
      roomType,
      maxParticipants,
      enabledFeatures,
      participants: [{
        userId: req.userId,
        role: 'host'
      }]
    });

    await room.save();
    await room.populate('owner', 'username email avatar');

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Error creating room' });
  }
});

// Get all active rooms
router.get('/active', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('owner', 'username email avatar')
      .populate('participants.userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Get room by ID
router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('owner', 'username email avatar')
      .populate('participants.userId', 'username avatar');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Error fetching room' });
  }
});

// Join room
router.post('/:roomId/join', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user already in room
    const alreadyJoined = room.participants.some(
      p => p.userId.toString() === req.userId
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already in room' });
    }

    // Check room capacity
    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: 'Room is full' });
    }

    room.participants.push({
      userId: req.userId,
      role: 'participant'
    });

    await room.save();
    await room.populate('participants.userId', 'username avatar');

    res.json({ message: 'Joined room successfully', room });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Error joining room' });
  }
});

// Leave room
router.post('/:roomId/leave', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.participants = room.participants.filter(
      p => p.userId.toString() !== req.userId
    );

    // If host leaves and room has participants, assign new host
    if (room.owner.toString() === req.userId && room.participants.length > 0) {
      room.participants[0].role = 'host';
      room.owner = room.participants[0].userId;
    }

    // If no participants left, deactivate room
    if (room.participants.length === 0) {
      room.isActive = false;
    }

    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Error leaving room' });
  }
});

// Update playlist
router.put('/:roomId/playlist', authMiddleware, async (req, res) => {
  try {
    const { playlist } = req.body;
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.playlist = playlist;
    await room.save();

    res.json({ message: 'Playlist updated', playlist: room.playlist });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: 'Error updating playlist' });
  }
});

module.exports = router;
