import React, { useContext } from 'react';
import LandingPage from './Components/LandingPage/Landingpage.js';
import LoginPage from './Components/Login/LoginPage.js';
import RegisterBox from './Components/RegisterPage.js';
import SearchPage from './Components/SearchPage/SearchPage.js';
import UserProvider, {UserContext} from './UserContext/UserProvider.js';
import RecentlyWatchedPage from './Components/Watchlist/recentlyWatched.js';
import FutureWatchlist from './Components/Watchlist/futurewtachlist.js';
import MovieDetails from './Components/Moviepage/MovieDetails.js';
import HomePage from './Components/Homepage/homepage.js';
import UserProfile from './Components/Userprofile/userprofile.js';

import ProtectedRoute  from './UserContext/protectedlinks.js';
import { BrowserRouter as Router, Route, Routes, redirect, Navigate} from 'react-router-dom'


function App() {

  const {currentUser} = useContext(UserContext);
  

return (
  <UserProvider> {/* Wrap routes with UserProvider */}
    <Router>
      <div>
        <Routes>
          <Route exact path="/landing" element={<LandingPage />} />
          <Route exact path = '/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>          
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterBox />}/>
          <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>
          <Route path = '/search' element={<ProtectedRoute><SearchPage /></ProtectedRoute>}/>
          <Route path="*" element={currentUser ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/watchhistory" element={<ProtectedRoute><RecentlyWatchedPage/></ProtectedRoute>}/>
          <Route path="/watchlist" element={<ProtectedRoute><FutureWatchlist/></ProtectedRoute>}/>
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieDetails/></ProtectedRoute>} />
          {/* Add more Routes as needed */}
        </Routes>
      </div>
    </Router>
  </UserProvider>
);
}


export default App;
