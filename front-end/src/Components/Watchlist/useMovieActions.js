import { useState } from 'react';
import axios from 'axios';
import addToWatchHistory from '../../Common/addHistory';
import { deleteMovieFromWatchlist } from '../../Common/deletewatchlist';
import {deleteMovieFromWatchHistory} from '../../Common/removewatchhistory';

function useMovieActions() {
    const [movies, setMovies] = useState([]);

    const handleMarkAsWatched = async (movieId, accessToken) => {
        console.log("Starting handleMarkAsWatched for movieId:", movieId);
        // Remove the movie from the watchlist
        await deleteMovieFromWatchlist(movieId, accessToken);
        
        // Add the movie to watch history
        const watchedMovie = movies.find(movie => movie.id === movieId);
        console.log('Watched movie object:', watchedMovie);
        await addToWatchHistory(watchedMovie, accessToken);
        console.log("Updated watch history:", watchedMovie);
        
        // Update local movies state
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
        console.log("Updated local movies state after marking movie as watched:", watchedMovie)
    };

    const handleAddToWatchHistory = async (movieId, accessToken) => {
        await addToWatchHistory(movieId, accessToken);
        const newMovie = { id: movieId }; 
        setMovies(prevMovies => [...prevMovies, newMovie]);
    };

    const handleRemoveFromWatchlist = async (movieId, accessToken) => {
        await deleteMovieFromWatchlist(movieId, accessToken);
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    };
    const handleDeleteFromWatchHistory = async (movieId, accessToken) => {
        await deleteMovieFromWatchHistory(movieId, accessToken);
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    };

    const setMovieList = (movieList) => {
        setMovies(movieList);
    };

    return { 
        movies, 
        handleMarkAsWatched, 
        handleAddToWatchHistory, 
        handleRemoveFromWatchlist, 
        setMovieList,
        handleDeleteFromWatchHistory
    };
}

export default useMovieActions;