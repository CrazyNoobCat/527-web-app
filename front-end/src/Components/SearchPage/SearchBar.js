import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';


function SearchBar({ onSearch }) {

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
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // For error state
    const API_ENDPOINT = "https://api.cinemate.link/movies";

    const fetchMovies = (term) => {
            if (!accessToken) {
                console.error("No access token available");
                setError("Authentication failed.");
                return;
            }

            console.log("Fetching movies with term:", term);

            setLoading(true); // Set loading state before API call
            setError(null); // Reset error state before new API call

            Axios.get(API_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    title: term,
                    limit: 10,    
                    page: 1       
                }
            })
            .then(response => {
                onSearch(response.data);
                setLoading(false); // Reset loading state after successful API call
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setError("Error fetching movies."); // Set a user-friendly error message
                setLoading(false); // Reset loading state after failed API call
            });
        };

        const handleKeyPress = (event) => {
          if (event.key === 'Enter') {
              fetchMovies(searchTerm);
          }
      }

      return (
        <div style={container}>
            <input 
                style={searchBarStyle}
                type="text"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={() => fetchMovies(searchTerm)}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
        </div>
    );
}
  
export default SearchBar;