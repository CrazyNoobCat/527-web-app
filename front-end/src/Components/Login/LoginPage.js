import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authentication.js";
import '/Users/niamhathy/movies-rater-pages/src/App.css';


const requestLogin = (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("12345"), 100);
  });
};

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      requestLogin(username, password)
        .then((token) => {
          setAccessToken(token);
          navigate("/"); // Navigate to home page
        })
        .catch((error) => {
          // Handle login failure
          console.log(error);
        });
    }
  };

  const buttonStyle = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1em'
  };



  return (
    <div className="login-box">
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





