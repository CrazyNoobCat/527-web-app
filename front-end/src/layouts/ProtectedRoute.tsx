import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "../utils/store/AppState";

const ProtectedRoute = () => {
  const { state } = useAppState();

  return (
    <>
      {state.accessToken !== undefined ? <Outlet /> : <Navigate to="login" />}
    </>
  );
};

export default ProtectedRoute;
