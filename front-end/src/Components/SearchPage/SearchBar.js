import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';
import { useLocation } from 'react-router-dom';


function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function SearchBar({ onSearch }) {

    console.log("SearchBar rendered");
    const query = useQuery();
    const initialSearchTerm = query.get("query");
    const initialSearchGenre = query.get("genre");
    

  // CSS //
    const searchBarStyle = {
      width: '100%',  // Full width
      height: '100%',
      padding: '10px 10px',  // Padding for larger text area
      fontSize: '20px',  // Bigger font
      backgroundColor: 'black',  // Black background
      color: 'white',  // White text
      boxSizing: 'border-box',
    };

    const container = { // for button to sit in with search box 
      display: 'flex',
      alignItems: 'center'
    }
    // End of css //
  
    //Main functioning of search bar//
    const {accessToken} = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_ENDPOINT = "https://api.cinemate.link/movies";

    const fetchMovies = () => {
        if (!accessToken) {
            setError("Authentication failed.");
            return;
        }

        setLoading(true); 
        setError(null);

        Axios.get(API_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                title: searchTerm,
                limit: 10,    
                page: 1       
            }
        })
        .then(response => {
            onSearch(searchTerm, response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching movies:", err);
            setError("Error fetching movies.");
            setLoading(false);
        });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchMovies();
        }
    };

    return (
        <div style={container}>
            <input 
                style={searchBarStyle}
                type="text"
                placeholder="Search for movies by title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={fetchMovies}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
        </div>
    );
}
  
export default SearchBar;