import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/dashboard");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", form);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 sm:p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          New admin?{" "}
          <Link
            to="/admin/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
