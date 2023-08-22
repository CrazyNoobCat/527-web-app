import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import "./styles/index.css";
import AppState from "./utils/store/AppState";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Entry point of webapp - provides global context & routing
root.render(
  <React.StrictMode>
    <AppState>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppState>
  </React.StrictMode>
);
