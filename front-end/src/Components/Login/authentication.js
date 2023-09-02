import { createContext, useContext, useState } from "react";

// Create and provide global context to let access token be used anywhere
const AppContext = createContext();

const initialState = {};


const AppState = ({ children }) => {
  const [state, setState] = useState(initialState);

  const setAccessToken = (token) => {
    setState((state) => ({
      ...state,
      accessToken: token,
    }));
  };

  return (
    <AppContext.Provider value={{ state, setAccessToken }}>
      {children}
    </AppContext.Provider>
  );
};

// Abstract useContext hook to simplify code in components
export const useAuth = () => {
  return useContext(AppContext);
};

export default AppState;
