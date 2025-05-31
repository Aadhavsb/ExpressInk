import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", user.username || user.email);

      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };
  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <p className="login-subtitle">Sign in to your ExpressInk account</p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-control">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="login-button">
          Sign In
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Create one here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
