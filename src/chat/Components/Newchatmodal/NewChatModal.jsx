



import React, { useState } from 'react';
import { useChat } from '../../Hooks/UseChat';
import './NewChatModal.css';

 export const NewChatModal = ({ onClose }) => {
  const { users, createRoom, loading } = useChat();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Get current user ID - try multiple possible storage locations
  const getCurrentUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user?.id || user?.user_id || null;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Ensure users is always an array
  const usersArray = Array.isArray(users) ? users : [];

  // Filter out the current logged-in user
  const filteredUsers = usersArray.filter(user => {
    // Exclude current user - check both id and user_id fields
    const userId = user?.id || user?.user_id;
    if (userId && currentUserId && (userId === currentUserId || String(userId) === String(currentUserId))) {
      return false;
    }
    
    // If no search query, show all remaining users
    if (!searchQuery.trim()) {
      return true;
    }
    
    // Search in username, email, first_name, last_name
    const query = searchQuery.toLowerCase().trim();
    const username = (user.username || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const firstName = (user.first_name || '').toLowerCase();
    const lastName = (user.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    
    return (
      username.includes(query) || 
      email.includes(query) || 
      firstName.includes(query) || 
      lastName.includes(query) ||
      fullName.includes(query)
    );
  });

  const handleCreateChat = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      setError('');
      const userId = selectedUser.id || selectedUser.user_id;
      await createRoom([userId]);
      onClose();
    } catch (err) {
      console.error('Failed to create chat:', err);
      setError(err.response?.data?.message || 'Failed to create chat. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>New Chat</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Search */}
        <div className="modal-search">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modal-search-input"
            autoFocus
          />
        </div>


        {/* User List */}
        <div className="modal-user-list">
          {loading ? (
            <div className="modal-empty">
              <p>Loading users...</p>
            </div>
          ) : usersArray.length === 0 ? (
            <div className="modal-empty">
              <p>No users available</p>
              <small style={{ display: 'block', marginTop: '8px', color: '#999' }}>
                Make sure you're logged in
              </small>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="modal-empty">
              <p>
                {searchQuery 
                  ? `No users found matching "${searchQuery}"` 
                  : 'No other users available'}
              </p>
              {searchQuery && (
                <small style={{ display: 'block', marginTop: '8px', color: '#999' }}>
                  Try a different search term
                </small>
              )}
            </div>
          ) : (
            <div>
              <div style={{ padding: '10px 12px', fontSize: '12px', color: '#666', fontWeight: '500' }}>
                {searchQuery 
                  ? `Found ${filteredUsers.length} matching user${filteredUsers.length !== 1 ? 's' : ''}`
                  : `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} available`
                }
              </div>
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`modal-user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedUser(user);
                    setError('');
                  }}
                >
                  <div className="modal-user-avatar">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="modal-user-info">
                    <div className="modal-user-name">
                      {user.username || 'Unknown'}
                      {(user.first_name || user.last_name) && (
                        <span style={{ marginLeft: '6px', color: '#666', fontSize: '12px', fontWeight: 'normal' }}>
                          ({user.first_name} {user.last_name})
                        </span>
                      )}
                    </div>
                    <div className="modal-user-email">{user.email || 'No email'}</div>
                  </div>
                  {selectedUser?.id === user.id && (
                    <div className="modal-user-check">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="modal-error" style={{
            padding: '12px',
            margin: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="modal-btn modal-btn-create"
            onClick={handleCreateChat}
            disabled={!selectedUser || loading}
          >
            {loading ? 'Creating...' : 'Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

