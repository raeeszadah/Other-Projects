import axios from "axios";

export const authAPI = axios.create({
  baseURL: "https://careercompanion-backend-mgbo.onrender.com",
  withCredentials: true,
});

export const registerUser = (data) => authAPI.post("/register", data);
export const loginUser = (data) => authAPI.post("/login", data);
export const getMe = () => authAPI.get("/me");
