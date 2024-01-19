"use strict";
import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import Event from './Event';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import 'whatwg-fetch';


const localizer = momentLocalizer(moment);
const GOOGLE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/';
const CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';
const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k';
const dataUrl = `${GOOGLE_CALENDAR_URL}${CALENDAR_ID}/events?key=${PUBLIC_KEY}`;
const placeholderPoster = "path/to/your/placeholder/image.jpg";



const App = () => {
  const [movies, setMovies] = useState([]);
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleAddEvent = () => {
    if (selectedMovie && startDate) {
      const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

      const newEvent = {
        title: selectedMovie.Title,
        start: startDate,
        end: endDate,
        moviePoster: selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : placeholderPoster,
      };

      setEvents([...events, newEvent]);
      setShowDatePicker(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(dataUrl);
      const events = response.data.items.map(event => ({
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date), // same as above

      }));
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleOpenDatePicker = (movie) => {
    setSelectedMovie(movie);
    setShowDatePicker(true);
  };

  const handleClearResults = () => {
    setMovies([]);
  };

  useEffect(() => {
    fetchEvents();
  }, []);




  return (
    <div className='searchbar'>
      <h1>Plan Your Movie Night</h1>
      <MovieSearch onSearch={setMovies} />

      {showDatePicker && (
        <div className="modal-overlay">
          <div className="modal">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"

              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <button onClick={handleAddEvent}>Set Date</button>
            <button onClick={() => setShowDatePicker(false)}>Cancel</button>
          </div>
        </div>
      )}
      {movies.length > 0 && (
        <div>
          <div className="movies-container">
            {movies.map(movie => (
              <div key={movie.imdbID} className="movie">
                <img src={movie.Poster !== "N/A" ? movie.Poster : placeholderPoster} alt={`Poster of ${movie.Title}`} />
                <p>{movie.Title} ({movie.Year})</p>

                <button className="add_to_calendar_button" onClick={() => handleOpenDatePicker(movie)}>Add to Calendar</button>
              </div>
            ))}
            <button className="clear-results-button" onClick={handleClearResults}>
              Clear Results
            </button>

          </div>
        </div>
      )}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 800 }}
          components={{
            event: Event,
          }}
        />
      </div>
    </div>
  );
};

export default App;
