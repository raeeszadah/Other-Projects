import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import { initializeSocket } from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import steamRoutes from "./routes/steamRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const clientOrigin =
    process.env.CLIENT_URL || "http://localhost:5173";

initializeSocket(server, clientOrigin);

app.use(express.json());

app.use(
    cors({
        origin: clientOrigin,
        credentials: true,
    })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/steam", steamRoutes);
app.use("/api/messages", messageRoutes);

app.get("/test", (req, res) => {
    res.send("test route works");
});

app.get("/", (req, res) => {
    res.send("Server Running");
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();