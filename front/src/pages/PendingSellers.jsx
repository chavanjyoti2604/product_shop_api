import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./PendingSellers.css";

export default function PendingSellers() {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPendingSellers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8070/auth/users/pending-sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingSellers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending sellers:", err);
      alert("Failed to fetch pending sellers.");
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

        console.log("Userinfo roles:", res.data.roles);

        const rawRoles = res.data.roles;

        let roles = [];

        if (Array.isArray(rawRoles)) {
          // Could be ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]
          roles = rawRoles;
        } else if (typeof rawRoles === "object" && rawRoles !== null && rawRoles.authority) {
          // Could be { authority: "ROLE_ADMIN" }
          roles = [rawRoles.authority];
        } else if (typeof rawRoles === "string") {
          roles = [rawRoles];
        }

        const normalizedRoles = roles.map((r) => r.trim().toUpperCase());

        if (normalizedRoles.includes("ROLE_ADMIN") || normalizedRoles.includes("ROLE_SUPER_ADMIN")) {
          setAuthorized(true);
          fetchPendingSellers();
        } else {
          setAuthorized(false);
          alert("Access denied. You are not authorized to view this page.");
        }
      } catch (err) {
        console.error("Failed to verify user role:", err);
        alert("Session expired or unauthorized.");
      }
    };

    checkAccessAndFetch();
  }, [fetchPendingSellers, token]);

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8070/auth/users/approve/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPendingSellers();
    } catch (err) {
      console.error("Failed to approve seller:", err);
      alert("Failed to approve seller.");
    } finally {
      setLoading(false);
    }
  };

  const actionBody = (rowData) => (
    <Button
      label="Approve"
      icon="pi pi-check"
      className="p-button-rounded p-button-success"
      onClick={() => handleApprove(rowData.id)}
      disabled={loading}
    />
  );

  if (!authorized) return <p>Checking permissions...</p>;

  return (
    <div className="pending-container" style={{ padding: "1rem" }}>
      <h2>Pending Sellers</h2>
      <DataTable
        value={pendingSellers}
        paginator
        rows={5}
        loading={loading}
        emptyMessage="No pending sellers found."
        stripedRows
        hover={true}
        responsiveLayout="scroll"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" />
        <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" />
        <Column field="roles" header="Role" />
        <Column header="Action" body={actionBody} style={{ minWidth: "8rem" }} />
      </DataTable>
    </div>
  );
}
