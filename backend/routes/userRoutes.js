const router = require("express").Router();
const { allUsers } = require("../controllers/userControllers");

router.get("/all-users", allUsers);

module.exports = router;
