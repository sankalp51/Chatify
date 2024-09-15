const Conversations = require('../model/Conversations');
const Message = require("../model/Message");
const User = require('../model/User'); 
const { getRecieverSokcetId, io } = require('../socket/socket');

const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: recipientId } = req.params;  
        const username = req.user;  

        const sender = await User.findOne({ username });
        const recipient = await User.findById(recipientId); 

        if (!sender || !recipient) {
            return res.status(404).json({ error: "User not found" });
        }

        let conversation = await Conversations.findOne({
            participants: { $all: [sender._id, recipient._id] }
        });

        if (!conversation) {
            conversation = await Conversations.create({
                participants: [sender._id, recipient._id]
            });
        }

        const newMessage = new Message({
            sender: sender._id,
            receiver: recipient._id,
            message
        });

        conversation.messages.push(newMessage);

        await Promise.all([conversation.save(), newMessage.save()]);

        const recipientSocketId = getRecieverSokcetId(recipient._id);
        const senderSocketId = getRecieverSokcetId(sender._id);
        
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};




const getMessage = async (req, res, next) => {
    try {
        const { id: recipientId } = req.params;  // Assuming 'id' is the recipient's ObjectId (or username)
        const username = req.user;  // The sender's username

        // Find the sender and recipient by their username or ObjectId
        const sender = await User.findOne({ username });
        const recipient = await User.findById(recipientId);  // Assuming 'id' is the recipient's ObjectId

        if (!sender || !recipient) {
            return res.status(404).json({ error: "User not found" });
        }

        // Query conversations by participants' _id
        const conversation = await Conversations.findOne({
            participants: { $all: [sender._id, recipient._id] }
        }).populate('messages');

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);
    } catch (error) {
        next(error);
    }
};


module.exports = { sendMessage, getMessage };