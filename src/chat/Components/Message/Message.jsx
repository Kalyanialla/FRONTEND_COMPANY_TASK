import React from 'react';
import { formatMessageTime } from '../../utils/ChatHelper';
import './Message.css';

const Message = ({ message, isOwn }) => {
  if (!message) return null;
  
  const senderName = message.sender?.username || message.sender?.name || 'Unknown';
  const content = message.content || '';
  const timestamp = message.timestamp || '';
  
  return (
    <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
      <div className="message-bubble">
        {!isOwn && (
          <div className="message-sender-name">{senderName}</div>
        )}
        <div className="message-content">{content}</div>
        <div className="message-footer">
          <span className="message-time">{formatMessageTime(timestamp)}</span>
          {isOwn && (
            <span className="message-status">
              {message.is_read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;