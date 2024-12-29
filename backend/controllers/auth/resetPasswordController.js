const User = require("../../models/User");
const generateOtp = require("../../utils/otp");
const OtpEmailTemplate = require("../../utils/otpEmailTemplate");
const transporter = require("../../config/nodemailerConfig");
const redisClient = require("../../config/redisConfig");
const bcrypt = require("bcryptjs");

const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    const otp = await generateOtp(user?._id);
    const emailTemplate = OtpEmailTemplate(otp);
    transporter
      .sendMail({
        to: email,
        html: emailTemplate,
        subject: "OTP for resetting your chatify account password",
      })
      .then(() =>
        res.status(200).json({ message: "Email has been sent successfully" })
      );
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    if (!otp || isNaN(parseInt(otp)) || otp.length !== 6) {
      return res.status(400).json({ message: "Invalid OTP provided" });
    }

    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(404).json({ message: "Invalid email provided" });
    }

    const key = `user:${user._id}`;

    const fetchOtp = await redisClient.get(key);
    if (!fetchOtp) {
        console.log(fetchOtp)
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (fetchOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP provided" });
    }

    await Promise.all([
      redisClient.del(key),
      redisClient.set(`user:${user._id}`, "valid"),
    ]);

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;
    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Not allowed to reset the password" });
    }
    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      return res.status(400).json({ message: "No such user exists" });
    }

    const isAllowed = await redisClient.get(`user:${user._id}`);
    if (!isAllowed) {
      return res
        .status(403)
        .json({ message: "Not allowed to change the password" });
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashPwd = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashPwd });
    await redisClient.del(`user:${user._id}`)
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = { verifyEmail, verifyOtp, resetPassword };
