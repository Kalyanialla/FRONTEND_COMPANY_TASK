




import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import { registerUser } from '../Auth/Auth'; 
import './Signup.css';

export function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(form);
      setMessage(res.message || 'User registered successfully!');
      setForm({ username: '', email: '', password: '', password2: '' });

      // ✅ Redirect to login page after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      setMessage(JSON.stringify(err.errors) || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />
        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          type="password"
          required
        />
        <input
          name="password2"
          placeholder="Confirm Password"
          value={form.password2}
          onChange={handleChange}
          type="password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Link to login page */}
      <p style={{ marginTop: '10px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>

      {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
