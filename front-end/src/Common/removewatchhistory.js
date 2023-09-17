import axios from "axios";

async function deleteMovieFromWatchHistory(movieId, accessToken) {
  try {
    const response = await axios.delete(`https://api.cinemate.link/users/watch/history/${movieId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export default deleteMovieFromWatchHistory;
