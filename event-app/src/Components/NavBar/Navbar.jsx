import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../Assests/Acity.png';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function logout() {
    try {
      await axios.post('/logout');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  }

  return (
    <nav>
      <img src={logo} alt="Logo" />
      <ul>
        <li>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/events" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
            Events
          </Link>
        </li>
        {user && user.role === 'admin' && (
          <li>
            <Link to="/createevents" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
              Create Event
            </Link>
          </li>
        )}
        <li>
          <Link to="/aboutus" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
            About Us
          </Link>
        </li>
        <li>
          <Link to="/calendar" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
            Calendar
          </Link>
        </li>
        <li>
          {user ? (
            <button 
              onClick={logout}
              style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
              Sign in
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
