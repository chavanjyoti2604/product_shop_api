// src/pages/AddShop.js
import { useState } from "react";
import axios from "axios";
import "./AddShop.css";

export default function AddShop() {
  const [shop, setShop] = useState({ shopName: "", location: "" }); // ✅ updated key
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setError("❌ No valid token found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8070/shop/add",
        shop,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Shop added successfully!");
      setShop({ shopName: "", location: "" });
    } catch (err) {
      console.error("Failed to add shop:", err);
      if (err.response?.status === 403) {
        setError("❌ Only APPROVED sellers can add shops.");
      } else if (err.response?.status === 401) {
        setError("❌ Unauthorized. Please login again.");
      } else {
        setError("❌ Failed to add shop. Please try again.");
      }
    }
  };

  return (
    <div className="add-shop-form">
      <h2>Add New Shop</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="shopName" // ✅ updated field
          placeholder="Shop Name"
          value={shop.shopName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={shop.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Shop</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
