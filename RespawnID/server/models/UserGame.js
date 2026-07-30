import mongoose from "mongoose";

const userGameSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },

    platform: {
        type: String,
        default: "Steam"
    },

    hoursPlayed: {
        type: Number,
        default: 0
    },

    achievementsUnlocked: {
        type: Number,
        default: 0
    },

    lastPlayed: {
        type: Date
    }

}, {
    timestamps: true
});

const UserGame =
    mongoose.model("UserGame", userGameSchema);

export default UserGame;