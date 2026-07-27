import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const JobRecommendations = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (!user?.resume?.skills || user.resume.skills.length === 0) {
      alert("Please add skills in your resume first!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("https://careercompanion-backend-mgbo.onrender.com/api/jobs/recommend", {
        skills: user.resume.skills,
      });

      setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Job Recommendations</h1>
      <button
        onClick={fetchJobs}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Loading..." : "Get Job Recommendations"}
      </button>

      <div className="mt-6 space-y-4">
        {jobs.length > 0 &&
          jobs.map((job, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm">{job.location}</p>
              <p className="text-sm mt-2">{job.description?.slice(0, 150)}...</p>
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block px-3 py-1 bg-green-600 text-white rounded"
                >
                  Apply Now
                </a>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobRecommendations;



