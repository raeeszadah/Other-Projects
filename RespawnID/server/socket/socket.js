import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

const onlineUsers = new Map();
const userFields = "username avatar";

export const initializeSocket = (server, clientOrigin) => {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      if (!userId) return;
      const id = userId.toString();
      socket.data.userId = id;
      onlineUsers.set(id, socket.id);
      console.log("User joined:", id);
    });

    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        const senderId = socket.data.userId;
        if (!senderId || !receiverId || !content?.trim()) return;

        if (senderId === receiverId.toString()) return;

        const receiver = await User.findById(receiverId).select("_id");
        if (!receiver) return;

        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content: content.trim(),
        });

        await message.populate("sender", userFields);
        await message.populate("receiver", userFields);

        const payload = message.toObject();

        socket.emit("new_message", payload);

        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_message", payload);
        }
      } catch (error) {
        console.error("send_message error:", error);
        socket.emit("message_error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const [userId, socketId] of onlineUsers) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export { onlineUsers };
