const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

const getRecieverSokcetId = (recieverId) => {
  return userSocketMap[recieverId];
};

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Listen for typing events and broadcast to the recipient
  socket.on("typing", ({ recipientId, isTyping }) => {
    const recieverSocketId = getRecieverSokcetId(recipientId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("typing", { senderId: userId, isTyping });
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getRecieverSokcetId };
