import express from "express";
import { recommendJobs } from "../controller/jobController.js";

const router = express.Router();

router.post("/recommend", recommendJobs);

export default router;
