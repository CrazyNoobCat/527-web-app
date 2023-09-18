import React, { useState, useCallback, createContext } from 'react';
import { loginFunction } from '../Components/Login/authentication';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = useCallback(async (username, password) => {
    const user = await loginFunction(username, password); 
    console.log(user)// This should also return accessToken
    setCurrentUser(user);
    if(user && user.authToken) { 
        setAccessToken(user.authToken);

    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAccessToken(null);
  }, []);


  return (
    <UserContext.Provider value={{ currentUser, accessToken, login, logout, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

