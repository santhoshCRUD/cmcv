/**
 * Loads the git code's starting equipment register (the Asset Recycling
 * Committee list that loadAssets() seeded into localStorage) into the
 * Asset collection. Items already present (same code) are skipped, so it
 * is safe to run more than once.
 *
 *   npm run seed:equipment
 */
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const items = require("./data/asset-recycling-list.json");

// Meteor-style id, like insertCollectionData in routes/connectApp.js
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
const meteorId = () => Array.from(crypto.randomBytes(17), b => ALPHABET[b % ALPHABET.length]).join("");

(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const assets = mongoose.connection.db.collection("Asset");
    let added = 0;

    for (const item of items) {

        if (await assets.findOne({ code: item.code })) continue;

        await assets.insertOne({
            _id: meteorId(),
            ...item,
            isDeleted: false,
            added: { userId: "", userName: "Asset Recycling Committee", addedDate: new Date(`${item.addedISO}T00:00:00Z`) }
        });

        added++;

    }

    console.log(`Equipment register: ${added} item(s) added, ${items.length - added} already present.`);

    await mongoose.disconnect();

})().catch(error => {
    console.error(error);
    process.exit(1);
});
