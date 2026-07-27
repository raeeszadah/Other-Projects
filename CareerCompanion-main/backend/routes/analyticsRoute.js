import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCareerGrowth,
  getSkillMatch,
  getJobTrends,
} from "../controller/analyticalController.js";

const router = express.Router();

router.get("/growth", protect, getCareerGrowth);
router.get("/skills", protect, getSkillMatch);
router.get("/trends", protect, getJobTrends);

export default router;

