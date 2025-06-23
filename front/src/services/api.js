import axios from "axios";

// Create axios instance with base URL from .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Should be http://localhost:8070
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
