import React, { useState } from 'react';
import SearchBar from './SearchBar';
import MovieDisplay1 from './MovieDisplay';
import Menu from '../../Common/Menu';
import AddMoviePopup from '../Addmovie/AddMoviePopup';
import { useNavigate } from "react-router-dom";

function SearchPage() {
    const [movies, setMovies] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isAddMoviePopupVisible, setAddMoviePopupVisible] = useState(false);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true); 

    const handleSearch = (term, type, searchedMovies, error = null) => {
        console.log('searchTerm:', term);
        setMovies(searchedMovies.movies || []);
        setHasSearched(true);
        setApiError(error);

        if (type === 'title') {
            navigate(`/search?query=${term}`);
        } else if (type === 'genre') {
            navigate(`/search?genre=${term}`);
        }
    }

    const appStyle = {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    };
    const moviesContainerStyle = {
        flex: 1, 
        padding: '0.5rem',
        //backgroundColor: '#E2D0FD08',
      };
  
    const mainContentStyle = {
      width: '85%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '1rem'
    };
  
    const searchBarContainerStyle = {
      backgroundColor: 'black',
      color: 'white',
    };

    return (
      <div style={appStyle}>
          <Menu />
          <div style={mainContentStyle}>
              <div style={searchBarContainerStyle}>
                  <SearchBar onSearch={handleSearch} />
              </div>
              <div style={moviesContainerStyle}>
                 <MovieDisplay1 movies={movies} hasSearched={hasSearched} onAddMovieClick={() => setAddMoviePopupVisible(true)} />
                  {isAddMoviePopupVisible && <AddMoviePopup onClose={() => setAddMoviePopupVisible(false)} />}
              </div>
          </div>
      </div>
  );
}


export default SearchPage;
