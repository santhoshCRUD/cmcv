/**
 * Client for the version II connectApp data API (routes/connectApp.js).
 *
 * Mirrors fetchCollectionData / fetchedDataAPI from the git code
 * (santhoshCRUD/cmcv utils.js) so ported module logic keeps the same
 * query definitions, but sends the JWT and talks to this server.
 *
 * Exposed as window.ConnectAPI.
 */
(function () {

    const BASE = "/api/connectApp/";

    async function request(requestType, body) {

        const token = sessionStorage.getItem("accessToken");

        const response = await fetch(BASE + requestType, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        });

        let result = null;

        try {
            result = await response.json();
        } catch (error) {
            result = null;
        }

        // Expired / logged-out session: back to login, same as guard.js.
        if (response.status === 401) {
            sessionStorage.clear();
            window.location.href = "/login";
            throw new Error("Session expired");
        }

        if (!response.ok || !result || result.success === false) {

            const error = new Error(result?.message || `Request failed (${response.status})`);

            error.status = response.status;

            throw error;

        }

        return result;

    }

    // Equivalent of fetchCollectionData('fetchCollectionData', def) -> { data }
    function fetch1(def, requestType = "fetchCollectionData") {
        return request(requestType, def);
    }

    // Convenience: just the rows.
    async function rows(def, requestType) {
        const result = await fetch1(def, requestType);
        return Array.isArray(result.data) ? result.data : [];
    }

    // Equivalent of fetchedDataAPI('fetchCollectionData', defs):
    // { [collection]: { data } | { error } } - one failing collection
    // does not fail the others.
    async function fetchMany(defs, requestType = "fetchCollectionData") {

        const results = {};

        await Promise.all(defs.map(async def => {

            try {
                results[def.collection] = await fetch1(def, requestType);
            } catch (error) {
                console.error(`Error fetching data for collection ${def.collection}:`, error);
                results[def.collection] = { error: error.message, data: [] };
            }

        }));

        return results;

    }

    const insert = (collection, doc, inDB = false) =>
        request(inDB ? "insertCollectionDataInDB" : "insertCollectionData", { collection, query: doc });

    const update = (collection, selector, data, inDB = false) =>
        request(inDB ? "updateCollectionDataInDB" : "updateCollectionData", { collection, query: { selector, data } });

    // { "$date": iso } marker the server revives into a real Date.
    const date = value => ({ $date: new Date(value).toISOString() });

    window.ConnectAPI = { request, fetch: fetch1, rows, fetchMany, insert, update, date };

})();
