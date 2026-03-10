const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  enabledFeatures: {
    codeSharing: { type: Boolean, default: true },
    videoMeeting: { type: Boolean, default: true },
    screenSharing: { type: Boolean, default: true },
    musicPlaylist: { type: Boolean, default: true }
  },
  playlist: [{
    id: String,
    title: String,
    artist: String,
    duration: Number,
    url: String
  }],
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['host', 'participant'],
      default: 'participant'
    }
  }],
  codeState: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Room', roomSchema);
