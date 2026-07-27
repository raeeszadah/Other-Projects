import express from "express";
import {
    registerAdmin,
  loginAdmin,
  getAllUsers,
  deleteUser,
  getAllResumes,
  deleteResume,
  getAllJobs,
  addJob,
  deleteJob,
  verifyAdminToken,
} from "../controller/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();
router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/verify", adminAuth, verifyAdminToken);

router.get("/users", adminAuth, getAllUsers);
router.delete("/users/:id", adminAuth, deleteUser);

router.get("/resumes", adminAuth, getAllResumes);
router.delete("/resumes/:id", adminAuth, deleteResume);

router.get("/jobs", adminAuth, getAllJobs);
router.post("/jobs", adminAuth, addJob);
router.delete("/jobs/:id", adminAuth, deleteJob);

export default router;
