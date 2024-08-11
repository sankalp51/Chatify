const Conversations = require('../model/Conversations');
const Message = require("../model/Message");

const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id } = req.params;
        const username = req.user;

        let conversation = await Conversations.findOne({ participants: { $all: [username, id] } });

        if (!conversation) {
            conversation = await Conversations.create({
                participants: [username, id]
            });
        }

        const newMessage = new Message({
            sender: username,
            reciever: id,
            message

        });

        if (newMessage) conversation.messages.push(newMessage);
        //socket io functionality will go here
        await Promise.all([conversation.save(), newMessage.save()]);
    } catch (error) {
        next(error);
    }
}

const getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const username = req.user;

        const conversation = await Conversations.findOne({
            participants: {
                $all: [username, id]
            }
        }).populate("Messages");

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);
    } catch (error) {
        next(error);
    }
}

module.exports = { sendMessage, getMessage };