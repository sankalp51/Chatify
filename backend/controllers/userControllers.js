const User = require("../models/User");

const allUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user } })
      .select("-refreshToken -password");
    if (!users?.length) {
      return res.status(404).json({ message: "no users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { allUsers };
