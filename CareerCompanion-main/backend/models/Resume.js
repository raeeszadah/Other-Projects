import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  filePath: { type: String },
  fileUrl: { type: String },
  imageUrl: { type: String },
  education: [{ institute: String, degree: String, startYear: String, endYear: String }],
  experience: [{ company: String, role: String, startDate: String, endDate: String }],
  skills: [String],
  projects: [{ name: String, description: String, link: String }],
  certifications: [String],
  achievements: [String],
  extracurricular: [String],
}, { timestamps: true });

export default mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
