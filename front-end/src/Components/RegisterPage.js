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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      alert('Emails do not match');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const userData = {
      username,
      email,
      password,
    };

    console.log(userData);

    try {
      // Serialize userData to a JSON string
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
        alert('Registration successful!');
        navigate('/login');
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
            placeholder="Enter your name"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <input
            required
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Confirm your email"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        <button className="button-style" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterBox;
