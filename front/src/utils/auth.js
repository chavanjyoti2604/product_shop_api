import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const isLoggedIn = () => !!localStorage.getItem("token");

export const getToken = () => localStorage.getItem("token");

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getUserRoles = () => {
  const token = getToken();
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || decoded.ROLES || decoded.role || [];
    if (Array.isArray(roles)) return roles;
    if (typeof roles === "string") return roles.split(",").map((r) => r.trim());
    return [];
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
};

export const getUserStatus = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.status || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// ✅ NEW FUNCTION: Fetch real-time status from backend
export const fetchUserStatusFromAPI = async () => {
  try {
    const token = getToken();
    if (!token) return null;

    const res = await axios.get("http://localhost:8070/auth/status", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.status || null;
  } catch (err) {
    console.error("Failed to fetch user status:", err);
    return null;
  }
};
