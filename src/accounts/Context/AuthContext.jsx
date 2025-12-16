import React, { useState } from 'react';
import { AuthContext } from './AuthContextValue';

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    access: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
    username: localStorage.getItem('username') || null
  });

  // Save tokens to localStorage whenever they change
  const saveAuthData = (data) => {
    setAuthData(data);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('username', data.username);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData: saveAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
