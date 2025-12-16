import axios from 'axios';
// import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
// import { API_BASE_URL ,API_ENDPOINTS} from '../utils/Constants';
import { API_BASE_URL,API_ENDPOINTS } from '../utils/constants';

const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const chatApiService = {
  // Get all chat rooms
  async getRooms() {
    try {
      const response = await chatApi.get(API_ENDPOINTS.ROOMS);
      console.log('Rooms loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('getRooms error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Create new room
  async createRoom(memberIds, roomType = 'ONE_TO_ONE', name = '') {
    try {
      const response = await chatApi.post(API_ENDPOINTS.ROOMS, {
        member_ids: memberIds,
        room_type: roomType,
        name,
      });
      console.log('Room created:', response.data);
      return response.data;
    } catch (error) {
      console.error('createRoom error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get room details
  async getRoomDetail(roomId) {
    try {
      const response = await chatApi.get(API_ENDPOINTS.ROOM_DETAIL(roomId));
      return response.data;
    } catch (error) {
      console.error('getRoomDetail error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get messages for a room
  async getMessages(roomId) {
    try {
      const response = await chatApi.get(API_ENDPOINTS.MESSAGES(roomId));
      console.log('Messages loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('getMessages error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Mark messages as read
  async markAsRead(roomId) {
    try {
      const response = await chatApi.post(API_ENDPOINTS.MARK_READ(roomId));
      return response.data;
    } catch (error) {
      console.error('markAsRead error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get all users
  async getUsers() {
    try {
      const response = await chatApi.get(API_ENDPOINTS.USERS);
      console.log('Users loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('getUsers error:', error);
      throw error.response?.data || error.message;
    }
  },
};