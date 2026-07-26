import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 sm:p-6 w-full overflow-x-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Users</h2>
          <Table columns={["name", "email"]} data={users} onDelete={deleteUser} />
        </div>
      </div>
    </div>
  );
}
