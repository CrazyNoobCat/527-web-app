
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Login from '../Login/LoginPage.js';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  const landingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    //textAlign: 'center'
  };
  
  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1em',
  };

  return (
    <div style={landingStyle}>
      <h1>Movies Rater</h1>

      <button style={buttonStyle} onClick={() => setShowLogin(true)}>Login</button>
      <Link to="/register"><button style={buttonStyle}>Register</button></Link>

      {showLogin && (
        <div className="login-popup">
          <button onClick={() => setShowLogin(false)}>Close</button>
          <Login />
        </div>
      )}

      <div>
        <p>Authors: Courtney, Charles, Hannah and Niamh</p>
      </div>
    </div>
  );
}

export default LandingPage;





