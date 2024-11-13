const router = require("express").Router();
const {
  login,
  register,
  logout,
} = require("../../controllers/auth/authControllers");
const refreshTokenController = require("../../controllers/auth/refreshTokenController");

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/refresh", refreshTokenController);

module.exports = router;
