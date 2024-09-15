const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: []
    }]
}, { timestamps: true });

const Conversations = mongoose.model("Conversation", schema);
module.exports = Conversations
