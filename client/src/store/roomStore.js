import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useRoomStore = create((set, get) => ({
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,

  fetchRooms: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/rooms/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ 
        rooms: response.data.rooms, 
        loading: false 
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch rooms' 
      });
    }
  },

  createRoom: async (token, roomData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/rooms/create`, roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set((state) => ({ 
        rooms: [response.data.room, ...state.rooms],
        loading: false 
      }));

      return response.data.room;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to create room' 
      });
      return null;
    }
  },

  fetchRoom: async (token, roomId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({ 
        currentRoom: response.data.room, 
        loading: false 
      });

      return response.data.room;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch room' 
      });
      return null;
    }
  },

  joinRoom: async (token, roomId) => {
    try {
      const response = await axios.post(
        `${API_URL}/rooms/${roomId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ currentRoom: response.data.room });
      return response.data.room;
    } catch (error) {
      console.error('Join room error:', error);
      return null;
    }
  },

  leaveRoom: async (token, roomId) => {
    try {
      await axios.post(
        `${API_URL}/rooms/${roomId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ currentRoom: null });
    } catch (error) {
      console.error('Leave room error:', error);
    }
  },

  updatePlaylist: async (token, roomId, playlist) => {
    try {
      await axios.put(
        `${API_URL}/rooms/${roomId}/playlist`,
        { playlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Update playlist error:', error);
    }
  }
}));
