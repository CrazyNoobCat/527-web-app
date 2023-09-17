import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';
import { useLocation } from 'react-router-dom';


function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function SearchBar({ onSearch }) {

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
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // For error state
    const API_ENDPOINT = "https://api.cinemate.link/movies";
    const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTerm);
    const [currentSearchGenre, setCurrentSearchGenre] = useState(initialSearchGenre);


    const fetchMovies = () => {
        console.log("fetchMovies function triggered");
            if (!accessToken) {
                setError("Authentication failed.");
                return;
            }
            let params = {}

            if (currentSearchTerm) {
                params.title = currentSearchTerm;
            } else if (currentSearchGenre) {
                params.genre = currentSearchGenre;
            } else {
                // Nothing to search for
                return;
            }

            setLoading(true); // Set loading state before API call
            setError(null); // Reset error state before new API call
            console.log("API Query Parameters: ", params);

            Axios.get(API_ENDPOINT, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    ...params,
                    limit: 10,    
                    page: 1       
                }
            })
            .then(response => {
                onSearch(currentSearchTerm || currentSearchGenre, response.data);
                 setLoading(false);
                
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setError("Error fetching movies."); // Set a user-friendly error message
                setLoading(false); // Reset loading state after failed API call
            });
        };

        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                setCurrentSearchGenre("");  // Reset genre
                setCurrentSearchTerm(searchTerm);  // Update the search term
                // Don't call fetchMovies here as the state update will trigger the useEffect
            }
        };
        
        useEffect(() => {
            setCurrentSearchTerm(initialSearchTerm);
            setCurrentSearchGenre(initialSearchGenre);
            
            //fetchMovies(); // This will now fetch based on the updated state values
        
        }, [initialSearchTerm, initialSearchGenre]);

        useEffect(() => {
            fetchMovies();
        }, [currentSearchTerm, currentSearchGenre]);

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
            <button onClick={() => {
                    setCurrentSearchGenre("");
                    setCurrentSearchTerm(searchTerm);
                }}>Search</button>

            {loading && <p>Loading...</p>}
            {initialSearchGenre && <p>Showing results for genre: {initialSearchGenre}</p>}
            {error && <p>{error}</p>}
        </div>
    );
}
  
export default SearchBar;