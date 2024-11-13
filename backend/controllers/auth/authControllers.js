const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Invalid data" });

    const emailRegex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "invalid data" });

    const user = await User.findOne({ email }).lean().exec();
    if (!user) return res.status(404).json({ message: "No user found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "invalid password" });

    delete user.password;
    delete user.refreshToken;

    const accessToken = jwt.sign(
      { userInfo: { ...user } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userInfo: { ...user } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "15d" }
    );

    res.cookie("chatifyToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { fname, lname, email, password, confirmPassword } = req.body;
    if (!fname || !lname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const emailRegex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email) || password.length === 8) {
      return res.status(400).json({ message: "invalid data" });
    }

    const userExists = await User.findOne({ email }).lean().exec();
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPwd = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      firstName: fname,
      lastName: lname,
      password: hashPwd,
    });

    await newUser.save();
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register };
