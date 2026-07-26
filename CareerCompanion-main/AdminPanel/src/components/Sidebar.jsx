import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiFileText, FiBriefcase, FiLogOut } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 ${
      isActive ? "bg-blue-200 font-semibold" : ""
    }`;

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg h-full lg:h-screen flex flex-col">
      <h2 className="text-2xl font-bold text-center p-4 border-b flex items-center justify-center gap-2">
        <FiBriefcase /> Admin Panel
      </h2>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={linkStyle}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/users" className={linkStyle}>
          <FiUsers /> Users
        </NavLink>
        <NavLink to="/resumes" className={linkStyle}>
          <FiFileText /> Resumes
        </NavLink>
        <NavLink to="/jobs" className={linkStyle}>
          <FiBriefcase /> Jobs
        </NavLink>
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem("adminToken");
          navigate("/");
        }}
        className="m-4 bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
}

