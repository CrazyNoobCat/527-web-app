import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // <-- Import axios
import MovieDisplay from '../../Common/MovieCard';
import Menu from '../../Common/Menu';
import { UserContext } from '../../UserContext/UserProvider';
import useDeleteMovie from '../../Common/deletewatchlist';


function FutureWatchlist() {
  const { accessToken } = useContext(UserContext);
  const { movies, deleteMovie, setMovieList } = useDeleteMovie();

  useEffect(() => {
      const fetchRecentlyWatchedMovies = async () => {
          try {
              const response = await axios.get(`https://api.cinemate.link/users/watch/list`, {
                  headers: {
                      'Authorization': `Bearer ${accessToken}`
                  }
              });
              setMovieList(response.data.movies);
          } catch (error) {
              console.error("Error fetching watch list:", error);
          }
      };

      fetchRecentlyWatchedMovies();
  }, [accessToken, setMovieList]);

  const onDelete = (movieId) => {
      deleteMovie(movieId, accessToken);
  };


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
            <MovieDisplay movies={movies} onDeleteClick={onDelete} displayType="futureWatchlist"/>         
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
