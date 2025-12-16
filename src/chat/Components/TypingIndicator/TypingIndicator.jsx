import React from 'react';
import './TypingIndicator.css';

export const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-bubble">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    </div>
  );
};

