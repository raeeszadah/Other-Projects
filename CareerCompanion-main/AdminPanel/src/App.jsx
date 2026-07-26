import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import AdminRegister from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Resumes from "./pages/Resumes";
import Jobs from "./pages/Jobs";
import API from "./api/axiosInstance";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const [valid, setValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get("/admin/verify");
        setValid(true);
      } catch {
        localStorage.removeItem("adminToken");
        setValid(false);
      }
    };
    if (token) verifyToken();
    else setValid(false);
  }, []);

  if (valid === null) return <div>Loading...</div>;
  return valid ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <PrivateRoute>
              <Resumes />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <Jobs />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
