import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getMyProfile,
    getMyGames,
    updateProfile,
    getUserProfile,
    searchUsers,
    getDiscoverUsers,
} from "../controllers/userController.js";

import {
    addFavoriteGame,
    removeFavoriteGame,
    getFavoriteGames
}
from "../controllers/userController.js";

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
}
from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.get("/me/games", protect, getMyGames);
router.put("/me", protect, updateProfile);

router.get("/discover", protect, getDiscoverUsers);

router.get("/favorites", protect, getFavoriteGames);
router.post("/favorites", protect, addFavoriteGame);
router.delete("/favorites/:gameId", protect, removeFavoriteGame);

router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);
router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);

router.get("/search/:q", protect, searchUsers);

router.get("/:username", getUserProfile);

export default router;
