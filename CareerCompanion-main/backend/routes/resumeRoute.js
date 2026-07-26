import express from 'express';
import { createResume } from '../controller/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create', protect, upload.single('image'), createResume);

export default router;
