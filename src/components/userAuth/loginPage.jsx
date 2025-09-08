import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://cab-booking-be-jvxw.onrender.com"
    : "http://localhost:5000";

console.log("API URL:", API_URL);

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("⚠ Please fill all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("⚠ Invalid email address");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      if (res.data.success) {
        setSuccess("✅ " + res.data.message);

        // Save token and user details in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("name", res.data.name);

        // Redirect to dashboard after login
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)", // 🌈 different background
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "420px", background: "#fff" }}>
        <h3 className="text-center mb-4 text-danger fw-bold">Login</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-danger text-white"><FaEnvelope /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-danger text-white"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-bold shadow-sm">
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-muted">
          Don’t have an account?{" "}
          <a href="/signup" className="text-danger fw-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
