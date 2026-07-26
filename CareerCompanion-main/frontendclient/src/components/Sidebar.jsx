import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  HelpCircle,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/resume-builder", label: "Resume Builder", icon: <ClipboardList size={18} /> },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { to: "/interview-prep", label: "Interview Prep", icon: <HelpCircle size={18} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-gray-900 text-white rounded-md shadow-md"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
          flex flex-col justify-between shadow-2xl border-r border-gray-700
          transform transition-transform duration-300 ease-in-out z-50
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-center mb-10 tracking-wide">
            <span className="text-blue-400">Career</span> Companion
          </h1>

          <nav className="space-y-3">
            {links.map(({ to, label, icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setOpen(false)} // close mobile sidebar after click
                >
                  {icon}
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        />
      )}
    </>
  );
}
