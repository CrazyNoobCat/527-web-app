import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { UserContext } from '../../UserContext/UserProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { genresOptions } from './sharedoptions';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function SearchBar({ onSearch }) {
    console.log("SearchBar rendered");
    const query = useQuery();
    const initialSearchTerm = query.get("query") || query.get("genre");
    const initialSearchType = query.get("genre") ? 'genre' : 'title';
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true); 
    const navigate = useNavigate();
    const [searchInitiated, setSearchInitiated] = useState(false);


  // CSS //
    const searchBarStyle = {
      width: '100%',  // Full width
      height: '100%',
      padding: '10px 10px',  // Padding for larger text area
      fontSize: '20px',  
      
      color: 'black',  
    
    };

    const searchBarButton = {
        width: '100%',  // Full width
        height: '100%',
        fontSize: '20px',  // Bigger font
        //backgroundColor: 'black',  // Black background
        color: 'black', 
        alignItems: 'center',
      };

      const searchTypeStyle = {
        height: '100%',
        width: '100%',
    }
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.isFocused ? 'white' : 'black',  // Change 'black' to any color you want
            backgroundColor: state.isFocused ? 'blue' : 'white',  // Optional: change the background color as well
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black',  // Change 'black' to any color you want
        })
    };

    /*
    const container = { // for button to sit in with search box 
      display: 'flex',
      alignItems: 'center'
    }
    */
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
        setSearchInitiated(true);
        setLoading(true); 
        setError(null);
    
        let params = {};
        let finalSearchTerm = searchTerm;
    
        if (searchType === 'title') {
            params.title = searchTerm;
        } else if (searchType === 'genre') {
            finalSearchTerm = capitalizeFirstLetter(searchTerm);
            params.genre = finalSearchTerm;
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
            // Sync the URL with the current page
            if (searchType === 'title') {
                navigate(`/search?query=${searchTerm}&page=${currentPage}`);
            } else if (searchType === 'genre') {
                navigate(`/search?genre=${searchTerm}&page=${currentPage}`);
            }
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
    const handleNewSearch = () => {
        setCurrentPage(1);
        fetchMovies();
    };
    
    
    useEffect(() => {
        if (initialSearchTerm && initialSearchTerm !== "null") {
            fetchMovies();  // this will use the state values, which we have set based on URL params
        }
    }, [currentPage]);

    useEffect(() => {
        const pageFromURL = Number(query.get("page") || 1); // 
        setCurrentPage(pageFromURL);
    }, []);
    useEffect(() => {
        if (initialSearchTerm && initialSearchTerm !== "null") {
            fetchMovies();  // this will use the state values, which we have set based on URL params
        }
    }, []);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchMovies();
        }
    };

      return (
        <div className='row searchBarBG'>
            <div className='col-2'>
                <select style = {searchTypeStyle} value={searchType} onChange={e => setSearchType(e.target.value)}>
                    <option value="title">By Title</option>
                    <option value="genre">By Genre</option>
                </select>
            </div>
            <div className='col-8'>
            { searchType === "title" ? (
                <input 
                    style={searchBarStyle}
                    type="text"
                    placeholder={`Search for movies by ${searchType}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            ) : (
                <Select
                    style={searchBarStyle}
                    value={genresOptions.find(opt => opt.value === searchTerm)}
                    onChange={e => setSearchTerm(e.value)}
                    options={genresOptions}
                    placeholder={`Select a genre...`}
                    styles={customStyles}
                />
            )}
        </div>
            <div className='col-2'>
                <button style={searchBarButton} className = 'col-12' onClick={handleNewSearch}>Search</button>
            </div>
            <div><p></p></div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className='row' style={searchTypeStyle}>
                <div className='col-6'>
                    {searchInitiated && currentPage > 1 && <button className='col-12' onClick={handlePrevPage}>Previous</button>}
                </div>
                <div className='col-6'>
                    {searchInitiated && hasNextPage && <button className='col-12' onClick={handleNextPage}>Next</button>}

                </div>
            </div>
        </div>
    );
}
  
export default SearchBar;