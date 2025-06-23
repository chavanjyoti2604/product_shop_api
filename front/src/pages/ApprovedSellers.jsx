import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ApprovedSellers.css";

export default function ApprovedSellers() {
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem("token");

  const fetchApprovedSellers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8070/auth/users/approved-sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedSellers(res.data);
    } catch (err) {
      alert("Failed to fetch approved sellers");
      console.error("Error fetching approved sellers:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      try {
        const res = await axios.get("http://localhost:8070/auth/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roles = res.data.roles || [];

        if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPER_ADMIN")) {
          setAuthorized(true);
          fetchApprovedSellers();
        } else {
          setAuthorized(false);
          alert("Access denied. You are not authorized to view this page.");
        }
      } catch (err) {
        console.error("Failed to verify user role:", err);
        alert("Error verifying user. Try again.");
      }
    };

    checkAccessAndFetch();
  }, [fetchApprovedSellers, token]);

  if (!authorized) return <p>Checking permissions...</p>;

  return (
    <div className="approved-container" style={{ padding: "1rem" }}>
      <h2>Approved Sellers</h2>
      <DataTable
        value={approvedSellers}
        paginator
        rows={5}
        loading={loading}
        emptyMessage="No approved sellers found."
        stripedRows
        responsiveLayout="scroll"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" />
        <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" />
        <Column field="roles" header="Role" />
      </DataTable>
    </div>
  );
}
