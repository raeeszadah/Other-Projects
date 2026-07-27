import axios from "axios";
import { clearUserStorage } from "./profileUtils";

export const backendUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "http://localhost:5001")
).replace(/\/$/, "");

const instance = axios.create({
  baseURL: backendUrl ? `${backendUrl}/api` : "/api",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - please login again");
      clearUserStorage();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default instance;
