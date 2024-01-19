
import React, { useState } from 'react';
import axios from 'axios';

const MovieSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const apiKey = "41059430";

    const handleSearch = async () => {
        const url = `https://www.omdbapi.com/?s=${query}&type=movie&apikey=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.Response === "True") {
                onSearch(response.data.Search);
            } else {
                alert("Movie could not be found");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            alert("Error fetching data");
        }
    };

    return (
        <div className="movie-search">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a movie..." />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default MovieSearch;
