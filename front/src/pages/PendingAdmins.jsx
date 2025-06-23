import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./PendingAdmins.css";

export default function PendingAdmins() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPendingAdmins = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8070/auth/users/pending-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingAdmins(res.data);
    } catch (err) {
      alert("Failed to fetch pending admins");
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
        if (role.includes("ROLE_SUPER_ADMIN")) {
          setAuthorized(true);
          fetchPendingAdmins();
        } else {
          alert("Access denied. Only super admins can approve admins.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to verify user role or session expired.");
      }
    };
    checkAccess();
  }, [fetchPendingAdmins, token]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8070/auth/users/approve/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Admin approved successfully!");
      fetchPendingAdmins();
    } catch (err) {
      alert("Failed to approve admin");
      console.error(err);
    }
  };

  const actionBody = (rowData) => (
    <Button
      label="Approve"
      icon="pi pi-check"
      className="p-button-rounded p-button-success"
      onClick={() => handleApprove(rowData.id)}
    />
  );

  if (!authorized) return <p>Checking permissions...</p>;

  return (
    <div className="pending-admins-container" style={{ padding: "1rem" }}>
      <h2>Pending Admins</h2>
      <DataTable
        value={pendingAdmins}
        paginator
        rows={5}
        loading={loading}
        emptyMessage="No pending admins found."
        stripedRows
        hover
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
