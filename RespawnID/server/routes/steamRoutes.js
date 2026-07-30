import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    syncSteamGames
} from "../controllers/steamController.js";

const router = express.Router();

router.post("/sync", protect, syncSteamGames);

export default router;