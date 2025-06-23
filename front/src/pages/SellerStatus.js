import { useEffect, useState } from "react";
import axios from "axios";
import "./SellerStatus.css";

export default function SellerStatus() {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "" }); // removed password here
  const [status, setStatus] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // Fetch user profile info including status
    axios
      .get("http://localhost:8070/auth/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Only keep name, email, and status from the response
        const { name, email, status } = res.data;
        setUserInfo({ name, email });
        setFormData({ name }); // removed password here
        setStatus(status?.toLowerCase());
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch user info");
      });
  }, [token]);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    axios
      .put(
        "http://localhost:8070/auth/profile",
        { name: formData.name }, // only send name
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Profile updated successfully!");
        setUserInfo({ ...userInfo, name: formData.name });
        setEditMode(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update profile");
      });
  };

  if (!userInfo || !status) return <p>Loading...</p>;

  return (
    <div className="seller-status-container">
      <div className="profile-card">
        <h2>My Profile (Seller)</h2>

        <div className="profile-field">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            <p>{userInfo.name}</p>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <p>{userInfo.email}</p>
        </div>

        {/* Password field removed */}

        <div className="profile-field">
          <label>Approval Status:</label>
          <p
            className={`status-box ${
              status === "approved"
                ? "status-approved"
                : status === "pending"
                ? "status-pending"
                : ""
            }`}
          >
            {status === "approved"
              ? "Approved"
              : status === "pending"
              ? "Pending Approval"
              : "Unknown"}
          </p>
        </div>

        {editMode ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={handleEdit}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}
