const router = require("express").Router();
const { getMessage } = require("../controllers/messagesController");

router.get("/:id", getMessage);

module.exports = router;
