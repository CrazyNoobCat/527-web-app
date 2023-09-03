import React, { useState } from 'react';

function RegisterBox({ handleClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      alert('Emails do not match');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log({
      name,
      email,
      password,
    });
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
            value={name}
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
