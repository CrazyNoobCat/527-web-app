import Menu from '../../Common/Menu';
import { useParams } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext/UserProvider';


// import { addMovieToWatchlist } from './addHistory';
async function fetchMovieDetailsById(id, accessToken) {
    // Prepare the request configuration
    const requestConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            id: id
        }
    };

    // Log the request configuration to the console
    console.log("Sending request with configuration:", requestConfig);

    try {
      const response = await axios.get('https://api.cinemate.link/movies', requestConfig);
      console.log("Received response:", response);  // Log the entire response
const data = response.data;
console.log("Extracted data:", data);  // Log just the data from the response
return data;

    } catch (error) {
      console.error("Error fetching movie details by ID:", error);
    }
}

function MovieDetails() {

    const { movieId } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken } = useContext(UserContext);
    const [userReviews, setUserReviews] = useState([]);
    
    useEffect(() => {
        async function fetchUserReviews() {
            try {
                const response = await axios.get(`https://api.cinemate.link/movies/reviews?id=${String(movieId)}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.data && Array.isArray(response.data.reviews)) {
                    setUserReviews(response.data.reviews);  // Corrected from userReviews to reviews based on the context
                    console.log("Movie details after setting state:", userReviews);
                }
            } catch (error) {
                console.error("Error fetching user reviews:", error);
            }
        }
    
        fetchUserReviews();
    }, [movieId, accessToken]);
   
    useEffect(() => {
        async function fetchData() {
            const movieDetails = await fetchMovieDetailsById(movieId, accessToken); // Pass accessToken to your function
            setMovieDetails(movieDetails.movies[0]);
            setIsLoading(false);
            console.log("Movie details after setting state:", movieDetails);
        }
  
        fetchData();
    }, [movieId, accessToken]); 

    const appStyle = {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    };

    const mainContentStyle = {
      width: '85%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '1rem'
    };

    const movieDetailsStyle = {
        padding: '1rem'
      };
      
      const movieTitleStyle = {
        fontSize: '2rem',
        marginBottom: '1rem'
      };
      
      const movieSummaryStyle = {
        marginBottom: '1.5rem'
      };
      
      const checkBoxStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      };
      
      const checkBoxLabelStyle = {
        marginLeft: '0.5rem'
      };
      
      const movieInfoStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem'
      };

      const cardStyle = {
        padding: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#E2D0FD08',
        backgroundColor: '#ff',
    };
    
    const smallerCardStyle = {
        ...cardStyle,
        padding: '0.5rem'
    };
  
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!movieDetails) {
        return <div>Error fetching movie details. Please try again later.</div>;
    }
    return (
        <div style={appStyle}>
            <Menu />
            <div style={mainContentStyle}>
                
                {/* Main Movie Info Card */}
                <div style={{ ...cardStyle, ...movieDetailsStyle }}>
                    <h1 style={movieTitleStyle}>{movieDetails.title}</h1>
                    <p style={movieSummaryStyle}>{movieDetails.summary}</p>
                </div>
    
                {/* Smaller Info Card */}
                <div style={smallerCardStyle}>
                    <div style={movieInfoStyle}>
                        <p>Release Date: {movieDetails.release_date}</p>
                        <p>Genres: {movieDetails.genre}</p>
                        <p>Budget: {movieDetails.budget}</p>
                        <p>Runtime: {movieDetails.runtime} mins</p>
                        <p>Language: {movieDetails.language}</p>
                        <p>Revenue: {movieDetails.revenue}</p>
                    </div>
                </div>
    
                {/* Reviews Card */}
                <div style={cardStyle}>
                    <h2>User Reviews</h2>
                    {userReviews.length ? (
                        userReviews.map(review => (
                            <div key={review.id}>
                                <p>{review.text}</p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No users have left a review.</p>
                    )}
                </div>
                
            </div>
        </div>
    );
}

export default MovieDetails;