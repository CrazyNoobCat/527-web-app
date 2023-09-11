import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext/UserProvider.js";
import '../../App.css';

const Login = ({ handleClose }) => { // Added handleClose as a prop
  const navigate = useNavigate();
  const {Login} = useContext(UserContext);
  const { setAccessToken } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        await Login(username, password);
        navigate("/");
      } catch (error) {
          // Handle login failure
          console.log(error);
        };
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

