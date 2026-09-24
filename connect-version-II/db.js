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

        reportDataSources().catch(() => {});

    } catch (error) {

        console.error("❌ MongoDB Connection Failed");

        console.error(error.message);

        process.exit(1);

    }

};

// One line on where module data comes from (see config/collections.js).
async function reportDataSources() {

    const { COLLECTIONS } = require("./config/collections");
    const { liveUrl } = require("./services/live-source");

    const local = new Set((await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name));
    const names = Object.keys(COLLECTIONS);
    const missing = names.filter(name => !local.has(name));

    if (!missing.length) {
        console.log(`📦 All ${names.length} collections are in the local database.`);
    } else if (liveUrl()) {
        console.log(`📦 ${names.length - missing.length} of ${names.length} collections are local; the other ${missing.length} are read from the live CMC server (npm run check:data / sync:data).`);
    } else {
        console.log(`⚠️  ${missing.length} of ${names.length} collections are not in the local database and CMC_LIVE_URL is off, so those modules will be empty (npm run check:data).`);
    }

}

module.exports = connectDB;