import React, { useContext } from 'react';
import Navbar from './Components/NavBar/Navbar';
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from './UserContext';

function Layout() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && window.location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Full viewport height
  };

  const contentStyle = {
    flex: 1,          // Takes up available space
    marginTop: '100px',
    marginBottom: '40px' // Add some space above footer
  };

  const footerStyle = {
    backgroundColor: '#27172c',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto',  // Pushes footer to bottom
    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={contentStyle}>
        <Outlet />
      </div>
      <footer style={footerStyle}>
        <p>&copy; 2024 Campus Event Management Hub</p>
      </footer>
    </div>
  );
}

export default Layout;



