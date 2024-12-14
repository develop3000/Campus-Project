import * as React from 'react';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function LoginSignup() {
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLoginMode ? '/login' : '/register';
      const { data } = await axios.post(endpoint, isLoginMode ? {
        email: formData.email,
        password: formData.password
      } : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user'
      });

      if (data.user) {
        setUser(data.user);
        toast.success(isLoginMode ? 'Login successful!' : 'Registration successful!');
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27172c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '16px'
  };

  const toggleStyle = {
    marginTop: '16px',
    color: '#27172c',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          {isLoginMode ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={toggleStyle} onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode 
            ? "Don't have an account? Register here" 
            : "Already have an account? Login here"}
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
