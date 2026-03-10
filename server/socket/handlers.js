const Room = require('../models/Room');

const setupSocketHandlers = (io) => {
  const rooms = new Map(); // Store active socket connections per room

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('join-room', async ({ roomId, userId, username, avatar }) => {
      try {
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Map());
        }
        
        const roomUsers = rooms.get(roomId);
        roomUsers.set(socket.id, { userId, username, avatar, socketId: socket.id });

        // Broadcast to others in room
        socket.to(roomId).emit('user-joined', {
          userId,
          username,
          avatar,
          socketId: socket.id,
          participants: Array.from(roomUsers.values())
        });

        // Send current participants to newly joined user
        socket.emit('room-users', {
          participants: Array.from(roomUsers.values())
        });

        console.log(`${username} joined room ${roomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle code changes
    socket.on('code-change', ({ roomId, code, language }) => {
      socket.to(roomId).emit('code-update', { code, language });
    });

    // Handle terminal commands
    socket.on('terminal-command', ({ roomId, command }) => {
      socket.to(roomId).emit('terminal-output', { 
        command,
        timestamp: new Date().toISOString()
      });
    });

    // Handle chat messages
    socket.on('chat-message', ({ roomId, message, username, avatar }) => {
      const timestamp = new Date().toISOString();
      io.to(roomId).emit('chat-message', {
        message,
        username,
        avatar,
        timestamp
      });
    });

    // Handle music control
    socket.on('music-control', ({ roomId, action, track }) => {
      socket.to(roomId).emit('music-update', { action, track });
    });

    // Handle playlist update
    socket.on('playlist-update', ({ roomId, playlist }) => {
      io.to(roomId).emit('playlist-changed', { playlist });
    });

    // Handle video/audio toggle
    socket.on('toggle-media', ({ roomId, userId, type, enabled }) => {
      socket.to(roomId).emit('user-media-changed', { userId, type, enabled });
    });

    // WebRTC signaling
    socket.on('webrtc-offer', ({ roomId, targetSocketId, offer }) => {
      io.to(targetSocketId).emit('webrtc-offer', {
        offer,
        fromSocketId: socket.id
      });
    });

    socket.on('webrtc-answer', ({ roomId, targetSocketId, answer }) => {
      io.to(targetSocketId).emit('webrtc-answer', {
        answer,
        fromSocketId: socket.id
      });
    });

    socket.on('webrtc-ice-candidate', ({ roomId, targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('webrtc-ice-candidate', {
        candidate,
        fromSocketId: socket.id
      });
    });

    // Handle cursor position sharing
    socket.on('cursor-move', ({ roomId, position, username }) => {
      socket.to(roomId).emit('cursor-update', {
        socketId: socket.id,
        position,
        username
      });
    });

    // Handle disconnection
    socket.on('leave-room', ({ roomId }) => {
      handleUserLeave(socket, roomId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Find and leave all rooms this socket was in
      rooms.forEach((roomUsers, roomId) => {
        if (roomUsers.has(socket.id)) {
          handleUserLeave(socket, roomId);
        }
      });
    });

    function handleUserLeave(socket, roomId) {
      const roomUsers = rooms.get(roomId);
      if (roomUsers) {
        const user = roomUsers.get(socket.id);
        roomUsers.delete(socket.id);

        if (user) {
          socket.to(roomId).emit('user-left', {
            userId: user.userId,
            username: user.username,
            socketId: socket.id,
            participants: Array.from(roomUsers.values())
          });
        }

        // Clean up empty rooms
        if (roomUsers.size === 0) {
          rooms.delete(roomId);
        }
      }
      
      socket.leave(roomId);
    }
  });
};

module.exports = setupSocketHandlers;
