const jwt = require('jsonwebtoken');
const User = require("../model/User");

const handleRefreshToken = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        if (!cookie?.chatifyToken) return res.sendStatus(401);

        const refreshToken = cookie.chatifyToken;
        const user = await User.findOne({ refreshToken }).lean().exec();
        if (!user) return res.sendStatus(403);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.username !== decoded.username) return res.sendStatus(403);
                const accessToken = jwt.sign(
                    { username: decoded.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "15hr" }
                );
                res.json({ accessToken, user: decoded.username, id: user._id, profilePic: user.profilePic });
            }
        )
    } catch (error) {
        next(error);
    }
}

module.exports = handleRefreshToken;