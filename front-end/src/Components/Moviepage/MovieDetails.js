import Menu from '../../Common/Menu';
import { useParams } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../UserContext/UserProvider';
import addToWatchList from '../../Common/addtowatchlist';
import addToWatchHistory from '../../Common/addHistory';

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
    try {
      const response = await axios.get('https://api.cinemate.link/movies', requestConfig);
 
        const data = response.data;

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
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const watchListCheckboxRef = useRef(null);
    const watchedCheckboxRef = useRef(null);

    
    useEffect(() => {
        async function fetchUserReviews() {
            try {
                const response = await axios.get(`https://api.cinemate.link/movies/reviews?id=${String(movieId)}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("Response data:", response.data);
                
                if (response.data && Array.isArray(response.data.reviews)) {
                    setUserReviews(response.data.reviews);
                    
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

 
    const handleWatchListChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            addToWatchList(movieId, accessToken);
            setTimeout(() => {
                alert("Movie added to Watch List");
            }, 50); // 50 milliseconds delay
        }
        watchListCheckboxRef.current.checked = false;
    }
    const handleWatchedChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            addToWatchHistory(movieId, accessToken);
            setTimeout(() => {
                alert("Movie marked as Watched");
            }, 50); // 50 milliseconds delay
        }
        watchedCheckboxRef.current.checked = false;   
    };
    

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting review for movieId:", movieId);
        
        try {
            await axios.post('https://api.cinemate.link/users/reviews', 
                { 
                    id: movieId, 
                    summary: reviewText,
                    rating: reviewRating
                }, 
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
    
            // After successful submission, clear the review text and rating
            setReviewText('');
            setReviewRating(0);
    
            // Fetch the username for the current user
            const userResponse = await axios.get('https://api.cinemate.link/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            const currentUsername = userResponse.data.username;  
    
            // Update the local state with the new review
            const newReview = {
                summary: reviewText,
                rating: reviewRating,
                username: currentUsername,
                
            };
            
    
            setUserReviews(prevReviews => [...prevReviews, newReview]);
        } catch (error) {
            console.error("Error submitting the review:", error);
        }
    };

    // STYLING ////

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
      
      const checkBoxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
    };
    
    const checkBoxStyle = {
        display: 'flex',
        alignItems: 'center',
        marginRight: '2rem' 
    };
      
      const checkBoxLabelStyle = {
        marginLeft: '0.5rem'
      };
      
      const movieInfoStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem'
      };
      const movieinfo = {
        display: 'flex',
        flexWrap: 'wrap'
      }
      const movieInfoItemStyle = {
        width: '33%',
        fontWeight: 'bold'
    };
    
    const movieInfoValueStyle = {
        fontWeight: 'normal'
    };
    

      const cardStyle = {
        padding: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        backgroundColor: '#E2D0FD08',
        backgroundColor: '#ff',
    };
    
    const smallerCardStyle = {
        ...cardStyle,
        padding: '0.5rem'
    };
  // END OF STYLYING //////////

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
                    <div style={movieinfo}>
                        <p style={movieInfoItemStyle}>Release Date: <span style={movieInfoValueStyle}>{movieDetails.release_date}</span></p>
                        <p style={movieInfoItemStyle}>Genres: <span style={movieInfoValueStyle}>{movieDetails.genre}</span></p>
                        <p style={movieInfoItemStyle}>Budget: <span style={movieInfoValueStyle}>{movieDetails.budget}</span></p>
                        <p style={movieInfoItemStyle}>Runtime: <span style={movieInfoValueStyle}>{movieDetails.runtime} mins</span></p>
                        <p style={movieInfoItemStyle}>Language: <span style={movieInfoValueStyle}>{movieDetails.language}</span></p>
                        <p style={movieInfoItemStyle}>Revenue: <span style={movieInfoValueStyle}>{movieDetails.revenue}</span></p>
                    </div>
                </div>
    
                <div className='row'>
                    <div className='col-4'></div>
                    <div className='col-4' style={checkBoxContainerStyle}>
                        <div className='col-6' style={checkBoxStyle}>
                            <input type="checkbox" id="watchList" name="watchList" onChange={handleWatchListChange} />
                            <label style={checkBoxLabelStyle} htmlFor="watchList">Add to Watch List</label>
                        </div>
                        <div className='col-6' style={checkBoxStyle}>
                            <input type="checkbox" id="watched" name="watched" onChange={handleWatchedChange} />
                            <label style={checkBoxLabelStyle} htmlFor="watched">Mark as Watched</label>
                        </div>
                    </div>
                    <div className='col-4'></div>
                </div>
    
                {/* Add Review Form */}
                <div style={cardStyle}>
                    <h2>Leave a Review</h2>
                    <form onSubmit={handleReviewSubmit}>
                        <textarea 
                            value={reviewText} 
                            onChange={e => setReviewText(e.target.value)} 
                            placeholder="Write your review here..."
                            style={{ width: '100%', minHeight: '100px', padding: '10px' }}
                        />
                        <div><p></p></div>
                        <div className='row p-auto'>
                            <label className='col-1'>Rating:</label>
                            <select 
                                className='col-1'
                                value={reviewRating} 
                                onChange={e => setReviewRating(parseInt(e.target.value, 10))}  // Parsing as integer
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <div className='col-8'></div>
                            <button className='col-2' type="submit">Submit Review</button>
                        </div>
                    </form>
                </div>
    
                {/* Reviews Card */}
                <div style={cardStyle}>
                    <h2>User Reviews</h2>
                    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        {userReviews.length > 0 ? (
                            userReviews.map(review => {
                                console.log('Review Date:', review.date);
                                let dateParts = review.date?.split("/") ?? [];
                                let formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

                                return (
                                    <div key={review.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p><strong>{review.username}</strong> on {formattedDate.toLocaleDateString()}</p>
                                                <p>{review.summary ? (review.summary.length > 100 ? review.summary.substring(0, 100) + "..." : review.summary) : ''}</p>
                                            </div>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginLeft: '1rem' }}>{review.rating}</span>
                                        </div>
                                        <hr />
                                    </div>
                                );
                            })
                        ) : (
                            <p>No users have left a review.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}  
export default MovieDetails;