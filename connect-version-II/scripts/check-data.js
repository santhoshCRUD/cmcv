/**
 * Shows, for every collection the modules use (config/collections.js),
 * whether it is in the local database or read from the live CMC server.
 *
 *   npm run check:data
 */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { COLLECTIONS } = require("../config/collections");
const live = require("../services/live-source");

(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection.db;
    const local = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name));

    console.log(`Database in MONGO_URI: ${db.databaseName}`);
    console.log(`Live CMC server: ${live.liveUrl() || "off (CMC_LIVE_URL=off)"}\n`);

    let reachable = null;
    const missing = [];

    for (const [name, info] of Object.entries(COLLECTIONS)) {

        let status;

        if (local.has(name)) {

            status = `local, ${await db.collection(name).estimatedDocumentCount()} record(s)`;

        } else if (!live.liveUrl()) {

            status = "✗ not local (live server off)";
            missing.push(name);

        } else {

            // One probe tells whether the live server answers at all.
            if (reachable === null) {
                try {
                    await live.post("fetchCollectionData", { collection: "MissionSpecializations", query: {}, options: { limit: 1 } }, { cacheable: false });
                    reachable = true;
                } catch (error) {
                    reachable = false;
                    console.log(`(${error.message})\n`);
                }
            }

            status = reachable ? "live server" : "✗ not local, live server unreachable";
            if (!reachable) missing.push(name);

        }

        console.log(`${status.startsWith("✗") ? "" : "✓ "}${name.padEnd(28)} ${info.module.padEnd(38)} ${status}`);

    }

    if (missing.length) {
        console.log(`\n${missing.length} collection(s) have no data source, so those modules show empty pages.`);
        console.log("Connect to a network that can reach the CMC server (campus / VPN), then run: npm run sync:data");
    } else if (reachable) {
        console.log("\nCollections marked 'live server' are read from the CMC server. To keep local copies: npm run sync:data");
    }

    await mongoose.disconnect();

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
