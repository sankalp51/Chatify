const User = require("../model/User");

const getUsers = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const filteredUsers = await User.find({ username: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        next(error);
    }
}

module.exports = getUsers;