import React from 'react';
import Menu from './Common/Menu.js';
import MainSection from './Components/Homepage/Mainsections.js';
import SearchAndCategories from './Components/Homepage/Search.js';
import LandingPage from './Components/LandingPage/Landingpage.js';
import LoginPage from './Components/Login/LoginPage.js';
import AppState from "./Components/Login/authentication.js";
import RegisterBox from './Components/RegisterPage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  };
  
function HomePage() { {/* This is just needed because to I created the home page in 3 different sections so this joins them into one on the HomePage  */}
  return (
    <div style={{...appStyle, justifyContent: 'space-between', width: '100%'}}>
      <Menu />
      <MainSection />
      <SearchAndCategories />
    </div>
  );
}
return (
  <AppState> {/* Wrap routes with AppState */}
    <Router>
      <div>
        <Routes>
          <Route exact path="/landing" element={<LandingPage />} />
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterBox />}/>
          {/* Add more Routes as needed */}
        </Routes>
      </div>
    </Router>
  </AppState>
);
}


export default App;
