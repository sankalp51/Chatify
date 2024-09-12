const express = require('express');
const path = require('path');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { corsConfig } = require("./config/corsConfig");
const cors = require('cors');
const connectDb = require('./config/db');
const verifyJwt = require('./middlewares/verifyJwt');
const { default: mongoose } = require('mongoose');
const authRoutes = require("./routes/auth/authroutes");
const messagesRoutes = require("./routes/messagesRoutes");
const userRoutes = require('./routes/userRoutes');
const credentials = require("./middlewares/credentials");
const errorHandler = require('./middlewares/errorHandler');
const { app, server } = require('./socket/socket');


//db connection
connectDb(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3000;

//middlewares
app.use(credentials);
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(errorHandler);

app.get("/", (req, res) => {
    if (req.accepts("html")) {
        res.status(200).sendFile(path.join(__dirname, "views", "hello.html"));
    } else if (req.accepts("json")) {
        res.status(200).json({ message: "welcome to the chat app API" });
    } else {
        res.type("text").status(200).send("welcome to the chat app API");
    }
});

//auth routes
app.use("/api/auth", authRoutes);

//protected routes
app.use("/api/messages", verifyJwt, messagesRoutes);
app.use("/api/users", verifyJwt, userRoutes);

app.all("*", (req, res) => {
    if (req.accepts('html')) {
        return res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        return res.status(404).json({ message: "404 not found" });
    }
    return res.type("text").status(404).send("404 not found");
});

mongoose.connection.once("open", () => {
    server.listen(PORT, () => {
        console.log("server started on port 3000");
    });

});
