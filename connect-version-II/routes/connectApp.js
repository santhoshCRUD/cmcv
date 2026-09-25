const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { verifyJWT } = require("../auth-guard");

const router = express.Router();


// =====================================================
// CONNECT APP DATA API
//
// Version II replacement for the legacy
//   POST https://academics.cmcvellore.edu.in/api/connectApp/<requestType>
// that the original CMC V Connect front-end (git: santhoshCRUD/cmcv,
// utils.js -> fetchCollectionData) calls.
//
// Same request/response contract so the module logic can be
// ported unchanged:
//
//   fetchCollectionData / fetchCollectionDataFromDB
//     body: { collection, query, projection?, sort?, options?: { sort, limit, skip, projection } }
//           (or an array of those)
//     resp: { success, collection, count, data: [...] }
//
//   insertCollectionData / insertCollectionDataInDB
//     body: { collection, query: <document> }
//
//   updateCollectionData / updateCollectionDataInDB
//     body: { collection, query: { selector, data: { $set | $push | ... } } }
//
// Differences from the legacy server (intentional):
//   - requires a valid JWT (verifyJWT), the legacy API was open
//   - collections must be on an allowlist, and writes have
//     their own (smaller) allowlist
//   - server-side JS / pipeline-escape operators are rejected
//   - a collection that is not in the local database (yet) is
//     read from the live CMC server instead, with the same
//     access rules applied first; writes always stay local
//     (services/live-source.js, npm run sync:data)
// =====================================================


// -----------------------------------------------------
// Collections the front-end may read / write: every
// collection the git code references, listed with its
// module in config/collections.js. "users" is
// intentionally NOT there (see routes/auth.js).
// -----------------------------------------------------

const { READ_COLLECTIONS, WRITE_COLLECTIONS } = require("../config/collections");
const live = require("../services/live-source");


// Writes that need a role (reads of these stay open).
const WRITE_ROLE_RULES = {
    Asset: ["Missions"]
};


// Collections that only accept specific update operations.
// missionHospital: students add their journey feedback
// (initFeedbackForm in the git code) and nothing else.
const UPDATE_ONLY = {
    missionHospital: { $push: ["studentFeedback"] }
};


// -----------------------------------------------------
// Collections restricted to specific roles.
// The Council section is "accessible only to Council
// members" (views/council.html in the git code).
// -----------------------------------------------------

const ROLE_RULES = {
    CouncilMembers: ["Council Member"],
    HeadOfOrganization: ["Council Member"]
};


// -----------------------------------------------------
// Collections a user may only read their own records of.
// "students" holds personal data; the git code queries it
// by the signed-in student's admissionNo only
// (loadServiceCommitPage) and never reads academic,
// bills, schedules or eventAttendance.
// -----------------------------------------------------

const OWNER_SCOPES = {
    students: {
        filter: user => ({ admissionNo: user.admissionNo || "\u0000" }),
        exclude: { academic: 0, bills: 0, schedules: 0, eventAttendance: 0 }
    }
};


const FORBIDDEN_OPERATORS = new Set([
    "$where",
    "$function",
    "$accumulator",
    "$out",
    "$merge"
]);

const UPDATE_OPERATORS = new Set([
    "$set",
    "$unset",
    "$push",
    "$pull",
    "$addToSet",
    "$inc"
]);

const MAX_LIMIT = 10000;

const ISO_DATE =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;


// =====================================================
// HELPERS
// =====================================================

function httpError(status, message) {

    const error = new Error(message);

    error.status = status;

    return error;

}


// Rejects server-side JS and similar operators anywhere
// in a query / projection / update document.
function assertSafe(value, path = "") {

    if (Array.isArray(value)) {

        value.forEach((item, index) => assertSafe(item, `${path}[${index}]`));

        return;

    }

    if (value && typeof value === "object") {

        Object.keys(value).forEach(key => {

            if (FORBIDDEN_OPERATORS.has(key)) {
                throw httpError(400, `Operator ${key} is not allowed`);
            }

            assertSafe(value[key], path ? `${path}.${key}` : key);

        });

    }

}


// Extended-JSON revival: { "$date": ... } -> Date,
// { "$oid": ... } -> ObjectId. When reviveIsoStrings is
// set (writes), plain ISO-8601 strings become Dates too,
// because JSON.stringify(new Date()) on the client turns
// fields like added.addedDate into strings.
function revive(value, reviveIsoStrings) {

    if (Array.isArray(value)) {
        return value.map(item => revive(item, reviveIsoStrings));
    }

    if (value && typeof value === "object") {

        const keys = Object.keys(value);

        if (keys.length === 1 && keys[0] === "$date") {
            return new Date(value.$date);
        }

        if (keys.length === 1 && keys[0] === "$oid" && mongoose.isValidObjectId(value.$oid)) {
            return new mongoose.Types.ObjectId(value.$oid);
        }

        const out = {};

        keys.forEach(key => {
            out[key] = revive(value[key], reviveIsoStrings);
        });

        return out;

    }

    if (reviveIsoStrings && typeof value === "string" && ISO_DATE.test(value)) {
        return new Date(value);
    }

    return value;

}


