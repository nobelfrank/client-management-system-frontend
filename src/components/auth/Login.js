import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../auth/auth.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const backgroundImage = require('../../assets/img/Login.jpeg');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      setSuccess("Login successful! Redirecting to dashboard...");
      localStorage.setItem("user", JSON.stringify(response.data));
      // Add a small delay to show the success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-signup-global">
      <div className="login-signup-wrapper">
        <div
          className="login-signup-image"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        <div className="login-signup-form-wrapper">
          <a href="/" className="login-signup-home-link">Home</a>
          <form className="login-signup-form" onSubmit={handleLogin}>
            <h2 className="login-signup-title">Welcome Back!</h2>
            <p className="login-signup-subtitle">Login to access your account</p>
            {error && <p className="login-signup-error">{error}</p>}
            {success && <p className="login-signup-success">{success}</p>}
            <input
              className="login-signup-input"
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
            <input
              className="login-signup-input"
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <button className="login-signup-button" type="submit">Login</button>
            <p className="login-signup-mt-3">
              Don't have an account? <a href="/signup" className="login-signup-alt-link">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;