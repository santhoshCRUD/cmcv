const mongoose = require("mongoose");

const connectDB = async () => {

    if (!process.env.MONGO_URI) {

        console.error("❌ MONGO_URI is not set.");
        console.error("   Create a file named .env in this folder (copy .env.example) and set, for example:");
        console.error("   MONGO_URI=mongodb://127.0.0.1:27017/cmc_connect_v2");
        process.exit(1);

    }

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

    } catch (error) {

        console.error("❌ MongoDB Connection Failed");

        console.error(error.message);

        process.exit(1);

    }

};

module.exports = connectDB;