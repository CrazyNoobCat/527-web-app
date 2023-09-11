import React, { useState } from 'react';
import { Axios } from 'axios';
function AddMoviePopup({ onClose }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [pgRating, setPgRating] = useState('');
    const [hasWatched, setHasWatched] = useState(false);
    const [review, setReview] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

           // Construct the movie object from the state
        const movieData = {
            title,
            summary,
            pgRating
        };

        // User-specific review data
        const userReview = {
           // userId: currentUser.id, // Assuming you have some way of identifying the current user
           // review: watched ? review : null
        };


        // Make an API call to add the movie
        Axios.post('YOUR_API_ENDPOINT_FOR_ADDING_MOVIES', movieData)
        .then(response => {
            // If the movie was added successfully, you can now add the review
            // This assumes your backend returns the added movie's ID or some identifier
            const movieId = response.data.id;

            // Another API call to add the user review
            return Axios.post('YOUR_API_ENDPOINT_FOR_ADDING_REVIEWS', { movieId, ...userReview });
        })
        .then(response => {
            console.log('Review added successfully:', response.data);
            onClose(); // Close the popup after a successful submission
        })
        .catch(error => {
            console.error('Error:', error);
        });
};


    const buttonStyle = {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '1em',
      };

    return (
        <div className='register-box'>
            <h2>Add a New Movie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Summary (optional):</label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
                </div>
                <div>
                    <label>PG Rating:</label>
                    <input type="text" value={pgRating} onChange={(e) => setPgRating(e.target.value)} required />
                </div>
                <div>
                    <label>Have you watched it?</label>
                    <input type="checkbox" checked={hasWatched} onChange={() => setHasWatched(!hasWatched)} />
                </div>
                {hasWatched && (
                    <div>
                        <label>Review:</label>
                        <textarea value={review} onChange={(e) => setReview(e.target.value)} required />
                    </div>
                )}
                <button style={buttonStyle} type="submit">Add Movie</button>
            </form>
            <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
    );
}

export default AddMoviePopup;