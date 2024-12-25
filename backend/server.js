const express = require("express");
const cors = require("cors");
const { corsConfig } = require("./config/corsConfig");
const connectDb = require("./config/db");
const mongoose = require("mongoose");
const credentials = require("./middlewares/credentials");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes/authRoutes");
const verifyJwt = require("./middlewares/verifyJwt");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Server } = require("socket.io");
const { createServer } = require("http");
require("dotenv").config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 3000;

connectDb(process.env.DATABASE_URL);
app.use(credentials);
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.accepts("html")) {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "views", "index.html"));
  } else if (req.accepts("json")) {
    return res.status(200).json({ message: "Welcome to the chatify API" });
  }
  res.type("text").status(200).send("Welcome to the chatify API");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", verifyJwt, userRoutes);
app.use("/api/chats", verifyJwt, chatRoutes);
app.use("/api/messages", verifyJwt, messageRoutes);

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.status(404).json({ message: "404 Not found" });
  }
  res.type("text").status(404).send("404 Not found");
});

io.on("connect", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (data) => {
    if (!data.chat.users) return;
    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", data);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("is typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("typing stopped");
  });
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  server.listen(PORT, () => {
    console.log("server started on port 3000");
  });
});
