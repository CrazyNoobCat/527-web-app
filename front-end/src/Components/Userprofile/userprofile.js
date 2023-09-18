import React, { useState, useEffect, useContext } from 'react';
import {UserContext} from '../../UserContext/UserProvider';
import axios from 'axios';
import Menu from '../../Common/Menu';

function UserProfile() {
    const [userReviews, setUserReviews] = useState({reviews: []});
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [userWatchHistory, setUserWatchHistory] = useState([]);
    const {currentUser} = useContext(UserContext);
    const {accessToken} = useContext(UserContext);
    const [userData, setUserData] = useState(null);

    const handleReviewRemove = async (movieId) => {
        console.log("Attempting to remove movie with ID:", movieId);
        try {
       
            await axios.delete(`https://api.cinemate.link/users/reviews?id=${movieId}` , {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.error("Error deleting the review:", error);
        }
        setUserReviews(prevReviews => {
            if (prevReviews && prevReviews.reviews) {
                return {
                    ...prevReviews,
                    reviews: prevReviews.reviews.filter(review => review.movie.id !== movieId)
                };
            }
            return prevReviews; // If prevReviews or prevReviews.reviews are undefined, return unaltered state.
        });
    };
// for user data
    useEffect(() => {
        
        async function fetchUserData() {
          try {
            const response = await axios.get('https://api.cinemate.link/users', {
              headers: {
                'Authorization': `Bearer ${accessToken}` // Assuming your user context has a token. Adjust accordingly.
              }
            });
            setUserData(response.data);
          } catch (error) {
            console.error('Failed to fetch user data:', error.message);
          }
        }
        fetchUserData();
      }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
          const reviews = await axios.get('https://api.cinemate.link/users/reviews', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        
          setUserReviews(reviews.data);

          const watchlist = await axios.get('https://api.cinemate.link/users/watch/list', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log(reviews)
          setUserWatchlist(watchlist.data);
    
          const watchHistory = await axios.get('https://api.cinemate.link/users/watch/history', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log(watchHistory)
  
          setUserWatchHistory(watchHistory.data);
        };
    
        fetchData();
      }, [accessToken]);
      
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
    
    
      return (
        <div style={appStyle}>
            <Menu />
            <div style={mainContentStyle}>
              <div style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                <h2>User Details</h2>
                <p><strong>Username:</strong> {userData && userData.username}</p>
                <p><strong>Email:</strong> {userData && userData.email}</p>
              </div>
        
              <div style={{ marginTop: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px', position: 'relative' }}>
                <h2>Your Reviews</h2>
                <span style={{ position: 'absolute', right: '10px', top: '5px', fontWeight: 'normal' }}>
                  Total reviews: {userReviews && userReviews.reviews ? userReviews.reviews.length : 0}
                </span>
                <div style={{ overflowY: 'auto', maxHeight: '400px' }}> 
                {userReviews && userReviews.reviews && userReviews.reviews.slice(0, 4).map((review, index) => (
                    
                    <div key={index} style={{ position: 'relative', marginBottom: '15px' }}>
                       
                        <input 
                            type="checkbox" 
                            style={{ position: 'absolute', top: '5px', right: '5px' }} 
                            onChange={() => handleReviewRemove(review.movie.id)} 
                        />
                      <h4>{review.movie.title}</h4>
                      <p>{review.summary.substring(0, 100) + (review.summary.length > 100 ? '...' : '')}</p>
                      
                      <hr/>
                    </div>
                  ))}
                </div>
              </div>
        
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '48%', padding: '10px', backgroundColor: '#E2D0FD50', textAlign: 'center' }}>
                  <h3>Total Movies Watched:</h3>
                  <p>{userWatchHistory && userWatchHistory.movies? userWatchHistory.movies.length :0 }</p>
                </div>
                <div style={{ width: '48%', padding: '10px', backgroundColor: '#E2D0FD50', textAlign: 'center' }}>
                  <h3>Total Movies To Watch:</h3>
                  <p>{userWatchlist && userWatchlist.movies? userWatchlist.movies.length: 0}</p>
                </div>
              </div>
            </div>
        </div>
    );
 }


    export default UserProfile;