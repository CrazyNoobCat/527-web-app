import "../styles/login.css";
import { FormEventHandler, useState } from "react";
import SubmitButton from "../Components/buttons/SubmitButton";
import { requestLogin } from "../utils/api/login";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../utils/store/AppState";

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAppState();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit: FormEventHandler = (e) => {
    if (username !== "" && password !== "") {
      requestLogin(username, password).then((token) => {
        setAccessToken(token);
        navigate("/dashboard");
      });
    }

    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <p>Dummy login form that will always succeed</p>

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

      <SubmitButton label="Login" />
    </form>
  );
};

export default Login;
