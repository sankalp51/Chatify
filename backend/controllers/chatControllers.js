const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const User = require("../models/User");

const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password", "-refreshToken")
      .populate("latestMessage");

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "firstName lastName profilePic email",
    });

    if (chat.length > 0) {
      return res.status(200).send(chat[0]);
    }

    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user, userId],
    };
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password",
      "-refreshToken"
    );
    res.status(200).json(fullChat);
  } catch (error) {
    next(error);
  }
};

const fetchChats = async (req, res, next) => {
  try {
    let results = await Chat.find({ users: { $elemMatch: { $eq: req.user } } })
      .populate("users", "-password", "-refreshToken")
      .populate("groupAdmin", "-password", "-refreshToken")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const createGroupChat = async (req, res, next) => {
  try {
    const { users, name } = req.body;
    if (!users || !name) {
      return res.status(400).json({ message: "Plese fill in all the details" });
    }

    let parsedUsers = JSON.stringify(users);
    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: "group chat required more than 2 people" });
    }

    parsedUsers.push(req.user);
    const newGroupChat = new Chat({
      name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const createdChat = await Chat.findOne({ id: newGroupChat._id })
      .populate("users", "-password", "-refreshToken")
      .populate("groupAdmin", "-password", "-refreshToken");

    res.status(201).json(createdChat);
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "invalid data" });
    }

    if (!chatName) {
      return res.status(400).json({ message: "invalid data" });
    }

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { name: chatName },
      {
        new: true,
      }
    )
      .populate("users", "-password", "-refreshToken")
      .populate("groupAdmin", "-password", "-refreshToken");

    if (!updatedChat) {
      return res.status(404).json({ message: "chat not found" });
    }
    res.status(200).json(updatedChat);
  } catch (error) {
    next(error);
  }
};

const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(chatId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const added = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $push: userId },
      { new: true }
    )
      .populate("users", "-password", "-refreshToken")
      .populate("groupAdmin", "-password", "-refreshToken");
    res.status(200).json(added);
  } catch (error) {
    next(error);
  }
};
const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(chatId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const removed = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $pull: userId },
      { new: true }
    )
      .populate("users", "-password", "-refreshToken")
      .populate("groupAdmin", "-password", "-refreshToken");
    res.status(200).json(removed);
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
