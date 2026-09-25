/**
 * Copies the Form.io definitions the modules use from the live CMC server
 * (the git app's fetchCollectionData API) into the FormIO collection of the
 * database in MONGO_URI, so forms also open without that server.
 *
 *   npm run sync:forms            only forms missing locally
 *   npm run sync:forms -- --all   refresh every form from the live server
 *
 * Also run by `npm run sync:data`.
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { FORM_KEYS } = require("../config/collections");


async function syncForms({ refreshAll = false } = {}) {

    const { findDefinition, fetchRemote, remoteUrl, clearCache } = require("../services/formio");

    if (!remoteUrl()) {
        console.log("The live CMC server is turned off - forms not synced.");
        return { copied: 0, failed: 0 };
    }

    const target = mongoose.connection.db.collection("FormIO");

    console.log(`Forms: ${remoteUrl()}fetchCollectionData -> ${mongoose.connection.db.databaseName}.FormIO`);

    let copied = 0, failed = 0;

    for (const key of Object.keys(FORM_KEYS)) {

        if (!refreshAll && await findDefinition(key, { remote: false })) {
            console.log(`- ${key.padEnd(30)} already local`);
            continue;
        }

        const definition = await fetchRemote(key);

        if (!definition) {
            if (fs.existsSync(path.join(__dirname, "..", "vendor", "forms", `${key}.json`))) {
                console.log(`- ${key.padEnd(30)} not received, the bundled copy in vendor/forms is used`);
            } else {
                failed++;
                console.log(`✗ ${key.padEnd(30)} not received`);
            }
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

    return { copied, failed };

}


if (require.main === module) {

    (async () => {

        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is not set (see .env.example).");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);

        const { copied, failed } = await syncForms({ refreshAll: process.argv.includes("--all") });

        console.log(`\n${copied} copied, ${failed} not received.`);

        if (failed) console.log("Forms not received still load from the live server when it is reachable. Run again later, or check network / VPN access.");

        await mongoose.disconnect();

        process.exit(failed ? 2 : 0);

    })().catch(error => {
        console.error(error.message);
        process.exit(1);
    });

}

module.exports = { syncForms };
