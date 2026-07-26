import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/admin/resumes");
      setResumes(res.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

  const deleteResume = async (id) => {
    try {
      await API.delete(`/admin/resumes/${id}`);
      fetchResumes();
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 w-full overflow-x-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Resumes</h2>
          <Table columns={["name", "email"]} data={resumes} onDelete={deleteResume} />
        </div>
      </div>
    </div>
  );
}
