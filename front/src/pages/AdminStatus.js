import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";
import "./AdminStatus.css";

export default function AdminStatus() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8070/auth/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAdmin(res.data);
          setError(null);
        })
        .catch((err) => {
          setError("Failed to fetch admin info.");
          console.error(err);
        });
    }
  }, [token]);

  if (error) return <div className="admin-status error">{error}</div>;
  if (!admin) return <div className="admin-status loading">Loading...</div>;

  return (
    <div className="admin-status card">
      <h2 className="admin-status__title">Admin Profile & Status</h2>
      <div className="admin-status__info">
        <div>
          <strong>Name:</strong> <span>{admin.name}</span>
        </div>
        <div>
          <strong>Email:</strong> <span>{admin.email}</span>
        </div>
        <div className="status-row">
          <strong>Status:</strong>{" "}
          <span className={`status-badge status-${admin.status.toLowerCase()}`}>
            {admin.status}
          </span>
        </div>
      </div>

      {admin.status !== "APPROVED" && (
        <p className="admin-status__warning">
          ⚠️ Your admin account is currently <strong>{admin.status}</strong>. Some features may be restricted until approval.
        </p>
      )}
    </div>
  );
}
