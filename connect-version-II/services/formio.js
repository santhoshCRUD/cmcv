const mongoose = require("mongoose");


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
// =====================================================

const NESTED_FIELDS = ["form", "schema", "definition", "formJson", "formDefinition", "json", "formio", "formIO", "data"];

const cache = new Map();
let collectionsPromise = null;


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

            if (!found.length) {
                console.warn("[FORMIO][WARN] No FormIO collection found in any database on this connection.");
            } else {
                console.log(`[FORMIO][INFO] Form definitions read from: ${found.map(f => `${f.dbName}.${f.name}`).join(", ")}`);
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

async function findDefinition(formKey) {

    const key = String(formKey || "").trim();

    if (!key) return null;

    if (cache.has(key)) return cache.get(key);

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

            if (definition) {
                cache.set(key, definition);
                return definition;
            }

            console.warn(`[FORMIO][WARN] ${dbName}.${name} has formKey "${doc.formKey}" but no components to render.`);

        }

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


module.exports = { findDefinition, listFormKeys, formCollections, clearCache };
