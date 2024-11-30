const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const User = require("../models/User");

// Create or fetch a one-on-one chat
const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Check if a chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users")
      .populate("latestMessage");

    if (chat) {
      chat = await Chat.findOne({ _id: chat._id }).populate(
        "users",
        "-password -refreshToken"
      );
      return res.status(200).json(chat);
    }

    // Create new chat
    const chatData = {
      name: "sender",
      isGroupChat: false,
      users: [req.user, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -refreshToken"
    );

    res.status(200).json(fullChat);
  } catch (error) {
    next(error);
  }
};

// Fetch all chats for the logged-in user
const fetchChats = async (req, res, next) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user } },
    })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "firstName lastName profilePic email",
    });
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

// Create a new group chat
const createGroupChat = async (req, res, next) => {
  try {
    const { users, name } = req.body;

    if (!users || !name) {
      return res
        .status(400)
        .json({ message: "Please fill in all the details" });
    }

    let parsedUsers = users;
    if (parsedUsers.length < 2) {
      return res
        .status(400)
        .json({ message: "A group chat requires at least 2 users" });
    }

    parsedUsers.push(req.user);

    const groupChatData = {
      name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    };

    const createdChat = await Chat.create(groupChatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -refreshToken"
    );
    res.status(201).json(fullChat);
  } catch (error) {
    next(error);
  }
};

// Rename a group chat
const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId) || !chatName) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name: chatName },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const fullChat = await Chat.findOne({ _id: updatedChat._id })
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");

    res.status(200).json(fullChat);
  } catch (error) {
    next(error);
  }
};

// Add a user to a group chat
const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(chatId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid chatId or userId" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const fullChat = await Chat.findOne({ _id: updatedChat._id })
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");
    res.status(200).json(fullChat);
  } catch (error) {
    next(error);
  }
};

// Remove a user from a group chat
const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(chatId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid chatId or userId" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const fullChat = await Chat.findOne({ _id: updatedChat._id })
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken");
    res.status(200).json(fullChat);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
