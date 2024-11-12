const express = require("express");
const cors = require("cors");
const { corsConfig } = require("./config/corsConfig");
const connectDb = require("./config/db");
const mongoose = require("mongoose");
const credentials = require("./middlewares/credentials");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDb(process.env.DATABASE_URL);
app.use(credentials);
app.use(cors(corsConfig));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello world");
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("server started on port 3000");
  });
});
