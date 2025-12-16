



import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../accounts/Context/AuthContextValue';
import { ChatProvider } from '../context/ChatContext';
// import { useChat } from '../hooks/UseChat';
import { useChat } from '../context/ChatContext';

import {ChatList} from '../Components/ChatList/ChatList'


// import ChatWindow from './components/ChatWindow/ChatWindow';
import ChatWindow from '../Components/ChatWindow/ChatWindow';

import { logoutUser } from '../../accounts/Auth/Auth';
import './ChatPage.css';


// Inner component that renders the chat UI
const ChatPageContent = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const { rooms, selectedRoom, selectRoom } = useChat();

  // Auto-select the first room on load (only once when rooms are loaded)
  useEffect(() => {
    console.log('🔄 ChatPage useEffect - rooms:', rooms, 'selectedRoom:', selectedRoom);
    if (rooms.length > 0 && !selectedRoom) {
      console.log('🎯 Auto-selecting first room:', rooms[0]);
      selectRoom(rooms[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length]); // Only depend on rooms.length to avoid infinite loops

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser(authData.refresh, authData.access);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setAuthData({ access: null, refresh: null, username: null });
      navigate('/login');
    }
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-page-header">
        <div className="header-left">
          <h1>💬 ChatApp</h1>
        </div>
        <div className="header-right">
          <span className="user-name">👤 {authData.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout →
          </button>
        </div>
      </div>

      {/* Chat container */}
      <div className="chat-container">
        <ChatList />
        {selectedRoom ? (
          <ChatWindow />
        ) : (
          <div className="no-chat-selected">
            No Chat Selected
            <br />
            Select a chat from the list to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component
 export const ChatPage = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData.access) {
      navigate('/login');
    }
  }, [authData.access, navigate]);

  if (!authData.access) return null;

  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
};

