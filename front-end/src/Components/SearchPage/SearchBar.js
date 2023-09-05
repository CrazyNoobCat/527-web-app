import React, { useState } from 'react';
import Axios from 'axios';


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

    const [searchTerm, setSearchTerm] = useState('');

    const fetchMovies = (term) => {
      console.log("Fetching movies with term:", term); // Was for me to debug
      Axios.get(`YOUR_API_ENDPOINT?search=${term}`) // NEEDS UPDATE OF ACTUAL API
          .then(response => {
              onSearch(response.data);
          })
          .catch(error => {
              console.error("Error fetching movies:", error);
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
    </div>
);
}

export default SearchBar;