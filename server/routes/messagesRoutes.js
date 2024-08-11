const router = require('express').Router();
const { sendMessage, getMessage } = require("../controllers/messagesController");

router.get("/:id", getMessage);
router.post("/send/:id", sendMessage);

module.exports = router;