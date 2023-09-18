import React from 'react';
import { Link } from "react-router-dom";
import useMovieActions from '../Components/Watchlist/useMovieActions';

function MovieDisplay({ movies, displayType, onDeleteClick,onMarkAsWatched, onAddToWatchHistory, onDeleteFromWatchHistory }) { 

    // CSS // 
    const moviesStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    };

    const movieCardStyle = {
        width: '30%',
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
    const handleMarkAsWatched = (movieId) => {
        onMarkAsWatched(movieId);
        onAddToWatchHistory(movieId);
    }
    

    const renderCheckBox = (movie) => {
        switch (displayType) {
            case 'futureWatchlist':
                return (
                    <>
                    <div className='row'>
                        <div className='col-12'>
                            <button className='col-12' onClick={()=> onDeleteClick(movie.id)}>Delete from Watchlist</button>
                        </div>
                    </div>
                    <div><p></p></div>
                    <div className='`row'>
                        <div className='col-12'>
                            <button className='col-12' onClick={()=> handleMarkAsWatched(movie.id)}>Mark as Watched</button>
                        </div>
                    </div>
                    </>
                  );
            case 'watchHistory':
                return (
                    <>
                    <div className='row'>
                        <div className='col-12'>
                            <button className = 'col-12' onClick={()=> onDeleteFromWatchHistory(movie.id)}>Delete from History</button>
                        </div>
                    </div>
                  </>
                );
        }
    }

    // END OF CSS // 
    return (
        <div style={moviesStyle}>
            {movies.map((movie, index) => {
                if (!movie) return null;
                return (
                    <div className = 'movieShadowBoxes'style={movieCardStyle} key={index}>
                        <h3>
                            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                        </h3>
                        <p>{movie.summary ? movie.summary.substring(0, 100) + '...' : 'Summary not available.'}</p>
                        <p>Runtime: {movie.runtime} mins</p>
                        <p>
                            Genre:  
                            {
                                movie.genre 
                                ? (movie.genre.split(',').length > 2 
                                    ? movie.genre.split(',').slice(0, 2).join(', ') + ' +' 
                                    : movie.genre)
                                : "Genre not available"
                            }
                        </p>
                        <p>Language: {movie.language}</p>
                        <p>Release Date: {movie.release_date}</p>
                        {renderCheckBox(movie)}
                    </div>
                );
            })}
        </div>
    );
}
    
export default MovieDisplay;
