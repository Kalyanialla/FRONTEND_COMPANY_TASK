




import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // ADD useNavigate
import { loginUser } from '../Auth/Auth';
import { AuthContext } from '../Context/AuthContextValue';
import './Login.css';


function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();  // ADD THIS

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      setAuthData({
        access: res.access_token,
        refresh: res.refresh_token,
        username: res.user.username,  // ADD THIS
      });
      // STORE USER DATA
      localStorage.setItem('user', JSON.stringify(res.user));
      
      setMessage('Login successful!');
      navigate('/chat');  // ADD THIS - Redirect to chat
    } catch (err) {
      setMessage(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;