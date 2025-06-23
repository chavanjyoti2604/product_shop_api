import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ApprovedAdmins.css";

export default function ApprovedAdmins() {
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem("token");

  const fetchApprovedAdmins = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8070/auth/users/approved-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovedAdmins(res.data);
    } catch (err) {
      alert("Failed to fetch approved admins");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await axios.get("http://localhost:8070/auth/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const role = res.data.roles;
        if (role.includes("ROLE_SUPER_ADMIN") || role.includes("ROLE_ADMIN")) {
          setAuthorized(true);
          fetchApprovedAdmins();
        } else {
          alert("Access denied.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to verify user role or session expired.");
      }
    };
    checkAccess();
  }, [fetchApprovedAdmins, token]);

  if (!authorized) return <p>Checking permissions...</p>;

  return (
    <div className="approved-admins-container" style={{ padding: "1rem" }}>
      <h2>Approved Admins</h2>
      <DataTable
        value={approvedAdmins}
        paginator
        rows={5}
        loading={loading}
        emptyMessage="No approved admins found."
        stripedRows
        hover
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
