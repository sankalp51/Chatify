const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleFileUpload = async (file, path) => {
  try {
    const res = await cloudinary.uploader.upload(
      file, // Replace with the file path
      {
        transformation: [
          { width: 1200, height: 800, crop: "limit" }, // Resize the image
          { quality: "auto" }, // Adjust quality dynamically
          { fetch_format: "auto" }, // Automatically select format
        ],
        folder: path,
      }
    );
    return res;
  } catch (error) {
    throw new Error(error);
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
