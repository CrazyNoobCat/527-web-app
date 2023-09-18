import React from 'react';

function MainSection() {

  const outerBoxStyle = {
    display: 'flex',
    width: '55%',
    justifyContent: 'space-between',
    backgroundColor: '#E2D0FD08', // Your background color
    padding: '1rem' // Spacing

  }
  const mainSectionStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#E2D0FD08'

  };

  const boxStyle = {
    flex: 1, // Take up equal space
    backgroundColor: '#E2D0FD08', // Your background color
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

  //Fake movies for now
  const movies = [
    { title: 'Movie 1', bio: 'This is the bio for Movie 1', date: '10th August' },
    { title: 'Movie 2', bio: 'This is the bio for Movie 2', date: '13th August' },
    { title: 'Movie 3', bio: 'This is the bio for Movie 3' },
  ];

  return (
<div style={outerBoxStyle}>
      <div style={mainSectionStyle}>
        <div style={boxStyle}>
          Future Watchlist
          {/* Map over movie data to display each movie */}
          {movies.map((movie, index) => (
            <div key={index} style={futuremovieRow}>
              <strong>{movie.title}</strong>
              <p>{movie.bio.substring(0, 20)}...</p> {/* Display the first 20 characters of the bio */}
            </div>
          ))}
        </div>
        <div style={boxStyle}>
          Recently Watched
          {movies.map((movie, index) => (
            <div key={index} style={recentMovieRow}>
              <strong>{movie.title}</strong>
              <p>{movie.bio.substring(0, 20)}...</p>
              {movie.date && <span style={dateStyle}>{movie.date}</span>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MainSection;
