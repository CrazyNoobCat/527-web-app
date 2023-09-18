import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext/UserProvider.js";

import '../../App.css';

const Login = ({ handleClose }) => { // Added handleClose as a prop
  const navigate = useNavigate();
  const {login} = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
  
    if (username !== "" && password !== "") {
        setIsLoading(true); // Set loading to true when starting login
        try {
            await login(username, password);
            navigate("/home");
            setIsLoading(false); // Set loading to false after successful login
        } catch (error) {
            setIsLoading(false); // Set loading to false after failed login
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
      <button className="close-button" onClick={handleClose}>X</button>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div><p></p></div>
        <div className="inputs">
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>
        <button className="button-style" type="submit">Login</button>
        {isLoading && <p>Loading...</p>}
        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Login;
