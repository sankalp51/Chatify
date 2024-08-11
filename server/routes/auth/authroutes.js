const router = require('express').Router();
const refreshTokenHandler = require('../../controllers/refreshTokenController');
const authControllers = require("../../controllers/authControllers");

router.post("/login", authControllers.logIn);
router.post("/register", authControllers.signUp);
router.get("/logout", authControllers.logOut);
router.get("/refresh", refreshTokenHandler);

module.exports = router;