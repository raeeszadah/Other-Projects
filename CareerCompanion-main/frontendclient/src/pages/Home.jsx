import { useContext } from 'react';
import React from "react";
import JobRecommendations from "../components/JobRecommendations";
import { AuthContext } from '../context/AuthContext';
import ResumeBuilder from './ResumeBuilder';
import { Link } from "react-router-dom";
const Home = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading...</p>;

  return (
  <div>
    <ResumeBuilder />
    <Link to="/dashboard">
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Go to Dashboard
      </button>
    </Link>
  </div>
);

};
export default Home;
