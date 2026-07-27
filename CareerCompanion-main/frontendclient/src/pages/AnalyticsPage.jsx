import { useEffect, useState } from "react";
import axios from "axios";
import CareerGrowthChart from "../components/careerGrowthChart";
import SkillMatchChart from "../components/skillMatchChart";
import JobTrendsChart from "../components/jobTrendsChart";

const AnalyticsPage = () => {
  const [growthData, setGrowthData] = useState([]);
  const [skillMatch, setSkillMatch] = useState([]);
  const [jobTrends, setJobTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const axiosConfig = { withCredentials: true };

        const [growthRes, skillRes, trendRes] = await Promise.all([
          axios.get("https://careercompanion-backend-mgbo.onrender.com/api/analytics/growth", axiosConfig),
          axios.get("https://careercompanion-backend-mgbo.onrender.com/api/analytics/skills", axiosConfig),
          axios.get("https://careercompanion-backend-mgbo.onrender.com/api/analytics/trends", axiosConfig),
        ]);

        setGrowthData(growthRes.data.growthMetrics || []);
        setSkillMatch(skillRes.data.chartData || []);
        setJobTrends(trendRes.data.trendData || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data.");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen md:ml-0 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
        Career Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CareerGrowthChart data={growthData} />
        <SkillMatchChart data={skillMatch} />
      </div>

      <div className="mt-8">
        <JobTrendsChart data={jobTrends} />
      </div>
    </div>

  );
};

export default AnalyticsPage;
