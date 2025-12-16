






// final 
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/Constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useChatLogic = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  // ---------------- USERS & ROOMS ----------------

  const fetchUsers = async () => {
    const res = await api.get('/auth/users/');
    setUsers(res.data.users);
  };

  const fetchRooms = async () => {
    const res = await api.get('/chat/rooms/');
    setRooms(res.data);
  };

  const fetchMessages = async (roomId) => {
    const res = await api.get(`/chat/rooms/${roomId}/messages/`);
    setMessages(res.data);
  };

  // ---------------- SOCKET ----------------

  const connectSocket = useCallback((roomId) => {
    const token = localStorage.getItem('access_token');

    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(
      `ws://127.0.0.1:8000/websocket/chat/${roomId}/?token=${token}`
    );

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error', err);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    socketRef.current = socket;
  }, []);

  // ---------------- ROOM SELECT ----------------

  const selectRoom = useCallback(async (room) => {
    setSelectedRoom(room);
    await fetchMessages(room.id);
    connectSocket(room.id);
  }, [connectSocket]);

  // ---------------- SEND MESSAGE ----------------

  const sendMessage = useCallback((content) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) {
      console.error('Socket not connected');
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: 'message',
        content: content,
      })
    );
  }, []);

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    fetchUsers();
    fetchRooms();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  return {
    users,
    rooms,
    selectedRoom,
    messages,
    selectRoom,
    sendMessage, // ⭐ VERY IMPORTANT
  };
};
