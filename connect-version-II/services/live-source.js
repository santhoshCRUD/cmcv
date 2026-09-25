/**
 * The live CMC V Connect data API the original app talks to
 * (git utils.js: globalUrl + fetchCollectionData, POST JSON, no auth).
 *
 * Version II keeps its own MongoDB (MONGO_URI). When a collection is not
 * in that database yet, reads fall back to this server so the modules
 * show the same data as the original app (routes/connectApp.js), and
 * `npm run sync:data` / `npm run sync:forms` copy it locally.
 *
 *   CMC_LIVE_URL   default https://academics.cmcvellore.edu.in/api/connectApp/
 *                  set to "off" to use the local database only
 *
 * Only reads are ever sent to the live server.
 */

const DEFAULT_URL = "https://academics.cmcvellore.edu.in/api/connectApp/";
const TIMEOUT_MS = Number(process.env.CMC_LIVE_TIMEOUT_MS) || 15000;
const CACHE_MS = 60 * 1000;
const CACHE_MAX = 300;

const cache = new Map();
const warned = new Map();

const OFF = /^(off|false|no|none|0)$/i;


function normalizeUrl(value) {

    const url = String(value ?? "").trim();

    if (!url || OFF.test(url)) return null;

    return url.endsWith("/") ? url : `${url}/`;

}

function liveUrl() {
    return normalizeUrl(process.env.CMC_LIVE_URL ?? DEFAULT_URL);
}

// One warning per key every 5 minutes, so a dead network doesn't flood the log.
function warnOnce(key, message) {

    const last = warned.get(key) || 0;

    if (Date.now() - last > 5 * 60 * 1000) {
        warned.set(key, Date.now());
        console.warn(message);
    }

}

/**
 * POST <base><requestType> with body, exactly like the git fetchCollectionData.
 * Returns the parsed JSON, or throws (with .live = true) when unreachable.
 */
async function post(requestType, body, { base = liveUrl(), cacheable = true, timeout = TIMEOUT_MS } = {}) {

    if (!base) {
        const error = new Error("The live CMC server is turned off (CMC_LIVE_URL=off).");
        error.live = true;
        throw error;
    }

    if (!/^fetch/.test(requestType)) {
        throw new Error("Only reads are sent to the live CMC server.");
    }

    const key = `${base}${requestType}:${JSON.stringify(body)}`;
    const hit = cacheable && cache.get(key);

    if (hit && Date.now() - hit.at < CACHE_MS) return hit.value;

    try {

        const response = await fetch(`${base}${requestType}`, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(timeout)
        });

        if (!response.ok) throw new Error(`answered ${response.status}`);

        const value = await response.json();

        if (cacheable) {
            if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
            cache.set(key, { at: Date.now(), value });
        }

        return value;

    } catch (error) {

        const wrapped = new Error(`Can't reach ${base}${requestType}: ${error.cause?.message || error.message}`);
        wrapped.live = true;
        throw wrapped;

    }

}

// Rows from a { data: [...] } (or bare array) response.
function rowsOf(value) {
    if (Array.isArray(value)) return value;
    return value && Array.isArray(value.data) ? value.data : [];
}

function clearLiveCache() {
    cache.clear();
}


module.exports = { liveUrl, normalizeUrl, post, rowsOf, warnOnce, clearLiveCache, DEFAULT_URL };
