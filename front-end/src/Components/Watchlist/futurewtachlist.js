import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // <-- Import axios
import MovieDisplay from '../../Common/MovieCard';
import Menu from '../../Common/Menu';


function FutureWatchlist() {
    
  const [movies, setMovies] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchRecentlyWatchedMovies = async () => {
      try {
        const response = await axios.get('https://api.cinemate.link/users/watch/list?limit=2&page=1');
         setMovies(response.data.movies); // adjust if the response structure is different
      } catch (error) {
        setApiError(error.message);
      }
    };

    fetchRecentlyWatchedMovies();
  }, []);

  const appStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  };

  const moviesContainerStyle = {
    flex: 1, 
    padding: '0.5rem',
    backgroundColor: '#E2D0FD08',
  };

  const mainContentStyle = {
    width: '85%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '1rem'
  };

  return (
    <div style={appStyle}>
      <Menu />
      <div style={mainContentStyle}>
        <h1>Your Watch List</h1>
        <div style={moviesContainerStyle}>
          {movies.length > 0 ? (
            <MovieDisplay movies={movies} />
          ) : (
            <div>
              <h2>You haven't watched any movies recently.</h2>
              <Link to="/search">Search for movies</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FutureWatchlist;
