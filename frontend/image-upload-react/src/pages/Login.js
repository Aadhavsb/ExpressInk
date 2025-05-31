import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");

        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <p className="login-subtitle">Sign in to your ExpressInk account</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-control">
          <label htmlFor="login">Email or Username</label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="email@example.com or username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Create one here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
