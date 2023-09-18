import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterBox({ handleClose }) {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setErrorMessage('Emails do not match'); //Just want to test 
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    console.log(userData);

    try {
     
      const jsonUserData = JSON.stringify(userData);
    
      // Make a POST request
      const response = await axios.post('https://api.cinemate.link/users/register', jsonUserData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      // Handle the response from the backend.
      if (response.status >= 200 && response.status < 300) {
        handleClose();
        navigate('/landing');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('There was an error registering the user:', error);
      console.error('Error data:', error.response.data);
      alert('Registration failed. Please try again.');
    }

  };

  return (
    <div className='register-box'>
      <button className="close-button" onClick={handleClose}>X</button>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <div className="inputs">
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="username"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            required
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="confirm email"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
          />
        </div>
        <button className="button-style" type="submit">
          Register
        </button>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default RegisterBox;
