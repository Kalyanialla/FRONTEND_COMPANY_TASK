






import { useEffect, useRef, useState } from 'react';
// import { useChat } from './UseChat';
import { useChat } from './UseChat';

import { API_BASE_URL, WS_BASE_URL } from '../utils/Constants';

export const useWebSocket = (roomId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  const { addMessage } = useChat(); // CONNECT WS → CHAT STATE

  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem('access_token');
    // const wsUrl = `ws://127.0.0.1:8000/websocket/chat/${roomId}/?token=${token}`;
    const wsUrl = `${WS_BASE_URL}/websocket/chat/${roomId}/?token=${token}`;


    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log('📩 WS message:', data);

       if (data.type === 'message') {
        addMessage(data.message);   
      }

      if (data.type === 'typing') {
        setTyping(data.is_typing);
      }
    };

    socketRef.current.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [roomId, addMessage]);

  const sendMessage = (content) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    socketRef.current.send(
      JSON.stringify({
        type: 'message',
        content,
      })
    );
  };

  const sendTyping = (isTyping) => {
    if (!socketRef.current) return;
    socketRef.current.send(
      JSON.stringify({
        type: 'typing',
        is_typing: isTyping,
      })
    );
  };

  return { isConnected, sendMessage, sendTyping, typing }; // for show the status of user
};
