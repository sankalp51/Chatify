const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
},
    { timestamps: true }
);

const User = mongoose.model("User",schema);
module.exports = User;