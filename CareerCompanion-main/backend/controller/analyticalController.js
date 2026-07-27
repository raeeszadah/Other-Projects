import Resume from "../models/Resume.js";
import axios from "axios";
import { adzunaAppId, adzunaAppKey, adzunaCountry } from "../config/adzunaConfig.js";

export const getCareerGrowth = async (req, res) => {
  try {
    const userId = req.user._id;
    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(200).json({ success: true, experienceData: [], growthMetrics: [] }); // return empty arrays instead of 404
    }

    const experienceData = (resume.experience || []).map((exp) => ({
      year: exp.endDate ? exp.endDate.split("-")[0] : "Present",
      company: exp.company || "Unknown",
    }));

    const growthMetrics = [
      { name: "Skills", value: (resume.skills || []).length },
      { name: "Projects", value: (resume.projects || []).length },
      { name: "Certifications", value: (resume.certifications || []).length },
      { name: "Experience", value: (resume.experience || []).length },
    ];

    res.json({ success: true, experienceData, growthMetrics });
  } catch (error) {
    console.error("Career Growth Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getSkillMatch = async (req, res) => {
  try {
    const userId = req.user._id;
    const resume = await Resume.findOne({ userId });

    if (!resume || !resume.skills || resume.skills.length === 0) {
      return res.status(200).json({ success: true, chartData: [] }); // empty chart
    }

    const skillQuery = resume.skills.join(" ");
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${adzunaCountry}/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&results_per_page=20&what=${encodeURIComponent(skillQuery)}`;

    let data;
    try {
      const response = await axios.get(adzunaUrl);
      data = response.data;
    } catch (axiosErr) {
      console.error("Adzuna API Skill Match failed:", axiosErr.message);
      return res.status(200).json({ success: true, chartData: [] }); // fallback empty
    }

    const trendingSkills = {};

    (data.results || []).forEach((job) => {
      resume.skills.forEach((skill) => {
        const title = job.title?.toLowerCase() || "";
        const desc = job.description?.toLowerCase() || "";
        if (title.includes(skill.toLowerCase()) || desc.includes(skill.toLowerCase())) {
          trendingSkills[skill] = (trendingSkills[skill] || 0) + 1;
        }
      });
    });

    const chartData = Object.entries(trendingSkills).map(([skill, count]) => ({ skill, count }));

    res.json({ success: true, chartData });
  } catch (error) {
    console.error("Skill Match Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getJobTrends = async (req, res) => {
  try {
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${adzunaCountry}/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&results_per_page=25`;

    let data;
    try {
      const response = await axios.get(adzunaUrl);
      data = response.data;
    } catch (axiosErr) {
      console.error("Adzuna API Job Trends failed:", axiosErr.message);
      return res.status(200).json({ success: true, trendData: [] }); // fallback empty
    }

    const categories = {};

    (data.results || []).forEach((job) => {
      const cat = job.category?.label || "Other";
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const trendData = Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7); 

    res.json({ success: true, trendData });
  } catch (error) {
    console.error("Job Trend Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
