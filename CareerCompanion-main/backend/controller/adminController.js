import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Admin from "../models/admin.js"; 
import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Job from "../models/job.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_production";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, admin: { email: admin.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyAdminToken = async (req, res) => {
  res.status(200).json({ admin: req.admin });
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resumes", error: err.message });
  }
};



export const deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting resume", error: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

export const addJob = async (req, res) => {
  try {
    const { title, company, location, skills, description, applyUrl } = req.body;

    if (!title || !company || !location || !skills || !applyUrl) {
      return res.status(400).json({
        message: "Title, company, location, skills and applyUrl are required",
      });
    }

    const skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());

    const newJob = await Job.create({
      title,
      company,
      location,
      skills: skillsArray,
      description,
      applyUrl,
    });

    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (err) {
    console.error("Add Job error:", err);
    res.status(500).json({ message: "Error adding job", error: err.message });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};
