import User from "../models/User.js";
import UserGame from "../models/UserGame.js";
import mongoose from "mongoose";
import { resolveSteamId } from "../utils/steamUtils.js";


// GET CURRENT LOGGED IN USER PROFILE
export const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};


// GET CURRENT USER'S SYNCED GAME LIBRARY
export const getMyGames = async (req, res) => {
    try {
        const userGames = await UserGame.find({
            userId: req.user._id,
        })
            .populate("gameId")
            .sort({ hoursPlayed: -1 });

        const games = userGames
            .filter((entry) => entry.gameId)
            .map((entry) => ({
                _id: entry.gameId._id,
                title: entry.gameId.title,
                steamAppId: entry.gameId.steamAppId,
                coverImage: entry.gameId.coverImage,
                genres: entry.gameId.genres,
                platforms: entry.gameId.platforms,
                hoursPlayed: entry.hoursPlayed,
                platform: entry.platform,
                lastPlayed: entry.lastPlayed || entry.updatedAt,
                achievementsUnlocked: entry.achievementsUnlocked,
            }));

        res.status(200).json(games);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch game library",
        });
    }
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {

        const {
            bio,
            avatar,
            banner,
            steamId,
            favoriteGenres
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.bio = bio || user.bio;
        user.avatar = avatar || user.avatar;
        user.banner = banner || user.banner;

        if (steamId !== undefined && steamId !== null && steamId !== "") {
            const apiKey = process.env.STEAM_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    message: "STEAM_API_KEY is not configured on the server",
                });
            }

            try {
                user.steamId = await resolveSteamId(steamId, apiKey);
            } catch (resolveError) {
                return res.status(400).json({
                    message: resolveError.message,
                });
            }
        }

        if (favoriteGenres) {
            user.favoriteGenres = favoriteGenres;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                banner: updatedUser.banner,
                steamId: updatedUser.steamId,
                favoriteGenres: updatedUser.favoriteGenres
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};


// SEARCH USERS BY ID OR USERNAME
export const searchUsers = async (req, res) => {
    try {
        const query = req.params.q?.trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query required"
            });
        }

        const currentUserId = req.user._id;
        const userFields = "username avatar";
        let users = [];

        const isObjectId =
            mongoose.Types.ObjectId.isValid(query) && query.length === 24;

        if (isObjectId) {
            const user = await User.findById(query).select(userFields);
            if (user && user._id.toString() !== currentUserId.toString()) {
                users = [user];
            }
        } else {
            users = await User.find({
                username: { $regex: query, $options: "i" },
                _id: { $ne: currentUserId }
            })
                .select(userFields)
                .limit(10);
        }

        res.status(200).json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Search failed"
        });

    }
};


// GET USERS TO DISCOVER (NOT SELF, NOT ALREADY FOLLOWING)
export const getDiscoverUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("following");

        const excludeIds = [
            req.user._id,
            ...(currentUser?.following || [])
        ];

        const users = await User.find({
            _id: { $nin: excludeIds }
        })
            .select("username avatar bio followers")
            .sort({ createdAt: -1 })
            .limit(24);

        res.status(200).json(
            users.map((user) => ({
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,
                followerCount: user.followers?.length || 0
            }))
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to load users"
        });

    }
};


// GET PUBLIC PROFILE BY USERNAME
export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findOne({
            username: req.params.username
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

export const addFavoriteGame = async (req, res) => {
    try {

        const { gameId } = req.body;

        const user = await User.findById(req.user._id);

        // check if already favorited
        if (
            user.favoriteGames.includes(gameId)
        ) {
            return res.status(400).json({
                message: "Game already in favorites"
            });
        }

        user.favoriteGames.push(gameId);

        await user.save();

        res.status(200).json({
            message: "Game added to favorites"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to add favorite"
        });

    }
};


export const removeFavoriteGame = async (req, res) => {
    try {

        const { gameId } = req.params;

        const user = await User.findById(req.user._id);

        user.favoriteGames =
            user.favoriteGames.filter(
                (id) => id.toString() !== gameId
            );

        await user.save();

        res.status(200).json({
            message: "Favorite removed"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to remove favorite"
        });

    }
};

export const getFavoriteGames = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .populate("favoriteGames");

        res.status(200).json(
            user.favoriteGames
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch favorites"
        });

    }
};

export const followUser = async (req, res) => {
    try {

        // user to follow
        const userToFollow =
            await User.findById(req.params.id);

        // current logged in user
        const currentUser =
            await User.findById(req.user._id);

        // check user exists
        if (!userToFollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // prevent self follow
        if (
            userToFollow._id.toString() ===
            currentUser._id.toString()
        ) {
            return res.status(400).json({
                message:
                    "You cannot follow yourself"
            });
        }

        // initialize arrays if missing
        if (!currentUser.following) {
            currentUser.following = [];
        }

        if (!userToFollow.followers) {
            userToFollow.followers = [];
        }

        // check already following
        const alreadyFollowing =
            currentUser.following.some(
                (id) =>
                    id.toString() ===
                    userToFollow._id.toString()
            );

        if (alreadyFollowing) {
            return res.status(400).json({
                message:
                    "Already following user"
            });
        }

        // add following
        currentUser.following.push(
            userToFollow._id
        );

        // add follower
        userToFollow.followers.push(
            currentUser._id
        );

        // save both users
        await currentUser.save();

        await userToFollow.save();

        res.status(200).json({
            message:
                "User followed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }
};
export const unfollowUser = async (req, res) => {
    try {

        const userToUnfollow =
            await User.findById(req.params.id);

        const currentUser =
            await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        currentUser.following =
            currentUser.following.filter(
                (id) =>
                    id.toString() !==
                    userToUnfollow._id.toString()
            );

        userToUnfollow.followers =
            userToUnfollow.followers.filter(
                (id) =>
                    id.toString() !==
                    currentUser._id.toString()
            );

        await currentUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unfollow failed"
        });

    }
};

export const getFollowers = async (req, res) => {
    try {

        const user = await User.findById(
            req.params.id
        ).populate(
            "followers",
            "username avatar"
        );

        res.status(200).json(
            user.followers
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch followers"
        });

    }
};

export const getFollowing = async (req, res) => {
    try {

        const user = await User.findById(
            req.params.id
        ).populate(
            "following",
            "username avatar"
        );

        res.status(200).json(
            user.following
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch following"
        });

    }
};