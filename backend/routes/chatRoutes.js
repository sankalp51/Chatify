const router = require("express").Router();
const {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");

router.post("/create-chat", createChat);
router.get("/get-chats", fetchChats);
router.post("/create-group", createGroupChat);
router.patch("/rename-group", renameGroup);
router.patch("/remove-member", removeFromGroup);
router.post("/add-member", addToGroup);

module.exports = router;
