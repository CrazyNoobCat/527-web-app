import React, { useContext } from 'react';
import Menu from './Common/Menu.js';
import MainSection from './Components/Homepage/Mainsections.js';
import SearchAndCategories from './Components/Homepage/Search.js';
import LandingPage from './Components/LandingPage/Landingpage.js';
import LoginPage from './Components/Login/LoginPage.js';
import RegisterBox from './Components/RegisterPage.js';
import SearchPage from './Components/SearchPage/SearchPage.js';
import UserProvider, {UserContext} from './UserContext/UserProvider.js';
import RecentlyWatchedPage from './Components/Watchlist/recentlyWatched.js';
import FutureWatchlist from './Components/Watchlist/futurewtachlist.js';

import ProtectedRoute  from './UserContext/protectedlinks.js';
import { BrowserRouter as Router, Route, Routes, redirect} from 'react-router-dom'


function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  };

  const {currentUser} = useContext(UserContext);
  
function HomePage() { {/* Wrap routes with AppState */}

  return (
    <div style={{...appStyle, justifyContent: 'space-between', width: '100%'}}>
      <Menu />
      <MainSection />
      <SearchAndCategories />
    </div>
  );
}
return (
  <UserProvider> {/* Wrap routes with UserProvider */}
    <Router>
      <div>
        <Routes>
          <Route exact path="/landing" element={<LandingPage />} />
          <Route exact path = '/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>          
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterBox />}/>
          <Route path = '/search' element={<ProtectedRoute><SearchPage /></ProtectedRoute>}/>
          <Route path="*" element={currentUser ? <redirect to="/home" /> : <LandingPage />} />
          <Route path="/watchhistory" element={<ProtectedRoute><RecentlyWatchedPage/></ProtectedRoute>}/>
          <Route path="/watchlist" element={<ProtectedRoute><FutureWatchlist/></ProtectedRoute>}/>
          {/* Add more Routes as needed */}
        </Routes>
      </div>
    </Router>
  </UserProvider>
);
}


export default App;
