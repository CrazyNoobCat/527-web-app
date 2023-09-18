
import axios from "axios";

async function addToWatchHistory(movieId, accessToken) {

    // Check if movieId exists and is valid.
    if (!movieId) {
        console.error("Invalid movieId:", movieId);
        return;
    }

    const payload = { id: movieId }; // Changed the field name to 'id' as an example
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };


    try {
        const response = await axios.post(
            `https://api.cinemate.link/users/watch/history`, 
            payload,
            { headers }
        );

        if (response.data && response.data.success) {
            console.log("Movie added to watch list successfully");
        }
    } catch (error) {
        console.error("Error adding movie to watch list:", error);
    }
}

export default addToWatchHistory;