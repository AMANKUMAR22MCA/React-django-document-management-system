import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./app.css"; // Ensure consistent styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/token/", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      navigate("/profile");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="form-toggle">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
