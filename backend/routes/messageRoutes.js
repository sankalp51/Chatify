const router = require("express").Router();
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");

router.post("/new-message", sendMessage);
router.get("/get-message/:chatId", allMessages);

module.exports = router;
