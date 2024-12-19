const { default: mongoose } = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    if (!content) return res.status(400).json({ message: "Invalid data" });

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat id" });
    }

    const newMessage = new Message({
      sender: req.user,
      chat: chatId,
      content,
    });

    let message = await Message.create(newMessage);

    message = await message.populate([
      { path: "sender", select: "firstName lastName profilePic" },
      {
        path: "chat",
        populate: { path: "users", select: "firstName lastName profilePic" },
      },
    ]);

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const allMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate([
      { path: "sender", select: "firstName lastName profilePic email" },
      {
        path: "chat",
        populate: {
          path: "users",
          select: "firstName lastName profilePic",
        },
      },
    ]);

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, allMessages };
