const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleFileUpload = async (file, path) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      timeout: 65000,
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      folder: path,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const handleFileDelete = async (public_id) => {
  try {
    const res = await cloudinary.uploader.destroy(public_id);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { handleFileUpload, handleFileDelete };
