import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'; 
import { UserContext } from '../../UserContext/UserProvider';

function MainSection() {

  const outerBoxStyle = {
    display: 'flex',
    width: '55%',
    justifyContent: 'space-between',
    //backgroundColor: '#E2D0FD08', 
    padding: '1rem' 

  }
  const mainSectionStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#E2D0FD08'

  };

  const boxStyle = {
    flex: 1, // Take up equal space
    backgroundColor: '#E2D0FD08', 
    margin: '0.5rem', // 1 rem spacing between the two boxes
    height: '45%',
    padding: '1rem'

  };

  const dateStyle = {
    position: 'absolute',
    right: '0.5rem',
    bottom: '0.5rem',
    fontSize: 'smaller'
  };

  const futuremovieRow = {

    backgroundColor:"#E2D0FD08",
    padding:'0.5rem',
    marginBottom: '0.5rem'

  };
  const recentMovieRow = {
    backgroundColor: "#E2D0FD08",
    padding: '0.5rem',
    marginBottom: '0.5rem',
    position: 'relative'  // Enable absolute positioning for children
  };

  const noDataStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // adjust as needed
  };

  const [futureMovies, setFutureMovies] = useState([]); // This is to get the users actua data
  const [recentMovies, setRecentMovies] = useState([]); // This is to get the users data
  const { accessToken } = useContext(UserContext);
  const [error, setError] = useState(null);

  async function fetchWatchlist() {
    try {
        const response = await axios.get(`https://api.cinemate.link/users/watch/list?limit=3`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setFutureMovies(response.data.movies);
        console.log("API Response:", response.data);
    } catch (err) {
        setError(err.message); // set error in case the fetch fails
        console.error("Error fetching watchlist data:", err);
    }
 }
  useEffect(() => {
    fetchWatchlist();
  }, []);
  
  async function fetchWatchhistory() {
    try {
        const response = await axios.get(`https://api.cinemate.link/users/watch/history?limit=3`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setRecentMovies(response.data.movies);
        console.log("API Response:", response.data);
    } catch (err) {
        setError(err.message); // set error in case the fetch fails
        console.error("Error fetching watchlist data:", err);
    }
 }
  useEffect(() => {
    fetchWatchhistory();
  }, []);


  return (
    <div className = 'backingColors' style={outerBoxStyle}>
      <div style={mainSectionStyle}>
        {/* Future Watchlist */}
        <div style={boxStyle}>
          Future Watchlist
          {futureMovies.length === 0 ? (
            <div style = {noDataStyle}>No future watchlist! Add movies</div>
          ) : (
            futureMovies.map((movie, index) => ( // Use slice to get the top 3 movies
              <div key={index} style={futuremovieRow}>
                <strong>{movie.title}</strong>
                <p>{movie.summary.substring(0, 20)}...</p>
              </div>
            ))
          )}
        </div>
        {/* Recently Watched */}
        <div style={boxStyle}>
          Recently Watched
          {recentMovies.length === 0 ? (
            <div style = {noDataStyle}>No previously watched movies! Search for movies to watch</div>
          ) : (
            recentMovies.map((movie, index) => (
              <div key={index} style={recentMovieRow}>
                <strong>{movie.title}</strong>
                <p>{movie.summary.substring(0, 20)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

}

export default MainSection;