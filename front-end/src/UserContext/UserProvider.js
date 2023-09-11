import React, { useState, useCallback, createContext } from 'react';
import { loginFunction } from '../Components/Login/authentication';


function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const login = useCallback(async (username, password) => {
    const user = await loginFunction(username, password); // This should also return accessToken
    setCurrentUser(user);
    if(user && user.token) { 
        setAccessToken(user.token);
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
export const UserContext = createContext();
