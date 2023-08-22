import { createContext, useContext, useState } from "react";

type AppStateStore = {
  state: AppStateProperties;
  setAccessToken: (value: string) => void;
};

type AppStateProperties = {
  accessToken?: string;
};

// Create and provide global context to let access token be used anywhere
const AppContext = createContext<AppStateStore>({} as AppStateStore);

const initialState: AppStateProperties = {};

const AppState = ({ children }: { children: any }) => {
  const [state, setState] = useState(initialState);

  const setAccessToken = (token?: string) => {
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
export const useAppState = () => useContext(AppContext);

export default AppState;
