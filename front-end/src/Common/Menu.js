import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      <div style={profilePicStyle}></div>
      <h2>Welcome, username</h2>
      <nav>
        <Link to="/" style={checkActive('/') ? activeLinkStyle : linkStyle}>Home</Link><br/>
        <Link to="/userprofile" style={checkActive('/userprofile') ? activeLinkStyle : linkStyle}>User Profile</Link><br/>
        <Link to="/future-watchlist" style={checkActive('/future-watchlist') ? activeLinkStyle : linkStyle}>Future Watchlist</Link><br/>
        <Link to="/previously-watched" style={checkActive('/previously-watched') ? activeLinkStyle : linkStyle}>Previously Watched</Link><br/>
        <Link to="/search" style={checkActive('/search') ? activeLinkStyle : linkStyle}>Search</Link>
      </nav>
    </div>
  );
}

export default Menu;