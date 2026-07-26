import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", location: "", skills: "", description: "", applyUrl: "" });
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    const res = await API.get("/admin/jobs");
    setJobs(res.data);
  };

  const deleteJob = async (id) => {
    await API.delete(`/admin/jobs/${id}`);
    fetchJobs();
  };

  const addJob = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.skills || !form.applyUrl) {
      setError("Title, Company, Location, Skills, and Apply URL are required");
      return;
    }
    await API.post("/admin/jobs", form);
    setForm({ title: "", company: "", location: "", skills: "", description: "", applyUrl: "" });
    setError("");
    fetchJobs();
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 w-full">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Manage Jobs</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={addJob} className="mb-6 flex flex-col sm:flex-row flex-wrap gap-2">
            {["title","company","location","skills","applyUrl"].map((field,i) => (
              <input
                key={i}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e)=>setForm({...form,[field]:e.target.value})}
                className={`border p-2 rounded w-full sm:w-1/4`}
              />
            ))}
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})}
              className="border p-2 rounded w-full sm:w-1/2"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-2 sm:mt-0">Add Job</button>
          </form>
          <Table
            columns={["title","company","location","skills","applyUrl"]}
            data={jobs.map(j=>({...j, skills:j.skills.join(", ")}))}
            onDelete={deleteJob}
          />
        </div>
      </div>
    </div>
  );
}
