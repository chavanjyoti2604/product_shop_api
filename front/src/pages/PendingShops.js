// src/pages/PendingShops.js
import { useEffect, useState } from "react";
import axios from "axios";
import "./PendingShops.css"; // ✅ Corrected CSS import

export default function PendingShops() {
  const [pendingShops, setPendingShops] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8070/shop/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPendingShops(res.data))
      .catch((err) => console.error("Error fetching pending shops:", err));
  }, []);

  const approveShop = async (shopId) => {
    try {
      await axios.put(`http://localhost:8070/shop/approve/${shopId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove approved shop from the list
      setPendingShops((prev) => prev.filter((shop) => shop.id !== shopId));
      alert("✅ Shop approved successfully!");
    } catch (err) {
      console.error("Error approving shop:", err);
      alert("❌ Failed to approve shop.");
    }
  };

  return (
    <div className="pending-shops-container">
      <h2>Pending Shops</h2>
      {pendingShops.length === 0 ? (
        <p>No pending shops.</p>
      ) : (
        <ul className="shop-list">
          {pendingShops.map((shop) => (
            <li className="shop-item" key={shop.id}>
              <h3>{shop.name}</h3>
              <p>Location: {shop.location}</p>
              <button className="approve-button" onClick={() => approveShop(shop.id)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
