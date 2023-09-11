import React from 'react';

function MovieDisplay({ movies, hasSearched, onAddMovieClick }) { 

    // CSS // 
    const moviesStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    };

    const movieCardStyle = {
        width: '20%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        margin: '1rem',
        padding: '1rem',
        backgroundColor: '#E2D0FD08',
        backgroundColor: '#ff',
        borderRadius: '5px'
    };

    const messageStyle= {
        textAlign: 'center',
        fontSize: '20px',
        color: '#777',
        marginTop: '2rem'
    };

    // END OF CSS // 

      return (
        <div style={moviesStyle}>
            {movies.map((movie, index) => (
                <div key={index} style={movieCardStyle}>
                    <h3>{movie.title}</h3>
                    <p>{movie.summary.substring(0, 100)}...</p>
                    <p>Runtime: {movie.runtime} mins</p>
                    <p>
  Genre:  
  {
    movie.genre.split(',').length > 2 
      ? movie.genre.split(',').slice(0, 2).join(', ') + ' +'
      : movie.genre
  }
</p>
                    <p>Language: {movie.language}</p>
                    <p>Release Date: {movie.release_date}</p>
                </div>
            ))}
        </div>
    );
}
    
export default MovieDisplay;