// Legacy (Meteor) collections use random string _ids,
// newer "InDB" collections use ObjectIds. Match either
// when the client sends a 24-hex string.
function idVariants(id) {

    if (typeof id === "string" && /^[a-f0-9]{24}$/i.test(id)) {
        return [id, new mongoose.Types.ObjectId(id)];
    }

    return [id];

}

function normalizeIdFilter(filter) {

    if (!filter || typeof filter !== "object" || Array.isArray(filter)) {
        return filter;
    }

    const out = { ...filter };

    ["$or", "$and", "$nor"].forEach(op => {
        if (Array.isArray(out[op])) {
            out[op] = out[op].map(normalizeIdFilter);
        }
    });

    if (!("_id" in out)) {
        return out;
    }

    const id = out._id;

    if (typeof id === "string") {

        const variants = idVariants(id);

        out._id = variants.length > 1 ? { $in: variants } : id;

    } else if (id && typeof id === "object" && Array.isArray(id.$in)) {

        out._id = { ...id, $in: id.$in.flatMap(idVariants) };

    }

    return out;

}


// Meteor-style 17 character id, used for inserts into the
// legacy collections so new documents look like old ones.
const METEOR_ID_CHARS =
    "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";

function meteorId() {

    const bytes = crypto.randomBytes(17);

    let id = "";

    for (let i = 0; i < 17; i++) {
        id += METEOR_ID_CHARS[bytes[i] % METEOR_ID_CHARS.length];
    }

    return id;

}


function assertWriteRole(name, user) {

    const allowed = WRITE_ROLE_RULES[name];

    if (!allowed) {
        return;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];

    if (!allowed.some(role => roles.includes(role))) {
        throw httpError(403, "You do not have permission to change this resource.");
    }

}

function collectionFor(name, { write } = {}) {

    if (typeof name !== "string" || !READ_COLLECTIONS.has(name)) {
        throw httpError(404, "Invalid request call");
    }

    if (write && !WRITE_COLLECTIONS.has(name)) {
        throw httpError(403, "This collection is read-only");
    }

    return mongoose.connection.db.collection(name);

}

function assertRole(name, user) {

    const allowed = ROLE_RULES[name];

    if (!allowed) {
        return;
    }

    const roles = Array.isArray(user.roles) ? user.roles : [];

    if (!allowed.some(role => roles.includes(role))) {
        throw httpError(403, "You do not have permission to access this resource.");
    }

}


// =====================================================
// LOCAL OR LIVE
// =====================================================

const LOCAL_TTL_MS = 30 * 1000;
let localNames = { at: 0, names: null };

async function isLocal(name) {

    if (!localNames.names || Date.now() - localNames.at > LOCAL_TTL_MS) {
        const list = await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
        localNames = { at: Date.now(), names: new Set(list.map(c => c.name)) };
    }

    return localNames.names.has(name);

}

function forgetLocalNames() {
    localNames = { at: 0, names: null };
}

// Same definition the client sent (extended JSON left as-is for the
// legacy server), with the owner scope folded in.
async function runLiveFetch(requestType, def, user) {

    const body = { ...def };
    const scope = OWNER_SCOPES[def.collection];

    // The git code always sends this with the ...FromDB endpoint.
    if (requestType === "fetchCollectionDataFromDB" && !body.queryType) {
        body.queryType = "standard";
    }

    if (scope) {
        body.query = { $and: [def.query || {}, scope.filter(user)] };
        body.projection = scope.exclude;
        if (body.options) {
            body.options = { ...body.options };
            delete body.options.projection;
        }
    }

    try {

        const data = live.rowsOf(await live.post(requestType, body));

        return { success: true, collection: def.collection, count: data.length, data, source: "live" };

    } catch (error) {

        live.warnOnce(def.collection, `[CONNECTAPP][WARN] ${def.collection} is not in the local database and ${error.message}`);

        // Modules render their empty state; the client shows one notice.
        return { success: true, collection: def.collection, count: 0, data: [], source: "unavailable" };

    }

}


// =====================================================
// OPERATIONS
// =====================================================

async function runFetch(def, user, requestType = "fetchCollectionData") {

    if (!def || typeof def !== "object") {
        throw httpError(400, "Invalid request");
    }

    const collection = collectionFor(def.collection);

    assertRole(def.collection, user);

    const options = def.options || {};

    assertSafe(def.query);
    assertSafe(def.projection);
    assertSafe(options);

    if (live.liveUrl() && !(await isLocal(def.collection))) {
        return runLiveFetch(requestType, def, user);
    }

    let filter = normalizeIdFilter(revive(def.query || {}, false));

    let projection = def.projection || options.projection;

    const scope = OWNER_SCOPES[def.collection];

    if (scope) {
        filter = { $and: [filter, scope.filter(user)] };
        projection = scope.exclude;
    }

    const sort = options.sort || def.sort;

    const limit = Math.min(
        Number(options.limit) > 0 ? Number(options.limit) : MAX_LIMIT,
        MAX_LIMIT
    );

    const skip = Number(options.skip) > 0 ? Number(options.skip) : 0;

    let cursor = collection.find(filter);

    if (projection) {
        cursor = cursor.project(projection);
    }

    if (sort) {
        cursor = cursor.sort(sort);
    }

    const data = await cursor.skip(skip).limit(limit).toArray();

    return {
        success: true,
        collection: def.collection,
        count: data.length,
        data
    };

}


