

// final 
import React, { createContext, useContext } from 'react';
import { useChatLogic } from '../Hooks/UseChatLogic';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chatLogic = useChatLogic();

  return (
    <ChatContext.Provider value={chatLogic}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used inside ChatProvider');
  }
  return context;
};
