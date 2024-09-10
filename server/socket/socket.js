const { Server } = require('socket.io');
const http = require('http')
const express = require('express');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

io.on("connection", socket => {
    console.log("user connected with ID: " + socket.id)
});

io.on("disconnect", socket => {
    console.log("User with ID " + socket.id + " disconnected")
});

module.exports = { app, io, server }