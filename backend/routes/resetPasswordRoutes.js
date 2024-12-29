const router = require("express").Router();
const {
  verifyEmail,
  verifyOtp,
  resetPassword,
} = require("../controllers/auth/resetPasswordController");

router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtp);
router.patch("/reset-password", resetPassword);
module.exports = router;
