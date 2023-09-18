import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserProvider from './UserContext/UserProvider';
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

