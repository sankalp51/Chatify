const { createTransport } = require("nodemailer");
require("dotenv").config();

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "sankalp.kalangutkar31@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

module.exports = transporter;
