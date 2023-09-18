import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';

function AddMoviePopup({ onClose }) {
    const [title, setTitle] = useState('');
    const [genreNames, setGenreNames] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState('');
    const [summary, setSummary] = useState('');
    const [runTime, setRunTime] = useState('');
    const {accessToken} = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const movieData = {
            title,
            genre_names: genreNames,
            original_language: originalLanguage,
            summary,
            release_date: "Unknown",
            budget: "1",
            revenue: "1",
            runtime: runTime
        };
        console.log("Sending Payload:", movieData);
    
        try {
            const response = await Axios.post('https://api.cinemate.link/movies', movieData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            console.log('Movie added successfully:', response.data);
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
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
                    <label>Genres (e.g., Horror,Comedy):</label>
                    <input type="text" value={genreNames} onChange={(e) => setGenreNames(e.target.value)} required />
                </div>
                <div>
                    <label>Original Language:</label>
                    <input type="text" value={originalLanguage} onChange={(e) => setOriginalLanguage(e.target.value)} required />
                </div>
                <div>
                    <label>Summary:</label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
                </div>
                <div>
                    <label>Runtime (in minutes):</label>
                    <input type="text" value={runTime} onChange={(e) => setRunTime(e.target.value)} required />
                </div>
                <button style={buttonStyle} type="submit">Add Movie</button>
            </form>
            <button style={buttonStyle} onClick={onClose}>Close</button>
        </div>
    );
}

export default AddMoviePopup;