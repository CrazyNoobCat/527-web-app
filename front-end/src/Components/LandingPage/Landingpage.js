
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Login from '../Login/LoginPage.js';
import RegisterBox from '../RegisterPage.js';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
    <div className = 'backingColors' style={landingStyle}>
      <h1>Movies Rater</h1>

      <div classname="buttonBoxOuter">
        <div className="row">
          <div className='col-1'></div>
          <div className='col-5'>
            <button className = 'col-12' style={buttonStyle} onClick={() => setShowLogin(true)}>Login</button>
          </div>
          <div className='col-5'>
            <button className = 'col-12' style={buttonStyle} onClick={() => setShowRegister(true)}>Register</button>
          </div>
          <div className='col-1'></div>
        </div>
      </div>

      {showLogin && (
        <div className="login-popup">
          <Login handleClose={() => setShowLogin(false)} />
        </div>
      )}

      {showRegister && (
        <div className="register-popup">
          <RegisterBox handleClose={() => setShowRegister(false)} />
        </div>
      )}

      <div>
        <p>Authors: Courtney, Charles, Hannah and Niamh</p>
      </div>
    </div>
  );
};

export default LandingPage;




