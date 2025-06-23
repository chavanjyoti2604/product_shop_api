import { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8070/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("roles", response.data.role); // Save role string like "ROLE_USER"

      alert("Login successful!");

      if (response.data.role === "ROLE_USER") {
        navigate("/profile");
      } else if (response.data.role === "ROLE_SELLER") {
        navigate("/seller-profile");
      } else if (response.data.role === "ROLE_ADMIN") {
        navigate("/pending");
      } else if (response.data.role === "ROLE_SUPER_ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/profile"); // Fallback
      }

    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />
        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
        />
        <button type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#007bff", cursor: "pointer" }}>
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
