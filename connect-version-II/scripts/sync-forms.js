/**
 * Copies the Form.io definitions the modules use from the live CMC server
 * (the git app's fetchCollectionData API) into the FormIO collection of the
 * database in MONGO_URI, so forms also open without that server.
 *
 *   npm run sync:forms            only forms missing locally
 *   npm run sync:forms -- --all   refresh every form from the live server
 */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const REQUIRED = require("./form-keys");

(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const { findDefinition, fetchRemote, remoteUrl, clearCache } = require("../services/formio");

    if (!remoteUrl()) {
        console.error("FORMIO_REMOTE_URL is off - nothing to sync from.");
        process.exit(1);
    }

    const refreshAll = process.argv.includes("--all");
    const target = mongoose.connection.db.collection("FormIO");

    console.log(`Copying forms from ${remoteUrl()}fetchCollectionData`);
    console.log(`into ${mongoose.connection.db.databaseName}.FormIO\n`);

    let copied = 0, failed = 0;

    for (const key of Object.keys(REQUIRED)) {

        if (!refreshAll && await findDefinition(key, { remote: false })) {
            console.log(`- ${key.padEnd(30)} already local`);
            continue;
        }

        const definition = await fetchRemote(key);

        if (!definition) {
            failed++;
            console.log(`✗ ${key.padEnd(30)} not received`);
            continue;
        }

        const { _id, ...fields } = definition;

        await target.updateOne(
            { formKey: key },
            { $set: { ...fields, formKey: key }, ...(_id ? { $setOnInsert: { _id } } : {}) },
            { upsert: true }
        );

        copied++;
        console.log(`✓ ${key.padEnd(30)} copied (${definition.components.length} top-level components)`);

    }

    clearCache();

    console.log(`\n${copied} copied, ${failed} not received.`);

    if (failed) console.log("Forms not received still load from the live server when it is reachable. Run again later, or check network / VPN access.");

    await mongoose.disconnect();

    process.exit(failed ? 2 : 0);

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
