import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Login from '../Login/LoginPage.js';
import RegisterBox from '../RegisterPage.js';
import logo from "../../Common/Cinematelogo.png"


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
      <img src={logo} alt="Profile Logo" style={{ width: '20%', height: '20%', objectFit: 'contain' }} />
      <h4 className='landingTitle'>Movie Rater</h4>
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

      <div className='bottomsnap landingTitle'>
        <p>Authors: Courtney, Charles, Hannah and Niamh</p>
      </div>
    </div>
  );
};

export default LandingPage;
