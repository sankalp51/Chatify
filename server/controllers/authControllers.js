const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "username and password required" });
        const existingUser = await User.findOne({ username }).lean().exec();
        if (!existingUser) return res.status(401).json({ message: "user does not exist" });

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid password" });

        const accessToken = jwt.sign(
            { username: existingUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15hr" }
        );

        const refreshToken = jwt.sign(
            { username: existingUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        await User.findOneAndUpdate({ username }, { refreshToken }).lean().exec();
        res.cookie("chatapptoken", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken, user: username });


    } catch (error) {
        next(error);
    }
}

const signUp = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "username and password required" });

        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate) return res.status(409).json({ message: "user already exists" });

        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashPwd });
        await newUser.save();
        res.status(201).json({ message: "Registration successfull!" });
    } catch (error) {
        next(error);
    }
}

const logOut = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        if (!cookie.chatapptoken) return res.sendStatus(204);
        const refreshToken = cookie.chatapptoken;

        const foundUser = await User.findOne({ refreshToken }).lean().exec();
        if (!foundUser) {
            res.clearCookie("chatapptoken", { httpOnly: true, sameSite: "None", secure: true });
            return res.sendStatus(204);
        }
        await User.findOneAndUpdate({ refreshToken }, "").lean().exec();
        res.clearCookie("chatapptoken", { httpOnly: true, sameSite: "None", secure: true });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

module.exports = { logIn, signUp, logOut };