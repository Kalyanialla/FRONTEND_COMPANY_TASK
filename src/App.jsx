


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './accounts/Context/AuthContext';  // ADD THIS IMPORT
// import { Signup } from './accounts/Signup/Signup';
import { Signup } from './accounts/Singup/Signup';
import Login from './accounts/Login/Login';
import { ChatPage } from './chat/pages/ChatPage';



export const App = () => {
  return (
    <AuthProvider>  {/* WRAP Router with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ChatPage/>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>  
  );
};

export default App;