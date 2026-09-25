/**
 * Checks that the database in MONGO_URI has the Form.io definitions the
 * modules load from the FormIO collection (by formKey), and points at
 * likely alternatives when they are missing.
 *
 *   npm run check:forms
 */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { FORM_KEYS: REQUIRED } = require("../config/collections");

(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const { formCollections, findDefinition, fetchRemote, remoteUrl, listFormKeys } = require("../services/formio");

    console.log(`Database in MONGO_URI: ${mongoose.connection.db.databaseName}`);

    const collections = await formCollections();

    if (!collections.length) {
        console.log("\n✗ No FormIO collection (any capitalisation) was found in any database on this server.");
        console.log("  Forms will be fetched from the live CMC server instead (see below). To keep a local copy,");
        console.log("  run: npm run sync:forms");
    } else {
        console.log(`Form definitions read from: ${collections.map(c => `${c.dbName}.${c.name}`).join(", ")}`);
    }

    console.log(`Live server fallback: ${remoteUrl() ? `${remoteUrl()}fetchCollectionData` : "off (FORMIO_REMOTE_URL=off)"}`);
    console.log("");

    let missing = 0;

    for (const [key, used] of Object.entries(REQUIRED)) {
        let definition = await findDefinition(key, { remote: false });
        let source = "local";
        if (!definition) {
            definition = await fetchRemote(key);
            source = "live server";
        }
        if (!definition) missing++;
        console.log(`${definition ? "✓" : "✗"} ${key.padEnd(30)} ${used}${definition ? ` (${source}, ${definition.components.length} top-level components)` : ""}`);
    }

    if (missing) {
        const all = await listFormKeys();
        console.log(`\n${missing} form definition(s) not found. formKeys in the local database:`);
        console.log("  " + (all.map(k => k.formKey).filter(Boolean).sort().join(", ") || "(none)"));
        if (remoteUrl()) console.log("\nIf the live server could not be reached, check this computer's network / VPN access to it.");
    } else {
        console.log("\nAll form definitions found.");
    }

    await mongoose.disconnect();

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
