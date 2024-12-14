import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Layout from './layout';
import Hero from './Components/Hero/Hero';
import { UserContextProvider } from './UserContext';
import CreateEvents from './Components/CreateEvents/CreateEvents';
import DisplayEvent from './Components/DisplayEvent/DisplayEvent';
import EventPage from './Components/EventPage/EventPage';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import AboutUs from './Components/AboutUs/AboutUs';
import Calendar from './Components/Calendar/Calendar';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configure Axios
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <UserContextProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Hero />} />
            <Route path="createevents" element={<CreateEvents />} />
            <Route path="event/:id" element={<DisplayEvent />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="events" element={<EventPage />} />
          </Route>
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </UserContextProvider>
    </Router>
  );
}

export default App;
