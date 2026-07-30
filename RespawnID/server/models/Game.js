import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    steamAppId: {
        type: Number,
        unique: true,
        sparse: true
    },

    coverImage: {
        type: String,
        default: ""
    },

    genres: {
        type: [String],
        default: []
    },

    platforms: {
        type: [String],
        default: []
    },

    releaseDate: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const Game = mongoose.model("Game", gameSchema);

export default Game;