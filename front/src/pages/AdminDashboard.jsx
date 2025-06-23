import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // Optional: Create this CSS file if needed

export default function AdminDashboard() {
  const navigate = useNavigate();

  const goToCreateUser = () => {
    navigate("/create-user");
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Super Admin</h2>
      <p>You can manage users and access privileged actions from here.</p>

      <button onClick={goToCreateUser} className="admin-button">
        Create New Admin or Seller
      </button>
    </div>
  );
}
