import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import { toast } from "react-toastify";

export default function DisplayEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState(null);

  useEffect(() => {
    loadEvent();
    if (user) {
      loadRSVPStatus();
    }
  }, [id, user]);

  async function loadEvent() {
    try {
      const { data } = await axios.get(`/event/${id}`);
      setEvent(data);
    } catch (err) {
      toast.error('Failed to load event details');
      console.error("Error loading event:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadRSVPStatus() {
    try {
      const { data } = await axios.get(`/event/${id}/my-rsvp`);
      setRsvpStatus(data?.status || null);
    } catch (err) {
      console.error("Error loading RSVP status:", err);
    }
  }

  async function handleRSVP(status) {
    if (!user) {
      toast.error('Please login to RSVP');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/event/${id}/rsvp`, { status });
      toast.success(`Successfully ${status.toLowerCase()} for the event`);
      setRsvpStatus(status);
    } catch (err) {
      toast.error('Failed to update RSVP');
      console.error("Error updating RSVP:", err);
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await axios.delete(`/event/${id}`);
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete event');
      console.error('Error deleting event:', err);
    }
  };

  if (loading) return <div>Loading event details...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div style={containerStyle}>
      <div style={eventCardStyle}>
        {event.image && (
          <img
            src={`http://localhost:4000/uploads/${event.image}`}
            alt={event.title}
            style={imageStyle}
          />
        )}
        
        <h1 style={titleStyle}>{event.title}</h1>
        
        <div style={detailsStyle}>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Organizer:</strong> {event.organizer}</p>
        </div>

        <div style={descriptionStyle}>
          <h2>Description</h2>
          <p>{event.description}</p>
        </div>

        {user && (
          <div style={rsvpContainerStyle}>
            <h3>RSVP to this event</h3>
            <div style={buttonContainerStyle}>
              <button
                onClick={() => handleRSVP('ATTENDING')}
                style={{
                  ...rsvpButtonStyle,
                  backgroundColor: rsvpStatus === 'ATTENDING' ? '#4CAF50' : '#ddd'
                }}
              >
                Attending
              </button>
              <button
                onClick={() => handleRSVP('UNAVAILABLE')}
                style={{
                  ...rsvpButtonStyle,
                  backgroundColor: rsvpStatus === 'UNAVAILABLE' ? '#f44336' : '#ddd'
                }}
              >
                Can't Attend
              </button>
            </div>
          </div>
        )}

        {user && user.role === 'admin' && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleDelete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
};

const eventCardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '20px',
};

const imageStyle = {
  width: '100%',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '2em',
  marginBottom: '20px',
  color: '#333',
};

const detailsStyle = {
  marginBottom: '20px',
  lineHeight: '1.6',
};

const descriptionStyle = {
  marginBottom: '20px',
  lineHeight: '1.6',
};

const rsvpContainerStyle = {
  marginTop: '20px',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
};

const rsvpButtonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  color: 'white',
  transition: 'background-color 0.3s',
};