async function runInsert(def, user, { meteorIds }) {

    const collection = collectionFor(def && def.collection, { write: true });

    assertRole(def.collection, user);
    assertWriteRole(def.collection, user);

    if (UPDATE_ONLY[def.collection]) {
        throw httpError(403, "This collection is read-only");
    }

    const doc = def.query;

    if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
        throw httpError(400, "Invalid request");
    }

    assertSafe(doc);

    const record = revive(doc, true);

    if (meteorIds && record._id === undefined) {
        record._id = meteorId();
    }

    const result = await collection.insertOne(record);

    forgetLocalNames();

    return {
        success: true,
        collection: def.collection,
        insertedId: result.insertedId
    };

}


async function runUpdate(def, user) {

    const collection = collectionFor(def && def.collection, { write: true });

    assertRole(def.collection, user);

    assertWriteRole(def.collection, user);

    const { selector } = (def.query || {});
    let { data } = (def.query || {});

    if (!selector || typeof selector !== "object" || !Object.keys(selector).length) {
        throw httpError(400, "An update needs a selector");
    }

    if (!data || typeof data !== "object" || !Object.keys(data).length) {
        throw httpError(400, "An update needs data");
    }

    // The legacy server treated plain field objects as $set
    // (e.g. updatePatientStatus / ncCallBtn in the git code).
    if (Object.keys(data).every(key => !key.startsWith("$"))) {
        data = { $set: data };
    }

    // Forms re-submit the loaded record, _id included; _id is immutable.
    if (data.$set && "_id" in data.$set) {
        data = { ...data, $set: { ...data.$set } };
        delete data.$set._id;
    }

    Object.keys(data).forEach(op => {
        if (!UPDATE_OPERATORS.has(op)) {
            throw httpError(400, `Update operator ${op} is not allowed`);
        }
    });

    const only = UPDATE_ONLY[def.collection];

    if (only) {
        Object.keys(data).forEach(op => {
            const fields = Object.keys(data[op] || {});
            if (!only[op] || !fields.length || fields.some(field => !only[op].includes(field))) {
                throw httpError(403, "You do not have permission to change this resource.");
            }
        });
    }

    assertSafe(selector);
    assertSafe(data);

    // Records shown from the live server are read-only here.
    if (live.liveUrl() && !(await isLocal(def.collection))) {
        throw httpError(409, "This record comes from the live CMC server and can't be changed from this copy. Run \"npm run sync:data\" to work on a local copy.");
    }

    const result = await collection.updateMany(
        normalizeIdFilter(revive(selector, false)),
        revive(data, true)
    );

    return {
        success: true,
        collection: def.collection,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
    };

}


const HANDLERS = {

    fetchCollectionData: (def, user) => runFetch(def, user, "fetchCollectionData"),
    fetchCollectionDataFromDB: (def, user) => runFetch(def, user, "fetchCollectionDataFromDB"),

    insertCollectionData: (def, user) => runInsert(def, user, { meteorIds: true }),
    insertCollectionDataInDB: (def, user) => runInsert(def, user, { meteorIds: false }),

    updateCollectionData: runUpdate,
    updateCollectionDataInDB: runUpdate

};


// =====================================================
// ROUTE
// =====================================================

router.post("/:requestType", verifyJWT, async (req, res) => {

    const { requestType } = req.params;

    const handler = HANDLERS[requestType];

    if (!handler) {

        return res.status(404).json({
            success: false,
            message: "Invalid request call"
        });

    }

    try {

        const body = req.body;

        // Array bodies (e.g. statusCount() in the git code) run
        // each definition; data is the concatenation.
        if (Array.isArray(body)) {

            const results = [];

            for (const def of body) {
                results.push(await handler(def, req.user));
            }

            return res.status(200).json({
                success: true,
                count: results.reduce((sum, r) => sum + (r.count || 0), 0),
                data: results.flatMap(r => r.data || []),
                results
            });

        }

        const result = await handler(body, req.user);

        return res.status(200).json(result);

    } catch (error) {

        const status = error.status || 500;

        if (status >= 500) {
            console.error(`[CONNECTAPP][ERROR] ${requestType}:`, error);
        } else {
            console.log(`[CONNECTAPP][WARN] ${requestType}: ${error.message}`);
        }

        return res.status(status).json({
            success: false,
            message: status >= 500 ? "Invalid request" : error.message
        });

    }

});


module.exports = router;
