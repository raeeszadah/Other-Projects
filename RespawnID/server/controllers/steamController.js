import axios from "axios";

import User from "../models/User.js";
import Game from "../models/Game.js";
import UserGame from "../models/UserGame.js";
import {
    buildOwnedGamesUrl,
    resolveSteamId,
} from "../utils/steamUtils.js";

function formatSyncedGame(gameDoc, userGame) {
    return {
        _id: gameDoc._id,
        title: gameDoc.title,
        steamAppId: gameDoc.steamAppId,
        coverImage: gameDoc.coverImage,
        genres: gameDoc.genres,
        platforms: gameDoc.platforms,
        hoursPlayed: userGame.hoursPlayed,
        platform: userGame.platform,
        lastPlayed: userGame.lastPlayed || userGame.updatedAt,
        achievementsUnlocked: userGame.achievementsUnlocked,
    };
}

export const syncSteamGames = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.steamId) {
            return res.status(400).json({
                message: "Steam ID not connected",
            });
        }

        const apiKey = process.env.STEAM_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                message: "STEAM_API_KEY is not configured on the server",
            });
        }

        const steamId64 = await resolveSteamId(user.steamId, apiKey);

        if (user.steamId !== steamId64) {
            user.steamId = steamId64;
            await user.save();
        }

        const url = buildOwnedGamesUrl(apiKey, steamId64);
        const response = await axios.get(url);

        const games = (response.data.response?.games || []).slice(0, 5);
        const syncedGames = [];

        for (const game of games) {
            let existingGame = await Game.findOne({
                steamAppId: game.appid,
            });

            if (!existingGame) {
                existingGame = await Game.create({
                    title: game.name,
                    steamAppId: game.appid,
                    platforms: ["Steam"],
                });
            }

            let userGame = await UserGame.findOne({
                userId: user._id,
                gameId: existingGame._id,
            });

            if (!userGame) {
                userGame = await UserGame.create({
                    userId: user._id,
                    gameId: existingGame._id,
                    platform: "Steam",
                    hoursPlayed: game.playtime_forever / 60,
                });
            } else {
                userGame.hoursPlayed = game.playtime_forever / 60;
                await userGame.save();
            }

            syncedGames.push(formatSyncedGame(existingGame, userGame));
        }

        res.status(200).json({
            message: "Steam games synced successfully",
            totalGames: syncedGames.length,
            steamId: steamId64,
            games: syncedGames,
        });
    } catch (error) {
        console.log(error);

        const message =
            error.message ||
            error.response?.data?.message ||
            "Steam sync failed";

        const status = message.includes("STEAM_API_KEY") ? 500 : 400;

        res.status(status).json({
            message,
            error: error.message,
        });
    }
};
