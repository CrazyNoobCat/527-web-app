import React, {useState} from 'react';
import SearchBar from './SearchBar';
import MovieDisplay from './MovieDisplay';
import Menu from '../../Common/Menu';

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchedMovies) => {
    setMovies(searchedMovies);
    setHasSearched(true);  // set hasSearched to true when a search happens
  }

    const appStyle = {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    };
    const moviesContainerStyle = {
        flex: 1, 
        padding: '0.5rem',
        backgroundColor: '#E2D0FD08',
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
                  <MovieDisplay movies={movies} hasSearched={hasSearched} />
              </div>
          </div>
      </div>
  );
}


export default SearchPage;