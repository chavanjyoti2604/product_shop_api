// src/services/authService.js
import api from "./api";

export const register = (data) => api.post("/register", data);

export const login = (data) => api.post("/authenticate", data);

export const getProfile = () => api.get("/profile");

export const updateProfile = (data) => api.put("/update", data);

export const logout = () => {
  localStorage.removeItem("token");
};

export const getPendingSellers = () => api.get("/sellers/pending");

export const getApprovedSellers = () => api.get("/sellers/approved");
