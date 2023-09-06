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

    // Main function of movies display (This is like where the movie cards will show)

    if (!hasSearched) { // initial state of movie search page will show this text 
        return <div style={messageStyle}>Please search for movies...</div>;
    }

    if (movies.length === 0 && hasSearched) {
        return (
            <div style={messageStyle}>
                No movie found! 
                <span 
                    style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={onAddMovieClick}>
                    Add movie
                </span>
            </div>
        );
    }

      return (
        <div style={moviesStyle}>
            {movies.map((movie, index) => (
                <div key={index} style={movieCardStyle}>
                    <h3>{movie.title}</h3>
                    <p>{movie.blurb.substring(0, 20)}...</p>
                    <p>Rating: {movie.pgRating}</p>
                </div>
            ))}
        </div>
    );
}
    
export default MovieDisplay;
