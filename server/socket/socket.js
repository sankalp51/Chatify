const { Server } = require('socket.io');
const http = require('http')
const express = require('express');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

const getRecieverSokcetId = (recieverId) => {
    return userSocketMap[recieverId];
}

const userSocketMap = {};

io.on("connection", socket => {
    const { userId } = socket.handshake.query;
    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    }

    socket.on("disconnect", socket => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});



module.exports = { app, io, server, getRecieverSokcetId }