const crypto = require("crypto");
const redisClient = require("../config/redisConfig");

const generateOtp = async (id) => {
  try {
    // Generate a 6-digit OTP
    let otp = "";
    while (otp.length !== 6) {
      const randomInt = crypto.randomInt(0, 10);
      if (!otp.includes(randomInt)) {
        otp += randomInt;
      }
    }

    const ttl = 120;
    await redisClient.set(`user:${id}`, otp, "EX", ttl);
    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error.message);
    throw new Error("Failed to generate OTP");
  }
};

module.exports = generateOtp;
