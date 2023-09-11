import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // <-- Import axios
import MovieDisplay from '../../Common/MovieCard';
import Menu from '../../Common/Menu';


function FutureWatchlist() {
    
  const [movies, setMovies] = useState([]);
  const [apiError, setApiError] = useState(null);

  const FAKE_MOVIES = [
    {
        "id": "1168333",
        "title": "Home",
        "release_date": "6/09/2023",
        "genre": "Drama,Crime",
        "summary": "Yair, an ultra-Orthodox Yeshiva student, opens an electronics shop in Geula, a neighborhood that is the shopping epicenter for the entire ultra-Orthodox community in Jerusalem. The religious character of the neighborhood is enforced by the Geula Committee and Yair strictly adheres to their rules. His shop is introducing a world of advanced technology that overnight becomes a magnet for every ultra-Orthodox household, but the increasing intrusion of modernity is an affront to the committee, leading to an inevitable conflict that forces Yair into a desperate struggle for survival.",
        "language": "Hebrew",
        "budget": "1400000",
        "revenue": "0",
        "runtime": "111"
    },
    {
        "id": "129",
        "title": "Spirited Away",
        "release_date": "20/07/2001",
        "genre": "Animation,Family,Fantasy",
        "summary": "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
        "language": "Japanese",
        "budget": "19000000",
        "revenue": "274925095",
        "runtime": "125"
    }
  ];

  //useEffect(() => {
    //const fetchRecentlyWatchedMovies = async () => {
      //try {
        //const response = await axios.get('https://api.cinemate.link/users/watch/list?limit=2&page=1');
       // setMovies(response.data.movies); // adjust if the response structure is different
     // } catch (error) {
      //  setApiError(error.message);
     // }
   // };

    //fetchRecentlyWatchedMovies();
 // }, []);

  useEffect(() => {
    const fetchRecentlyWatchedMovies = () => {
      try {
        // Simulate an API call with a delay
        setTimeout(() => {
          setMovies(FAKE_MOVIES);
        }, 1000);  // 1-second delay
      } catch (error) {
        setApiError(error.message);
      }
    };

    fetchRecentlyWatchedMovies();
}, []);


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

  return (
    <div style={appStyle}>
      <Menu />
      <div style={mainContentStyle}>
        <h1>Your Watch List</h1>
        <div style={moviesContainerStyle}>
          {movies.length > 0 ? (
            <MovieDisplay movies={movies} />
          ) : (
            <div>
              <h2>You haven't watched any movies recently.</h2>
              <Link to="/search">Search for movies</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FutureWatchlist;
