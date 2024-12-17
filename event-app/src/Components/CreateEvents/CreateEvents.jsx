import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = 'https://campus-project-back-end.onrender.com';
axios.defaults.withCredentials = true;

export default function CreateEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizer: user ? user.name : "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: null,
  });

  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('organizer', formData.organizer);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post('/createEvent', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success('Event created successfully!');
        navigate('/events');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You must be logged in as admin to create events');
      } else {
        toast.error(error.response?.data?.error || 'Failed to create event');
      }
      console.error('Error creating event:', error);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    margin: 'auto',
    padding: '24px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '8px',
  };

  const buttonStyle = {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '24px' }}>Post an Event</h1>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            style={inputStyle}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="organizer">Hosted By:</label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            style={inputStyle}
            value={formData.organizer}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="description">Overview:</label>
          <textarea
            id="description"
            name="description"
            style={{ ...inputStyle, height: '100px' }} 
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="date">Date of Event:</label>
          <input
            type="date"
            id="date"
            name="date"
            style={inputStyle}
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="time">Time of Event:</label>
          <input
            type="time"
            id="time"
            name="time"
            style={inputStyle}
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="location">Venue:</label>
          <input
            type="text"
            id="location"
            name="location"
            style={inputStyle}
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            style={inputStyle}
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="club_activities">Club Activities</option>
            <option value="workshops">Workshops</option>
            <option value="seminars">Seminars</option>
          </select>
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="image">Event Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            style={inputStyle}
            onChange={handleImageUpload}
          />
        </div>
        <button style={buttonStyle} type="submit">Submit</button>
      </form>
    </div>
  );
}
