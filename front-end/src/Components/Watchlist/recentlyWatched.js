import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // <-- Import axios
import MovieDisplay from '../../Common/MovieCard';
import Menu from '../../Common/Menu';
import { UserContext } from '../../UserContext/UserProvider';
import useMovieActions from './useMovieActions';

function RecentlyWatchedPage() {
    
  const [apiError, setApiError] = useState(null);
  const { movies, handleDeleteFromWatchHistory, setMovieList} = useMovieActions();
  const { accessToken } = useContext(UserContext);


  useEffect(() => {
    const fetchRecentlyWatchedMovies = async () => {
        try {
            const response = await axios.get(`https://api.cinemate.link/users/watch/history`, {
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
    <div className='movieHistoryBG' style={appStyle}>
      <Menu />
      <div style={mainContentStyle}>
        <h1>Watch History</h1>
        <div style={moviesContainerStyle}>
          {movies.length > 0 ? (
            <MovieDisplay movies={movies} 
            onDeleteFromWatchHistory={(movieId) => handleDeleteFromWatchHistory(movieId, accessToken)}
            displayType="watchHistory" 
            checked={false}/>
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

export default RecentlyWatchedPage;
