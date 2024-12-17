import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../../UserContext';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'https://campus-project-back-end.onrender.com';
axios.defaults.withCredentials = true;

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedCategory));
    }
  }, [selectedCategory, events]);

  async function loadEvents() {
    try {
      const { data } = await axios.get('/events');
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load events');
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await axios.delete(`/event/${eventId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        toast.success('Event deleted successfully');
        loadEvents();
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('You must be logged in as admin to delete events');
      } else {
        toast.error(err.response?.data?.error || 'Failed to delete event');
      }
      console.error('Error deleting event:', err);
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '24px',
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#27172c', // A shade of blue
  };

  const searchStyle = {
    marginBottom: '16px',
    width: '100%',
    maxWidth: '500px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const cardContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    width: '100%',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '300px',
    width: '100%',
    transition: 'box-shadow 0.3s',
  };

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  };

  const buttonStyle = {
    marginTop: '16px',
    backgroundColor: '#0056b3',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Future Events</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="all">All Categories</option>
          <option value="club_activities">Club Activities</option>
          <option value="workshops">Workshops</option>
          <option value="seminars">Seminars</option>
        </select>
      </div>

      <div style={cardContainerStyle}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              style={cardStyle}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
            >
              {event.image && (
                <img 
                  src={`${axios.defaults.baseURL}/uploads/${event.image}`}
                  alt={event.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.target.src = 'fallback-image-url'; // Optional: provide a fallback image
                  }}
                />
              )}
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                {event.title}
              </h2>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Time:</strong> {event.time}
              </p>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Location:</strong> {event.location}
              </p>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Organizer:</strong> {event.organizer}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Link to={`/event/${event.id}`}>
                  <button style={buttonStyle}>
                    View Details
                  </button>
                </Link>
                
                {user && user.role === 'admin' && (
                  <button 
                    onClick={() => handleDelete(event.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#dc3545' // Red color for delete button
                    }}
                  >
                    Delete Event
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%', fontSize: '16px', color: '#666' }}>
            No events available in this category.
          </p>
        )}
      </div>
    </div>
  );
}
