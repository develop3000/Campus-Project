import React from 'react';
import Event from './Event';

const EventList = ({ events, onRSVP }) => {
    return (
        <div>
            {events.map(event => (
                <Event key={event.id} event={event} onRSVP={onRSVP} />
            ))}
        </div>
    );
}

export default EventList;
