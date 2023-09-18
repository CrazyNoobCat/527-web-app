import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchBar({ onSearch }) {
    console.log("SearchBar rendered");
    const query = useQuery();
    const initialSearchTerm = query.get("query") || query.get("genre");
    const initialSearchType = query.get("genre") ? 'genre' : 'title';
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true); 
    const navigate = useNavigate();



  // CSS //
    const searchBarStyle = {
      width: '100%',  // Full width
      height: '100%',
      padding: '10px 10px',  // Padding for larger text area
      fontSize: '20px',  // Bigger font
      backgroundColor: 'black',  // Black background
      color: 'white',  // White text
      boxSizing: 'border-box',
    };

    const container = { // for button to sit in with search box 
      display: 'flex',
      alignItems: 'center'
    }
    // End of css //
  
    //Main functioning of search bar//
    const {accessToken} = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [searchType, setSearchType] = useState(initialSearchType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const BASE_API_ENDPOINT = "https://api.cinemate.link/movies";

    const fetchMovies = () => {
        if (!accessToken) {
            setError("Authentication failed.");
            return;
        }
    
        setLoading(true); 
        setError(null);
    
        let params = {};
    
        if (searchType === 'title') {
            params.title = searchTerm;
        } else if (searchType === 'genre') {
            params.genre = searchTerm;
        }
    
        params.limit = 8;
        params.page = currentPage;
    
        let endpoint = BASE_API_ENDPOINT;
        if (searchType === 'genre') {
            endpoint += "?genre=";
        }
    
        Axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: params
        })
        .then(response => {
            console.log("API response:", response.data); // Debug log
            onSearch(searchTerm, searchType, response.data);
            setHasNextPage(response.data.movies.length === 8);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching movies:", err);
            setError("Error fetching movies.");
            setLoading(false);
        });
    };
    const handleNextPage = () => {
        console.log("Next button clicked!");
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    }
    
    const handlePrevPage = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : 1);
    }
    
    useEffect(() => {
        if (initialSearchTerm) {
            fetchMovies();  // this will use the state values, which we have set based on URL params
        }
    }, []);
    useEffect(() => {
        const pageFromURL = Number(query.get("page") || 1); // 
        setCurrentPage(pageFromURL);
    }, []);
    useEffect(() => {
        fetchMovies(); 
   }, [currentPage]); 

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchMovies();
        }
    };

    return (
        <div style={container}>
            <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                <option value="title">By Title</option>
                <option value="genre">By Genre</option>
            </select>

            <input 
                style={searchBarStyle}
                type="text"
                placeholder={`Search for movies by ${searchType}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={fetchMovies}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {currentPage > 1 && <button onClick={handlePrevPage}>Previous</button>}
            {hasNextPage && <button onClick={handleNextPage}>Next</button>} 
        </div>
    );
}
  
export default SearchBar;