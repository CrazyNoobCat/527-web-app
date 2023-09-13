import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext/UserProvider.js";

import '../../App.css';

const Login = ({ handleClose }) => { // Added handleClose as a prop
  const navigate = useNavigate();
  const {login} = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        await login(username, password);
        navigate("/home");
      } catch (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data.error || error.message);
        } else {
          console.error("Login failed:", error.message);
        }
      }
    } else {
      console.error("Username or password cannot be empty.");
    }
  };
  

  return (
    <div className="login-box">
      <button className="close-button" onClick={handleClose}>X</button> {/* Added close button */}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="inputs">
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button className="button-style" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

