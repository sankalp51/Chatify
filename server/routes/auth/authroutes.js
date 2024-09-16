const router = require("express").Router();
const refreshTokenHandler = require("../../controllers/refreshTokenController");
const authControllers = require("../../controllers/authControllers");
const limit = require("../../middlewares/rateLimit");

router.post("/login", authControllers.logIn);
router.post("/register", limit, authControllers.signUp);
router.get("/logout", authControllers.logOut);
router.get("/refresh", refreshTokenHandler);

module.exports = router;
