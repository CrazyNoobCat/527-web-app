import axios from 'axios';

// Define a function to add a movie to the user's watchlist
async function addMovieToWatchlist(movieId, userToken) {
    const apiUrl = "https://api.cinemate.link/users/watch/list";
    
    try {
        const response = await axios.post(apiUrl, {
            movieId: movieId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` // Assuming you're using Bearer tokens for authentication
            }
        });

        // Check if the response indicates success
        if (response.status === 200) {
            console.log('Successfully added movie to watchlist');
            return response.data;
        } else {
            console.error('Failed to add movie to watchlist', response.data);
            throw new Error('Failed to add movie to watchlist');
        }
    } catch (error) {
        console.error('There was an error adding the movie to the watchlist:', error.message);
        throw error;
    }
}

export {addMovieToWatchlist};