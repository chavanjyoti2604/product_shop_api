// src/pages/ApprovedShops.js
import { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovedShops.css"; // ✅ CSS import

export default function ApprovedShops() {
  const [approvedShops, setApprovedShops] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8070/shop/approved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setApprovedShops(res.data))
      .catch((err) => console.error("Error fetching approved shops:", err));
  }, []);

  return (
    <div className="approved-container">
      <h2>Approved Shops</h2>
      {approvedShops.length === 0 ? (
        <p>No approved shops.</p>
      ) : (
        <ul className="seller-list">
          {approvedShops.map((shop) => (
            <li key={shop.id} className="seller-item">
              <strong>{shop.name}</strong> ({shop.location})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
