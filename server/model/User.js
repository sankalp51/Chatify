const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    refreshToken: String
},
    { timestamps: true }
);

const User = mongoose.model("User", schema);
module.exports = User;