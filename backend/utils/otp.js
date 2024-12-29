const crypto = require("crypto");
const redisClient = require("../config/redisConfig");

const generateOtp = async (id) => {
  try {
    let otp = "";
    while (otp.length !== 6) {
      let randomInt = crypto.randomInt(0, 10);
      if (!otp.includes(randomInt)) {
        otp += randomInt;
      }
    }
    await redisClient.set(``);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = generateOtp;
