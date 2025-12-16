import React, { useEffect, useRef } from "react";
import { useChat } from "../../Hooks/UseChat";
import { useWebSocket } from "../../Hooks/UseWebSocket";
import {
  getRoomName,
  getRoomAvatar,
  formatDateLabel,
  groupMessagesByDate,
} from "../../utils/ChatHelper";

import { MessageInput } from "../MessageInput/MessageInput";

import Message from "../Message/Message";

import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

import "./ChatWindow.css";

// const ChatWindow = () => {
//   console.log('🚀 ChatWindow component is rendering!');
//   const { selectedRoom, messages } = useChat();
//   console.log('📱 ChatWindow selectedRoom:', selectedRoom, 'roomId:', selectedRoom?.id);
//   const { isConnected, typing, sendMessage, sendTyping } = useWebSocket(selectedRoom?.id);

//   // Debug: Log when selectedRoom changes
//   useEffect(() => {
//     console.log('🔄 ChatWindow selectedRoom changed to:', selectedRoom);
//   }, [selectedRoom]);
//   const messagesEndRef = useRef(null);
//   const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

//   // Auto scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   if (!selectedRoom) {
//     return (
//       <div className="chat-window-empty">
//         <div className="empty-state">
//           <div className="empty-icon">💬</div>
//           <h3>No Chat Selected</h3>
//           <p>Select a chat from the list to start messaging</p>
//         </div>
//       </div>
//     );
//   }

//   const roomName = getRoomName(selectedRoom, currentUserId);
//   const roomAvatar = getRoomAvatar(selectedRoom, currentUserId);
//   const groupedMessages = groupMessagesByDate(messages);

//   return (
//     <div className="chat-window">
//       {/* Header */}
//       <div className="chat-window-header">
//         <div className="header-info">
//           <div className="header-avatar">{roomAvatar}</div>
//           <div className="header-details">
//             <h3 className="header-name">{roomName}</h3>
//             <div className="header-status">
//               {isConnected ? (
//                 <span className="status-online">● Online</span>
//               ) : (
//                 <span className="status-offline">○ Connecting...</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="chat-window-messages">
//         {messages.length === 0 ? (
//           <div className="messages-empty">
//             <p>No messages yet. Start the conversation!</p>
//           </div>
//         ) : (
//           Object.entries(groupedMessages).map(([date, msgs]) => (
//             <div key={date} className="message-group">
//               {/* Date Label */}
//               <div className="date-label">
//                 <span>{formatDateLabel(date)}</span>
//               </div>

//               {/* Messages for this date */}
//               {msgs.map(message => (
//                 <Message
//                   key={message.id}
//                   message={message}
//                   isOwn={message.sender.id === currentUserId}
//                 />
//               ))}
//             </div>
//           ))
//         )}

//         {/* Typing Indicator */}
//         {typing && <TypingIndicator />}

//         {/* Auto scroll target */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <MessageInput
//         onSendMessage={sendMessage}
//         onTyping={sendTyping}
//         disabled={!isConnected}
//       />
//     </div>
//   );
// };
// export default ChatWindow

const ChatWindow = () => {
  const { selectedRoom, messages } = useChat();

  const roomId = selectedRoom?.id ?? null;
  const { isConnected, typing, sendMessage, sendTyping } = useWebSocket(roomId);

  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedRoom) {
    return (
      <div className="chat-window-empty">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No Chat Selected</h3>
          <p>Select a chat from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const roomName = getRoomName(selectedRoom, currentUserId);
  const roomAvatar = getRoomAvatar(selectedRoom, currentUserId);
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="header-info">
          <div className="header-avatar">{roomAvatar}</div>
          <div className="header-details">
            <h3 className="header-name">{roomName}</h3>
            <div className="header-status">
              {isConnected ? (
                <span className="status-online">● Online</span>
              ) : (
                <span className="status-offline">○ Connecting...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-window-messages">
        {messages.length === 0 ? (
          <div className="messages-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="date-label">
                <span>{formatDateLabel(date)}</span>
              </div>

              {msgs.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isOwn={message.sender?.id === currentUserId} // ✅ FIX
                />
              ))}
            </div>
          ))
        )}

        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendMessage={sendMessage}
        onTyping={sendTyping}
        disabled={!isConnected}
      />
    </div>
  );
};
export default ChatWindow;
