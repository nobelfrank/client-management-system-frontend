import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../auth/auth.css';

const Signup = () => {
  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const backgroundImage = require('../../assets/img/Signup.jpeg');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...user,
        role: user.role.toUpperCase()
      };

      await axios.post(
        "http://localhost:8080/api/auth/signup",
        payload,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      setSuccess("Account created successfully! Redirecting to login...");
      // Add a small delay to show the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data ||
        "Error creating account. Try again.";
      setError(errorMessage);
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
          <form className="login-signup-form" onSubmit={handleSignup}>
            <h2 className="login-signup-title">Create Your Account</h2>
            <p className="login-signup-subtitle">Sign up to get started!</p>
            {error && <p className="login-signup-error">{error}</p>}
            {success && <p className="login-signup-success">{success}</p>}
            <input
              className="login-signup-input"
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleInputChange}
              required
            />
            <input
              className="login-signup-input"
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              required
            />
            <select
              className="login-signup-select"
              name="role"
              value={user.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="client">Client</option>
            </select>
            <button className="login-signup-button" type="submit">Sign Up</button>
            <p className="login-signup-mt-3">
              Already have an account? <a href="/login" className="login-signup-alt-link">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;