import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';
import Select from 'react-select';

function capitalizeWords(input) {
    return input.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function AddMoviePopup({ onClose }) {
    const [title, setTitle] = useState('');
    const [genreNames, setGenreNames] = useState([]);
    const [originalLanguage, setOriginalLanguage] = useState('');
    const [summary, setSummary] = useState('');
    const [runTime, setRunTime] = useState('');
    const {accessToken} = useContext(UserContext);
    const titleCapitalized = capitalizeWords(title);

    const genresOptions = [
        { value: 'Action', label: 'Action' },
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Animation', label: 'Animation' },
        { value: 'Crime', label: 'Crime' },
        { value: 'Comedy', label: 'Comedy' },
        { value: 'Drama', label: 'Drama' },
        { value: 'Documentary', label: 'Documentary' },
        { value: 'Family', label: 'Family' },
        { value: 'Fantasy', label: 'Fantasy' },
        { value: 'History', label: 'History' },
        { value: 'Horror', label: 'Horror' },
        { value: 'Romance', label: 'Romance' },
        { value: 'Science Fiction', label: 'Science Fiction' },
        { value: 'Thriller', label: 'Thriller' },
        { value: 'TV Movie', label: 'TV Movie' },
        { value: 'War', label: 'War' },
        { value: 'Western', label: 'Western' },
    ];

   
    const originalLanguageCapitalized = capitalizeWords(originalLanguage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedGenres = genreNames.map(g => g.value).join(',');

        const movieData = {
            title: titleCapitalized,
            genre_names: selectedGenres,
            original_language: originalLanguageCapitalized,
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
    const handleGenreChange = (selected) => {
        setGenreNames(selected || []);
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
                    <label>Genres:</label>
                    <Select
                        isMulti
                        value={genreNames}
                        onChange={handleGenreChange}
                        options={genresOptions}
                    />
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