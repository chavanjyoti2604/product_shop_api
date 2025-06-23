import { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: "ROLE_USER"  // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8070/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email already registered.");
      } else {
        alert("Registration failed.");
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <InputField
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          name="name"
        />
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
        <div className="select-group">
          <label>Role</label>
          <select name="roles" value={formData.roles} onChange={handleChange}>
            <option value="ROLE_USER">User</option>
            <option value="ROLE_SELLER">Seller</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
