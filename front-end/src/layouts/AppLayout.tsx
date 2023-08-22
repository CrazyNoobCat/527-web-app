import { Link, Outlet, useNavigate } from "react-router-dom";
import PrimaryButton from "../components/buttons/PrimaryButton";

/**
 * Provides a common layout to any nested routes
 */
const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <PrimaryButton label="Login" onClick={() => navigate("/login")} />
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
