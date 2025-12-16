



import React, { useState } from 'react';
// import { UseChat } from '../../Hooks/UseChat.js'
import { useChat } from '../../context/ChatContext';

// import { UseChat } from '../../Hooks/UseChat';
import { getRoomName,getRoomAvatar,formatDateLabel,truncateMessage } from '../../utils/ChatHelper';

import {NewChatModal} from '../Newchatmodal/NewChatModal'

import './ChatList.css';

export const ChatList = () => {
  const { rooms, selectedRoom, selectRoom, loading } = useChat();
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Safely get current user ID
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id || null;

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room => {
    const roomName = getRoomName(room, currentUserId).toLowerCase();
    return roomName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="chat-list">
      {/* Header */}
      <div className="chat-list-header">
        <h2>Chats</h2>
        <button 
          className="new-chat-btn"
          onClick={() => setShowNewChat(true)}
          title="New Chat"
        >
          +
        </button>
      </div>

      {/* Search */}
      <div className="chat-list-search">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Room List */}
      <div className="chat-list-items">
        {loading && rooms.length === 0 ? (
          <div className="chat-list-loading">Loading chats...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="chat-list-empty">
            {searchQuery ? 'No chats found' : 'No chats yet. Start a new conversation!'}
          </div>
        ) : (
          filteredRooms.map(room => (
            <div
              key={room.id}
              className={`chat-list-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => selectRoom(room)}
              style={{ cursor: 'pointer' }} // show clickable pointer
            >
              {/* Avatar */}
              <div className="chat-avatar">
                {getRoomAvatar(room, currentUserId)}
              </div>

              {/* Content */}
              <div className="chat-content">
                <div className="chat-header-row">
                  <h3 className="chat-name">{getRoomName(room, currentUserId)}</h3>
                  {room.last_message && (
                    <span className="chat-time">
                      {formatTime(room.last_message.timestamp)}
                    </span>
                  )}
                </div>
                
                {room.last_message && (
                  <div className="chat-last-message">
                    <span className="message-sender">{room.last_message.sender}: </span>
                    <span className="message-text">
                      {truncateMessage(room.last_message.content, 35)}
                    </span>
                  </div>
                )}
              </div>

              {/* Unread Badge */}
              {room.unread_count > 0 && (
                <div className="unread-badge">{room.unread_count}</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal onClose={() => setShowNewChat(false)} />
      )}
    </div>
  );
};


