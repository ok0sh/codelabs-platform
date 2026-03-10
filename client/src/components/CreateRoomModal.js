import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Code, Video, Music, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useRoomStore } from '../store/roomStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CreateRoomModal.css';

function CreateRoomModal({ onClose }) {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { createRoom } = useRoomStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    roomType: 'public',
    maxParticipants: 10,
    enabledFeatures: {
      codeSharing: true,
      videoMeeting: true,
      screenSharing: true,
      musicPlaylist: true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const room = await createRoom(token, formData);
    
    if (room) {
      toast.success('Room created successfully!');
      onClose();
      navigate(`/room/${room.roomId}`);
    } else {
      toast.error('Failed to create room');
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content glass-card"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>Create a Live Coding Room</h2>
            <p>Set up your collaborative coding environment</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Room Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field"
              placeholder="e.g., Paul's Coding Room"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="input-field textarea"
              placeholder="What will you be working on?"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                className="input-field"
                value={formData.roomType}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxParticipants">Max Participants</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                className="input-field"
                min="2"
                max="50"
                value={formData.maxParticipants}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Enabled Features</label>
            <div className="features-grid">
              <div className="feature-checkbox">
                <input
                  type="checkbox"
                  id="codeSharing"
                  name="enabledFeatures.codeSharing"
                  checked={formData.enabledFeatures.codeSharing}
                  onChange={handleChange}
                />
                <label htmlFor="codeSharing">
                  <Code size={20} />
                  <span>Code Sharing</span>
                </label>
              </div>

              <div className="feature-checkbox">
                <input
                  type="checkbox"
                  id="videoMeeting"
                  name="enabledFeatures.videoMeeting"
                  checked={formData.enabledFeatures.videoMeeting}
                  onChange={handleChange}
                />
                <label htmlFor="videoMeeting">
                  <Video size={20} />
                  <span>Video Meeting</span>
                </label>
              </div>

              <div className="feature-checkbox">
                <input
                  type="checkbox"
                  id="screenSharing"
                  name="enabledFeatures.screenSharing"
                  checked={formData.enabledFeatures.screenSharing}
                  onChange={handleChange}
                />
                <label htmlFor="screenSharing">
                  <Users size={20} />
                  <span>Screen Sharing</span>
                </label>
              </div>

              <div className="feature-checkbox">
                <input
                  type="checkbox"
                  id="musicPlaylist"
                  name="enabledFeatures.musicPlaylist"
                  checked={formData.enabledFeatures.musicPlaylist}
                  onChange={handleChange}
                />
                <label htmlFor="musicPlaylist">
                  <Music size={20} />
                  <span>Music Playlist</span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Room
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default CreateRoomModal;
