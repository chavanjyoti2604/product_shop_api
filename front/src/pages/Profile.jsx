import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please login.");
      // optionally navigate to login page
      return;
    }
    axios
      .get("http://localhost:8070/auth/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserInfo({ name: res.data.name, email: res.data.email });
        setFormData({ name: res.data.name });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch user info");
      });
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .put(
        "http://localhost:8070/auth/profile",
        { name: formData.name },
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!userInfo) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-field">
          <label>Name:</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <p>{userInfo.name}</p>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <p>{userInfo.email}</p>
        </div>

        {editMode ? (
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        ) : (
          <button onClick={handleEdit} disabled={loading}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
