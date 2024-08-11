const mongoose = require("mongoose");

async function connectDb(url) {
    try {
        await mongoose.connect(url);
        console.log("successfully connected to database")
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDb;