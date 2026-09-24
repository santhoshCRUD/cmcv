/**
 * Copies every collection the original CMC V Connect uses
 * (config/collections.js) from the live CMC server into the database in
 * MONGO_URI, then the Form.io definitions (sync:forms).
 *
 *   npm run sync:data                       collections missing locally
 *   npm run sync:data -- --refresh          also update collections already local
 *                                           (same _id is replaced, local-only records stay)
 *   npm run sync:data -- --only A,B         just these collections
 *   npm run sync:data -- --skip A,B         all but these
 *
 * Until a collection is copied, the app reads it from the live server
 * directly (routes/connectApp.js). Personal records ("students") are never
 * copied.
 */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { COLLECTIONS, SYNC_COLLECTIONS } = require("../config/collections");
const live = require("../services/live-source");
const { syncForms } = require("./sync-forms");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const OBJECT_ID = /^[a-f0-9]{24}$/i;
const BATCH = 500;


function arg(name) {
    const index = process.argv.indexOf(name);
    return index > -1 ? String(process.argv[index + 1] || "").split(",").map(s => s.trim()).filter(Boolean) : null;
}

// JSON from the live API -> BSON types the modules query by
// (dates compared with $gt / $gte, ObjectId _ids of the "InDB" collections).
function revive(value) {

    if (Array.isArray(value)) return value.map(revive);

    if (value && typeof value === "object") {

        const keys = Object.keys(value);

        if (keys.length === 1 && keys[0] === "$date") return new Date(value.$date);
        if (keys.length === 1 && keys[0] === "$oid" && OBJECT_ID.test(value.$oid)) return new mongoose.Types.ObjectId(value.$oid);

        const out = {};
        keys.forEach(key => { out[key] = revive(value[key]); });
        return out;

    }

    if (typeof value === "string" && ISO_DATE.test(value)) return new Date(value);

    return value;

}

async function fetchAll(name) {

    const endpoint = COLLECTIONS[name].endpoint || "fetchCollectionData";
    const body = { collection: name, query: {} };

    if (endpoint === "fetchCollectionDataFromDB") body.queryType = "standard";

    return live.rowsOf(await live.post(endpoint, body, { cacheable: false, timeout: 120000 }));

}


(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    if (!live.liveUrl()) {
        console.error("CMC_LIVE_URL is off - nothing to sync from.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection.db;
    const refresh = process.argv.includes("--refresh");
    const only = arg("--only");
    const skip = arg("--skip") || [];

    const unknown = (only || []).filter(name => !SYNC_COLLECTIONS.includes(name));

    if (unknown.length) {
        console.error(`Not a syncable collection: ${unknown.join(", ")}\nSyncable: ${SYNC_COLLECTIONS.join(", ")}`);
        process.exit(1);
    }

    const names = (only || SYNC_COLLECTIONS).filter(name => !skip.includes(name));
    const local = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name));

    console.log(`Copying from ${live.liveUrl()} into ${db.databaseName}\n`);

    let copied = 0, failed = 0, skipped = 0;

    for (const name of names) {

        if (local.has(name) && !refresh) {
            skipped++;
            console.log(`- ${name.padEnd(28)} already local (use --refresh to update)`);
            continue;
        }

        try {

            const rows = (await fetchAll(name)).map(revive);

            rows.forEach(row => {
                if (typeof row._id === "string" && OBJECT_ID.test(row._id)) row._id = new mongoose.Types.ObjectId(row._id);
            });

            const withId = rows.filter(row => row._id !== undefined && row._id !== null);

            for (let i = 0; i < withId.length; i += BATCH) {
                await db.collection(name).bulkWrite(withId.slice(i, i + BATCH).map(row => ({
                    replaceOne: { filter: { _id: row._id }, replacement: row, upsert: true }
                })), { ordered: false });
            }

            // Create the collection even when empty, so the app reads it locally from now on.
            if (!withId.length && !local.has(name)) await db.createCollection(name).catch(() => {});

            copied++;
            console.log(`✓ ${name.padEnd(28)} ${withId.length} record(s)${rows.length !== withId.length ? `, ${rows.length - withId.length} without _id skipped` : ""}`);

        } catch (error) {

            failed++;
            console.log(`✗ ${name.padEnd(28)} ${error.message}`);

        }

    }

    console.log(`\nCollections: ${copied} copied, ${skipped} already local, ${failed} failed.\n`);

    const forms = only ? { copied: 0, failed: 0 } : await syncForms({ refreshAll: refresh });

    if (!only) console.log(`\nForms: ${forms.copied} copied, ${forms.failed} not received.`);

    if (failed || forms.failed) {
        console.log("\nAnything not copied is still read from the live server while it is reachable.");
        console.log("If the server could not be reached, check this computer's network / VPN access and run again.");
    }

    await mongoose.disconnect();

    process.exit(failed || forms.failed ? 2 : 0);

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
