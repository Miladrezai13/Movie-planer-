
import React from 'react';

const Event = ({ event }) => {
    return (
        <div className="event-container">
            <strong className="event-title">{event.title}</strong>
            {event.moviePoster && <img src={event.moviePoster} alt="Movie Poster" className="event-poster" />}
        </div>
    );
};

export default Event;
