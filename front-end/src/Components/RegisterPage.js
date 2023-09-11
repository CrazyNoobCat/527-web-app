import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterBox({ handleClose }) {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const payload = {
    username,
    email,
    password,
  };

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

    // Fetch logic to talk to UserDB

    try {
      const response = await axios.post('https://api.cinemate.link/users/register', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data.error) { 
        alert(data.error);
      } else {
        console.log('Registration successful:', data);
        navigate('/login');
        handleClose();
      }
    } catch (error) {
      console.error('There was a problem with the registration:', error.message);
    }
  };


  const onChangeUsername = (e) => {
    const username = e.target.value;
    setName(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
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
            onChange={onChangeUsername}
            placeholder="Enter your name"
          />
          <input
            required
            type="email"
            value={email}
            onChange={onChangeEmail}
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
            onChange={onChangePassword}
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

