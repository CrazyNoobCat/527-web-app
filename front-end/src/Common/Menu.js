import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import UserContext from '../UserContext/UserProvider';
import logo from "../Common/Cinematelogo.png"

function Menu() {
  const location = useLocation();
  

  const menuStyle = {
    width: '15%',
    backgroundColor: '#E2D0FD50', // Replace with your chosen color
   // padding: '1rem',
    textAlign: 'center',
  };

  const profilePicStyle = {
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    marginBottom: '1rem',
    marginTop: '3rem',
    background: 'gray', 
    margin: 'auto'
  };

  const linkStyle = {
    padding: '10px 0',  // Add padding around each link
    display: 'block',  // Make each link occupy its own line
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
      <h2>Welcome</h2>
      <nav>
        <Link to="/home" style={checkActive('/') ? activeLinkStyle : linkStyle}>Home</Link><br/>
        <Link to="/watchlist" style={checkActive('/watchlist') ? activeLinkStyle : linkStyle}>Future Watchlist</Link><br/>
        <Link to="/watchhistory" style={checkActive('/watchhistory') ? activeLinkStyle : linkStyle}>Previously Watched</Link><br/>
        <Link to="/search" style={checkActive('/search') ? activeLinkStyle : linkStyle}>Search</Link>
      </nav>
    </div>
  );
}

export default Menu;