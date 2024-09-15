const Conversations = require('../model/Conversations');
const User = require('../model/User'); 


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


module.exports = { getMessage };