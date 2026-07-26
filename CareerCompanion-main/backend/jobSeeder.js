import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job";
dotenv.config();

const jobs = [
  {
    title: "Full Stack Developer",
    company: "TechCorp",
    location: "Remote",
    skills: ["react", "node.js", "mongodb", "express"],
    description: "Work on MERN stack applications.",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=data%20scientist"
  },
  {
    title: "Frontend Developer",
    company: "Designify",
    location: "Bangalore",
    skills: ["react", "tailwindcss", "javascript"],
    description: "Build responsive UIs with React + Tailwind.",
    applyUrl: "https://www.naukri.com/machine-learning-engineer-jobs"
  },
  {
    title: "Backend Developer",
    company: "CodeWorks",
    location: "Hyderabad",
    skills: ["node.js", "express", "mongodb"],
    description: "Develop scalable backend APIs.",
    applyUrl: "https://in.indeed.com/jobs?q=frontend+developer"
  },
  {
    title: "Data Scientist",
    company: "AI Labs",
    location: "Remote",
    skills: ["python", "machine learning", "nlp"],
    description: "Research and productionize ML models.",
    applyUrl: "https://www.linkedin.com/jobs/search/?keywords=data%20scientist"
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Labs",
    location: "Remote",
    skills: ["python", "tensorflow", "pytorch"],
    description: "Deploy ML pipelines at scale.",
    applyUrl: "https://in.indeed.com/jobs?q=frontend+developer"
  }
];



const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Job.deleteMany();
    await Job.insertMany(jobs);
    console.log("Jobs seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding jobs:", err);
    process.exit(1);
  }
};

seedJobs();
