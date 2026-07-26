import axios from "axios";
import Job from "../models/job.js"; 
import { adzunaAppId, adzunaAppKey, adzunaCountry } from "../config/adzunaConfig.js";

export const recommendJobs = async (req, res) => {
  const { skills } = req.body;

  if (!skills || skills.length === 0) {
    return res.status(400).json({ success: false, message: "No skills provided" });
  }

  try {
    const skillQuery = skills.join(" ");
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${adzunaCountry}/search/1?app_id=${adzunaAppId}&app_key=${adzunaAppKey}&results_per_page=10&what=${encodeURIComponent(
      skillQuery
    )}`;

    const { data } = await axios.get(adzunaUrl);

    if (data.results && data.results.length > 0) {
      const formattedJobs = data.results.map((job) => ({
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        url: job.redirect_url, 
      }));

      return res.json({ success: true, source: "adzuna", jobs: formattedJobs });
    }


    const dbJobs = await Job.find({
      skills: { $in: skills.map((s) => s.toLowerCase()) },
    });

    return res.json({ success: true, source: "db", jobs: dbJobs });
  } catch (error) {
    console.error("Adzuna API Error, falling back to DB:", error.message);

    const dbJobs = await Job.find({
      skills: { $in: skills.map((s) => s.toLowerCase()) },
    });

    return res.json({ success: true, source: "db-fallback", jobs: dbJobs });
  }
};
