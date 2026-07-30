import Message from "../models/Message.js";
import User from "../models/User.js";

const userFields = "username avatar";

function getPartnerId(message, currentUserId) {
  const me = currentUserId.toString();
  return message.sender._id.toString() === me
    ? message.receiver._id
    : message.sender._id;
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", userFields)
      .populate("receiver", userFields);

    const conversationMap = new Map();

    for (const message of messages) {
      const partnerId = getPartnerId(message, userId).toString();

      if (conversationMap.has(partnerId)) continue;

      const partner =
        message.sender._id.toString() === userId.toString()
          ? message.receiver
          : message.sender;

      const unreadCount = await Message.countDocuments({
        sender: partner._id,
        receiver: userId,
        read: false,
      });

      conversationMap.set(partnerId, {
        user: {
          _id: partner._id,
          username: partner.username,
          avatar: partner.avatar,
        },
        lastMessage: {
          _id: message._id,
          content: message.content,
          createdAt: message.createdAt,
          sender: message.sender._id,
        },
        unreadCount,
      });
    }

    res.status(200).json(Array.from(conversationMap.values()));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load conversations" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userId: otherUserId } = req.params;

    const otherUser = await User.findById(otherUserId).select(userFields);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", userFields)
      .populate("receiver", userFields);

    await Message.updateMany(
      { sender: otherUserId, receiver: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      user: otherUser,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userId: receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    if (receiverId === userId.toString()) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    const receiver = await User.findById(receiverId).select(userFields);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await Message.create({
      sender: userId,
      receiver: receiverId,
      content: content.trim(),
    });

    await message.populate("sender", userFields);
    await message.populate("receiver", userFields);

    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
