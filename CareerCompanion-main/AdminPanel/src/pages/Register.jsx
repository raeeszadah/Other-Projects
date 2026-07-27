import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post("https://careercompanion-backend-mgbo.onrender.com/api/admin/register", formData);
      setMessage(res.data.message || "Registration successful!");
      setLoading(false);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setLoading(false);
      if (error.response) setMessage(error.response.data.message || "Registration failed");
      else setMessage("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 p-4 sm:p-0">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Registration
        </h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {["name","email","password"].map((field,i)=>(
            <div key={i}>
              <label className="block text-gray-700 mb-1 capitalize">{field}</label>
              <input
                type={field==="password"?"password":"text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already registered?{" "}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;

