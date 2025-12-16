



export const getRoomName = (room, currentUserId) => {
  if (room.name) {
    return room.name;
  }
  
  if (!room.members || !Array.isArray(room.members)) {
    return 'Unknown Room';
  }
  
  if (room.room_type === 'ONE_TO_ONE') {
    const otherMember = room.members.find(m => m.id !== currentUserId);
    return otherMember?.username || 'Unknown User';
  }
  
  return `Group (${room.members.length} members)`;
};

export const getRoomAvatar = (room, currentUserId) => {
  if (!room.members || !Array.isArray(room.members)) {
    return '?';
  }
  
  if (room.room_type === 'ONE_TO_ONE') {
    const otherMember = room.members.find(m => m.id !== currentUserId);
    return otherMember?.username?.charAt(0).toUpperCase() || '?';
  }
  
  return '👥';
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

export const groupMessagesByDate = (messages) => {
  const groups = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
};

export const truncateMessage = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};