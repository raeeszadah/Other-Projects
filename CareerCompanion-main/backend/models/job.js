import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  skills: [{ type: String, required: true }],
  description: String,
  applyUrl: { type: String, required: true },
}, { timestamps: true }); 
export default mongoose.models.Job || mongoose.model("Job", jobSchema);
