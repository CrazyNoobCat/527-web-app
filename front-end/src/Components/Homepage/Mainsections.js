import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

function MainSection() {

  const outerBoxStyle = {
    display: 'flex',
    width: '55%',
    justifyContent: 'space-between',
    backgroundColor: '#E2D0FD08', 
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

  //Fake movies for now
  const movies = [
    { title: 'Movie 1', bio: 'This is the bio for Movie 1', date: '10th August' },
    { title: 'Movie 2', bio: 'This is the bio for Movie 2', date: '13th August' },
    { title: 'Movie 3', bio: 'This is the bio for Movie 3' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const futureRes = await axios.get(); //URL TO DATABASE
        const recentRes = await axios.get(); //URL TO DATABASE
        
        setFutureMovies(futureRes.data);
        setRecentMovies(recentRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    
    fetchData();
  }, []);

return (
  <div style={outerBoxStyle}>
    <div style={mainSectionStyle}>
      {/* Future Watchlist */}
      <div style={boxStyle}>
        Future Watchlist
        {futureMovies.length === 0 ? (
          <div style = {noDataStyle}>No future watchlist! Add movies</div>
        ) : (
          futureMovies.map((movie, index) => (
            <div key={index} style={futuremovieRow}>
              <strong>{movie.title}</strong>
              <p>{movie.bio.substring(0, 20)}...</p>
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
              <p>{movie.bio.substring(0, 20)}...</p>
              {movie.date && <span style={dateStyle}>{movie.date}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

}

export default MainSection;