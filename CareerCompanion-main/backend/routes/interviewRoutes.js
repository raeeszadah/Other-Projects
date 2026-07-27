import express from "express";
import { generateInterviewQuestions } from "../controller/interviewController.js";

const router = express.Router();

router.post("/", generateInterviewQuestions);

export default router;
