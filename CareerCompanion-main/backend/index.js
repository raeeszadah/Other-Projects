import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';
import connectDb from './config/db.js';
import router from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoute.js';
import jobRoutes from "./routes/jobRoutes.js";
import interviewRoutes from './routes/interviewRoutes.js';
import analyticsRoutes from "./routes/analyticsRoute.js";

import adminRoutes from "./routes/adminRoutes.js";
let port = process.env.PORT || 5000;
let app = express();

connectDb();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["https://careercompanion-adminpanel.onrender.com", "https://careercompanion-frontendclient.onrender.com"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],

}))

app.use("/api/auth", router)
app.use('/api/resume', resumeRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Hello!! from server");
})
app.listen(port, () => {
  console.log(`Hello from server running on port" ${port}`)
})

