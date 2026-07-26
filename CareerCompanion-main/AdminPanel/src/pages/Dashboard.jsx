import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, resumes: 0, jobs: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const [users, resumes, jobs] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/resumes"),
        API.get("/admin/jobs"),
      ]);
      setStats({
        users: users.data.length,
        resumes: resumes.data.length,
        jobs: jobs.data.length,
      });
    };
    fetchData();
  }, []);

  const cardColors = {
    users: "from-blue-500 to-blue-400",
    resumes: "from-green-500 to-green-400",
    jobs: "from-purple-500 to-purple-400",
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-8 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(stats).map(([key, val]) => (
              <div
                key={key}
                className={`bg-gradient-to-br ${cardColors[key]} text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <h3 className="text-lg sm:text-xl capitalize opacity-90">{key}</h3>
                  <p className="text-3xl sm:text-4xl font-bold mt-2">{val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12">
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center text-gray-600">
              <p>Welcome back, Admin: manage users, resumes, and jobs from the sidebar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

