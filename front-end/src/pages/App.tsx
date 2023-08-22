import { Route, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import Login from "./Login";
import ProtectedRoute from "../layouts/ProtectedRoute";
import Dashboard from "./Dashboard";
import AppLayout from "../layouts/AppLayout";

/**
 * Main component for web app, provides routing to
 * all the pages
 */
const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Homepage />} />

        <Route path="login" element={<Login />} />

        {/* Wrap these routes in a layout that navigates to the login page if 
        the user isn't logged in - i.e. protect these from unauthorized users */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch all route to handle unknown pages */}
        <Route
          path="*"
          element={<h1 className="error">404 Page not found</h1>}
        />
      </Route>
    </Routes>
  );
};

export default App;
