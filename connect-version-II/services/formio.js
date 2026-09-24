const mongoose = require("mongoose");
const live = require("./live-source");


// =====================================================
// FORM.IO DEFINITION LOOKUP
//
// Every form is a Form.io definition stored in the FormIO
// collection and found by its formKey (git: fetchCollectionData
// { collection: "FormIO", query: { formKey } }). Local copies of
// that collection differ in small ways, so the lookup is tolerant:
//
//   - collection name in any case: FormIO, formIO, formio, ...
//   - formKey matched exactly, then ignoring case / spaces
//   - the database in MONGO_URI first, then FORMIO_DB (if set),
//     then any other database on the same server
//   - definitions stored under a nested field (form, schema,
//     definition, formJson, ...) are unwrapped to { components }
//   - not in any local database: fetched from the live CMC server,
//     exactly as the git app does (utils.js globalUrl +
//     fetchCollectionData). CMC_LIVE_URL (or FORMIO_REMOTE_URL for
//     forms only) overrides the address; "off" turns this off.
// =====================================================

const NESTED_FIELDS = ["form", "schema", "definition", "formJson", "formDefinition", "json", "formio", "formIO", "data"];

const cache = new Map();
let collectionsPromise = null;
let lastReport = "";


function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isFormioName(name) {
    return /^form[_-]?io$/i.test(name);
}

// FormIO-like collections, database in MONGO_URI first.
async function formCollections() {

    if (!collectionsPromise) {

        collectionsPromise = (async () => {

            const client = mongoose.connection.getClient();
            const primary = mongoose.connection.db;
            const dbNames = [primary.databaseName];

            if (process.env.FORMIO_DB) dbNames.push(process.env.FORMIO_DB);

            try {
                const { databases } = await client.db("admin").admin().listDatabases({ nameOnly: true });
                databases.map(d => d.name).filter(n => !["admin", "local", "config"].includes(n)).forEach(n => dbNames.push(n));
            } catch (error) {
                // Not allowed to list databases - the primary (and FORMIO_DB) will do.
            }

            const found = [];

            for (const dbName of [...new Set(dbNames)]) {

                try {
                    const db = client.db(dbName);
                    const names = (await db.listCollections({}, { nameOnly: true }).toArray()).map(c => c.name);
                    names.filter(isFormioName)
                        .sort((a, b) => (b === "FormIO") - (a === "FormIO"))
                        .forEach(name => found.push({ dbName, name, collection: db.collection(name) }));
                } catch (error) {
                    console.warn(`[FORMIO][WARN] Can't read database ${dbName}: ${error.message}`);
                }

            }

            // Log only when the answer changes (lookups re-scan after a miss).
            const report = found.map(f => `${f.dbName}.${f.name}`).join(", ");

            if (report !== lastReport || !found.length && !lastReport) {
                if (!found.length) {
                    if (lastReport !== null) console.warn("[FORMIO][WARN] No FormIO collection found in any database on this connection.");
                    lastReport = null;
                } else {
                    console.log(`[FORMIO][INFO] Form definitions read from: ${report}`);
                    lastReport = report;
                }
            }

            return found;

        })().catch(error => {
            collectionsPromise = null;
            throw error;
        });

    }

    return collectionsPromise;

}

// Return a definition with a components array, unwrapping nested storage.
function normalize(doc) {

    if (!doc) return null;

    if (Array.isArray(doc.components) && doc.components.length) return doc;

    for (const field of NESTED_FIELDS) {

        let value = doc[field];

        if (typeof value === "string") {
            try { value = JSON.parse(value); } catch (error) { value = null; }
        }

        if (value && typeof value === "object" && Array.isArray(value.components) && value.components.length) {
            return { ...value, _id: doc._id, formKey: doc.formKey };
        }

    }

    return null;

}

function remoteUrl() {
    return live.normalizeUrl(process.env.FORMIO_REMOTE_URL ?? process.env.CMC_LIVE_URL ?? live.DEFAULT_URL);
}

// Same request the git app sends: POST fetchCollectionData, no auth.
async function fetchRemote(formKey) {

    const base = remoteUrl();

    if (!base) return null;

    try {

        const docs = live.rowsOf(await live.post("fetchCollectionData", { collection: "FormIO", query: { formKey } }, { base, cacheable: false }));

        docs.sort((a, b) => (String(a.isDeleted) === "true") - (String(b.isDeleted) === "true"));

        for (const doc of docs) {
            const definition = normalize(doc);
            if (definition) return definition;
        }

        return null;

    } catch (error) {

        console.warn(`[FORMIO][WARN] "${formKey}": ${error.message}`);

        return null;

    }

}

async function findLocal(key) {

    const collections = await formCollections();
    const loose = new RegExp(`^\\s*${escapeRegex(key).replace(/\s+/g, "\\s*")}\\s*$`, "i");

    for (const { collection, dbName, name } of collections) {

        const candidates = [
            ...(await collection.find({ formKey: key }).limit(5).toArray()),
            ...(await collection.find({ formKey: loose }).limit(5).toArray())
        ];

        // Prefer live (not deleted) documents.
        candidates.sort((a, b) => (String(a.isDeleted) === "true") - (String(b.isDeleted) === "true"));

        for (const doc of candidates) {

            const definition = normalize(doc);

            if (definition) return definition;

            console.warn(`[FORMIO][WARN] ${dbName}.${name} has formKey "${doc.formKey}" but no components to render.`);

        }

    }

    return null;

}

// options.remote = false: local databases only (used by sync:forms).
async function findDefinition(formKey, options = {}) {

    const key = String(formKey || "").trim();

    if (!key) return null;

    if (options.remote !== false && cache.has(key)) return cache.get(key);

    const definition = (await findLocal(key)) || (options.remote === false ? null : await fetchRemote(key));

    if (definition) {
        if (options.remote !== false) cache.set(key, definition);
        return definition;
    }

    // Not found: look again next time (the collection may be imported meanwhile).
    collectionsPromise = null;

    return null;

}

async function listFormKeys() {

    const collections = await formCollections();
    const keys = [];

    for (const { collection, dbName, name } of collections) {
        const docs = await collection.find({}, { projection: { formKey: 1 } }).toArray();
        docs.forEach(d => keys.push({ formKey: d.formKey, source: `${dbName}.${name}` }));
    }

    return keys;

}

function clearCache() {
    cache.clear();
    collectionsPromise = null;
}


module.exports = { findDefinition, fetchRemote, remoteUrl, listFormKeys, formCollections, clearCache };
