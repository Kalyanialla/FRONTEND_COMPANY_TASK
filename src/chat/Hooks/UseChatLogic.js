






  // final 
  import { useState, useEffect, useRef, useCallback, useContext } from 'react';
  import axios from 'axios';
  import { API_BASE_URL } from '../utils/Constants';
import { AuthContext } from '../../accounts/Context/AuthContextValue';

  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
  });

  // api.interceptors.request.use((config) => {
  //   const token = localStorage.getItem('access_token');
  //   if (token) config.headers.Authorization = `Bearer ${token}`;
  //   return config;
  // });

  // export const useChatLogic = () => {
  //   const [loading, setLoading] = useState(false);
  //   const [users, setUsers] = useState([]);
  //   const [rooms, setRooms] = useState([]);
  //   const [selectedRoom, setSelectedRoom] = useState(null);
  //   const [messages, setMessages] = useState([]);

  //   const socketRef = useRef(null);

  //   // ---------------- USERS & ROOMS ----------------

  //   const fetchUsers = async () => {
  //     const res = await api.get('/auth/users/');
  //     setUsers(res.data.users);
  //   };

  //   const fetchRooms = async () => {
  //     const res = await api.get('/chat/rooms/');
  //     setRooms(res.data);
  //   };

  //   const fetchMessages = async (roomId) => {
  //     const res = await api.get(`/chat/rooms/${roomId}/messages/`);
  //     setMessages(res.data);
  //   };

  //   // ---------------- SOCKET ----------------

  //   const connectSocket = useCallback((roomId) => {
  //     const token = localStorage.getItem('access_token');

  //     if (socketRef.current) {
  //       socketRef.current.close();
  //     }

  //     const socket = new WebSocket(
  //       `ws://127.0.0.1:8000/websocket/chat/${roomId}/?token=${token}`
  //     );

  //     socket.onopen = () => {
  //       console.log('✅ WebSocket connected');
  //     };

  //     socket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);

  //       if (data.type === 'message') {
  //         setMessages((prev) => [...prev, data.message]);
  //       }
  //     };

  //     socket.onerror = (err) => {
  //       console.error('❌ WebSocket error', err);
  //     };

  //     socket.onclose = () => {
  //       console.log('🔌 WebSocket disconnected');
  //     };

  //     socketRef.current = socket;
  //   }, []);

  //   // ---------------- ROOM SELECT ----------------

  //   const selectRoom = useCallback(async (room) => {
  //     setSelectedRoom(room);
  //     await fetchMessages(room.id);
  //     connectSocket(room.id);
  //   }, [connectSocket]);

  //   // ---------------- SEND MESSAGE ----------------

  //   const sendMessage = useCallback((content) => {
  //     if (!socketRef.current || socketRef.current.readyState !== 1) {
  //       console.error('Socket not connected');
  //       return;
  //     }

  //     socketRef.current.send(
  //       JSON.stringify({
  //         type: 'message',
  //         content: content,
  //       })
  //     );
  //   }, []);

  //   const createRoom = async (userIds) => {
  //   try {
  //     setLoading(true);

  //     const res = await api.post('/chat/rooms/', {
  //       member_ids: userIds,
  //     });

  //     // refresh rooms list
  //     await fetchRooms();

  //     return res.data;
  //   } catch (err) {
  //     console.error('Create room failed', err);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  //   // ---------------- EFFECTS ----------------

  //   useEffect(() => {
  //     fetchUsers();
  //     fetchRooms();

  //     return () => {
  //       if (socketRef.current) socketRef.current.close();
  //     };
  //   }, []);

  //   return {
  //     users,
  //     rooms,
  //     selectedRoom,
  //     messages,
  //     selectRoom,
  //     sendMessage, 
  //     createRoom
  //   };
  // };

  export const useChatLogic = () => {
    const { authData } = useContext(AuthContext);
  // console.log(authData)
   // ✅ THIS FUNCTION WAS MISSING
  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get('/auth/users/', {
        headers: {
          Authorization: `Bearer ${authData.access}`,
          'Content-Type': 'application/json',
        },
      });
    setUsers(res.data.users);
  };

  const fetchRooms = async () => {
    const res = await api.get('/chat/rooms/',{
        headers: {
          Authorization: `Bearer ${authData.access}`,
          'Content-Type': 'application/json',
        },
      });
    setRooms(res.data);
  };

  const fetchMessages = async (roomId) => {
    const res = await api.get(`/chat/rooms/${roomId}/messages/`,  {
        headers: {
          Authorization: `Bearer ${authData.access}`,
          'Content-Type': 'application/json',
        },
      });
    setMessages(res.data);
  };

  const selectRoom = async (room) => {
    setSelectedRoom(room);
    await fetchMessages(room.id);
  };

  const createRoom = async (userIds) => {
    setLoading(true);
    try {
      const res = await api.post('/chat/rooms/', {
        member_ids: userIds,
      }, {
        headers: {
          Authorization: `Bearer ${authData.access}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchRooms();
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  return {
    loading,
    users,
    rooms,
    selectedRoom,
    messages,
    selectRoom,
    createRoom,
    setMessages, 
    addMessage
  };
};

