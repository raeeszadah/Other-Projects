import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        default: ""
    },
     
    bio: {
    type: String,
    default: ""
    },

    avatar: {
    type: String,
    default: ""
    },

    banner: {
    type: String,
    default: ""
    },

    steamId: {
    type: String,
    default: ""
    },

    favoriteGames: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game"
    }
    ],

    favoriteGenres: {
    type: [String],
    default: []
    },

    followers: {
    type: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    default: []
},

following: {
    type: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    default: []
},


}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;