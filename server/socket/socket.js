const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Conversations = require('../model/Conversations');
const Message = require("../model/Message");
const User = require('../model/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

// Helper function to get recipient's socket ID
const getRecieverSokcetId = (recieverId) => {
  return userSocketMap[recieverId];
};

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  
  // Add the user to the socket map
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Listen for typing events
  socket.on("typing", ({ recipientId, isTyping }) => {
    const recieverSocketId = getRecieverSokcetId(recipientId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("typing", { senderId: userId, isTyping });
    }
  });

  // Listen for sendMessage events
  socket.on("sendMessage", async ({ recipientId, message, username }, callback) => {
    try {
      // Fetch the sender and recipient from the database
      const sender = await User.findOne({ username });
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient) {
        return callback({ status: 404, error: "User not found" });
      }

      // Find or create a conversation between sender and recipient
      let conversation = await Conversations.findOne({
        participants: { $all: [sender._id, recipient._id] }
      });

      if (!conversation) {
        conversation = await Conversations.create({
          participants: [sender._id, recipient._id]
        });
      }

      // Create a new message
      const newMessage = new Message({
        sender: sender._id,
        receiver: recipient._id,
        message
      });

      // Add the message to the conversation
      conversation.messages.push(newMessage);
      await Promise.all([conversation.save(), newMessage.save()]);

      const recipientSocketId = getRecieverSokcetId(recipient._id);
      const senderSocketId = getRecieverSokcetId(sender._id);

      // Emit the message to the recipient
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessage", newMessage);
      }

      // Emit the message back to the sender
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", newMessage);
      }

      // Callback for client-side handling
      callback({ status: 201, message: newMessage });
    } catch (error) {
      callback({ status: 500, error: error.message });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export app, io, server, and helper function
module.exports = { app, io, server, getRecieverSokcetId };
