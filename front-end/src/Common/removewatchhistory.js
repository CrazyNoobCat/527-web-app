import { useState } from 'react';
import axios from 'axios';

// The deleteMovieFromWatchlist function
async function deleteMovieFromWatchHistory(movieId, accessToken) {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    const url = `https://api.cinemate.link/users/watch/history`;

    try {
        await axios.delete(url, { headers, params: { id: movieId } });
    } catch (error) {
        console.error("Error deleting movie from watch history:", error);
    }
}

function useDeleteMovie() {
    const [movies, setMovies] = useState([]);

    const deleteMovie = async (movieId, accessToken) => {
        await deleteMovieFromWatchHistory(movieId, accessToken);
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    };

    const setMovieList = (movieList) => {
        setMovies(movieList);
    };

    return { movies, deleteMovie, setMovieList };
}

export default useDeleteMovie;
export {deleteMovieFromWatchHistory};
