// src/services/api.ts

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Mock API URL 
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;