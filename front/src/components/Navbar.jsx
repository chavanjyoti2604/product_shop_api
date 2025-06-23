// src/components/Navbar.js

import { NavLink, useNavigate } from "react-router-dom";
import { getToken, getUserRoles, fetchUserStatusFromAPI } from "../utils/auth";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const updateStatus = async () => {
      const token = getToken();
      const roles = getUserRoles();
      const status = await fetchUserStatusFromAPI();

      setToken(token);
      setRoles(roles);
      setUserStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="navbar-left">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>
      </ul>

      <ul className="navbar-right">
        {!token ? (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                Profile
              </NavLink>
            </li>

            {/* Seller Links */}
            {roles.includes("ROLE_SELLER") && (
              <>
                <li>
                  <NavLink to="/seller-profile" className={({ isActive }) => (isActive ? "active" : "")}>
                    Seller Status
                  </NavLink>
                </li>
                {userStatus === "APPROVED" && (
                  <>
                    <li>
                      <NavLink to="/add-shop" className={({ isActive }) => (isActive ? "active" : "")}>
                        Add Shop
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-shops" className={({ isActive }) => (isActive ? "active" : "")}>
                        My Shops
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/add-product" className={({ isActive }) => (isActive ? "active" : "")}>
                        Add Product
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/my-products" className={({ isActive }) => (isActive ? "active" : "")}>
                        My Products
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}

            {/* Admin Links */}
            {roles.includes("ROLE_ADMIN") && (
              <>
                <li>
                  <NavLink to="/admin-status" className={({ isActive }) => (isActive ? "active" : "")}>
                    Admin Status
                  </NavLink>
                </li>
                {userStatus === "APPROVED" && (
                  <>
                    <li>
                      <NavLink to="/pending" className={({ isActive }) => (isActive ? "active" : "")}>
                        Pending Sellers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/approved" className={({ isActive }) => (isActive ? "active" : "")}>
                        Approved Sellers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/pending-shops" className={({ isActive }) => (isActive ? "active" : "")}>
                        Pending Shops
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/approved-shops" className={({ isActive }) => (isActive ? "active" : "")}>
                        Approved Shops
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}

            {/* Super Admin Links */}
            {roles.includes("ROLE_SUPER_ADMIN") && (
              <>
                <li>
                  <NavLink to="/pending" className={({ isActive }) => (isActive ? "active" : "")}>
                    Pending Sellers
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/approved" className={({ isActive }) => (isActive ? "active" : "")}>
                    Approved Sellers
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pending-shops" className={({ isActive }) => (isActive ? "active" : "")}>
                    Pending Shops
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/approved-shops" className={({ isActive }) => (isActive ? "active" : "")}>
                    Approved Shops
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pending-admins" className={({ isActive }) => (isActive ? "active" : "")}>
                    Pending Admins
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/approved-admins" className={({ isActive }) => (isActive ? "active" : "")}>
                    Approved Admins
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                    Super Admin Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create-user" className={({ isActive }) => (isActive ? "active" : "")}>
                    Create User
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
