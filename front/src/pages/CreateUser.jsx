import React, { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import "./CreateUser.css"; // Optional CSS

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: "ROLE_SELLER", // Default role
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8070/admin/create-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data);
    } catch (error) {
      setMessage("Error creating user: " + error.response?.data || error.message);
    }
  };

  return (
    <div className="create-user-form">
      <h2>Create New Admin or Seller</h2>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label>Select Role:</label>
        <select name="roles" value={formData.roles} onChange={handleChange}>
          <option value="ROLE_SELLER">Seller</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>

        <button type="submit">Create User</button>
      </form>

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
}
