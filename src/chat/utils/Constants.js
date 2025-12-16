


// export const API_BASE_URL = 'http://127.0.0.1:8000';
export const API_BASE_URL='https://backend-company-task3.onrender.com'
export const WS_BASE_URL = 'wss://backend-company-task3.onrender.com';
// export const WS_BASE_URL = 'ws://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/api/auth/signup/',
    LOGIN: '/api/auth/login/',
    LOGOUT: '/api/auth/logout/',
    USERS: '/api/auth/users/',
    ME: '/api/auth/users/me/',
  },
  
  // Chat endpoints
  CHAT: {
    ROOMS: '/api/chat/rooms/',
    ROOM_DETAIL: (id) => `/api/chat/rooms/${id}/`,
    MESSAGES: (roomId) => `/api/chat/rooms/${roomId}/messages/`,
    MARK_READ: (roomId) => `/api/chat/rooms/${roomId}/mark_read/`,
  },
  
  // Legacy (for backward compatibility)
  ROOMS: '/api/chat/rooms/',
  ROOM_DETAIL: (id) => `/api/chat/rooms/${id}/`,
  MESSAGES: (roomId) => `/api/chat/rooms/${roomId}/messages/`,
  MARK_READ: (roomId) => `/api/chat/rooms/${roomId}/mark_read/`,
  USERS: '/api/auth/users/',
};

export const WS_ENDPOINTS = {
  CHAT: (roomId, token) =>
    `${WS_BASE_URL}/websocket/chat/${roomId}/?token=${token}`,
};

export const ROOM_TYPES = {
  ONE_TO_ONE: 'ONE_TO_ONE',
  GROUP: 'GROUP',
};

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  READ: 'read',
  FAILED: 'failed',
};