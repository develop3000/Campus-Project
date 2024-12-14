import React from 'react';

const Event = ({ event, onRSVP }) => {
    return (
        <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <h2>{event.name}</h2>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>Available Seats: {event.seats}</p>
            <button onClick={() => onRSVP(event.id)} disabled={event.seats <= 0}>
                RSVP
            </button>
        </div>
    );
}

export default Event;
