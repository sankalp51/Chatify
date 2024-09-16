const rateLimit = require("express-rate-limit");

const limit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

module.exports = limit;
