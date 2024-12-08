const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { handleFileUpload } = require("../../config/cloudinaryConfig");

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

    await User.findOneAndUpdate({ email }, { refreshToken }).lean().exec();

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
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate request data
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // Validate email and password
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email) || password.length !== 8) {
      return res
        .status(400)
        .json({
          message: "Invalid email or password length must be 8 characters",
        });
    }

    if (password.trim() !== confirmPassword.trim()) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email }).lean().exec();
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    let profilePicDataURI;
    let cloudRes;


    if (req.file) {
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 300 }) 
        .jpeg({ quality: 80 })
        .toBuffer();

      const b64 = compressedBuffer.toString("base64");
      profilePicDataURI = `data:${req.file.mimetype};base64,${b64}`;

      cloudRes = await handleFileUpload(
        profilePicDataURI,
        "chatify/profile-pics"
      );
    }

    // Hash the password
    const hashPwd = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashPwd,
      profilePic: {
        url: cloudRes?.secure_url || null, // Use Cloudinary's URL if available
        id: cloudRes?.public_id || null, // Use Cloudinary's public ID if available
      },
    });

    await newUser.save();

    res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.chatifyToken) {
      return res.sendStatus(201);
    }

    const refreshToken = cookies?.chatifyToken;
    const user = await User.findOne({ refreshToken }).lean().exec();
    if (!user) {
      res.clearCookie("chatifyToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(201);
    }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" })
      .lean()
      .exec();
    res.clearCookie("chatifyToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, logout };
