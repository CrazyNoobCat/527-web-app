import React, { useState, useEffect, useContext,  } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {UserContext} from '../UserContext/UserProvider';
import logo from "../Common/Cinematelogo.png"

function Menu() {
  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const {currentUser, accessToken, logout} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/landing'); 
  };


  useEffect(() => {
    
    async function fetchUserData() {
      try {
        const response = await axios.get('https://api.cinemate.link/users', {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        });
        setUserData(response.data);
        
      } catch (error) {
        console.error('Failed to fetch user data:', error.message);
      }
    }
    fetchUserData();
  }, [currentUser]);


  

  const menuStyle = {
    width: '15%',
    backgroundColor: '#E2D0FD50', // Replace with your chosen color
   // padding: '1rem',
    textAlign: 'center',
  };


  const linkStyle = {
    padding: '10px 0',  
    display: 'block',  
    color: '#FFF',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: '10px',
    //margin: '15px 0', // Increased margin for spacing
    width: '100%',  // Stretch to the width of the menu
    boxSizing: 'border-box'
  };

  const checkActive = (path) => {
    return location.pathname === path;
  };


  
  return (
    <div style={menuStyle}>
      <img src={logo} alt="Profile Logo" style={{ width: '80%', height: '18%' }} />
      <h2>Welcome <Link to ="/userProfile">{userData && userData.username}</Link></h2>
      <nav>
        <Link to="/home" style={checkActive('/') ? activeLinkStyle : linkStyle}>Home</Link><br/>
        <Link to="/watchlist" style={checkActive('/watchlist') ? activeLinkStyle : linkStyle}>Future Watchlist</Link><br/>
        <Link to="/watchhistory" style={checkActive('/watchhistory') ? activeLinkStyle : linkStyle}>Previously Watched</Link><br/>
        <Link to="/search" style={checkActive('/search') ? activeLinkStyle : linkStyle}>Search</Link>
        <span onClick={handleLogout} style={linkStyle}>Logout</span> 
      </nav>
    </div>
  );
}

export default Menu;