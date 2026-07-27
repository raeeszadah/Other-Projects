import React, { useContext } from "react";
import JobRecommendations from "../components/JobRecommendations";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 md:ml-0 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Welcome, {user.name}</h1>
      <JobRecommendations userSkills={user?.resume?.skills || []} />
    </div>
  );
};

export default Dashboard;
