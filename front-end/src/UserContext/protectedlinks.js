import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from './UserProvider';

const ProtectedRoute = ({children}) => {
    const {currentUser, accessToken } = useContext(UserContext);
    const location = useLocation(); 
    if (!currentUser && !accessToken) {
        // If the user is not authenticated, redirect to login page
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // If the user is authenticated, render the provided component
    return children;
};

export default ProtectedRoute;
