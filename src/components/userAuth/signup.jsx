import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://e-commerce-be-x33o.onrender.com"
    : "http://localhost:5000";

console.log("API URL:", API_URL);


export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const { name, mobileNo, email, password, confirmPassword } = formData;

    // ✅ Client-side validations
    if (!name || !mobileNo || !email || !password || !confirmPassword) {
      setError("⚠ Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("⚠ Passwords do not match");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobileNo)) {
      setError("⚠ Mobile number must be 10 digits");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("⚠ Invalid email address");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, formData);
      if (res.data.success) {
        setSuccess("🎉 " + res.data.message);
        setFormData({
          name: "",
          mobileNo: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
     <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "420px", background: "#fff" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Create Account</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaUser /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Mobile No */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaPhone /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Mobile Number"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaEnvelope /></span>
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
            <span className="input-group-text bg-primary text-white"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-muted">
          Already have an account? <a href="/login" className="text-primary fw-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}
