/**
 * Equipment & Resources
 *
 * Port of views/equipments.html + loadAssets (git formLoad.js). The git
 * page ran entirely on a browser localStorage prototype, with "Mongo
 * migration" TODOs naming the real collections; this version uses them:
 *   Asset         - the register (git EQUIPMENT / "Add Equipment")
 *   AssetRequest  - applications for listed items and "Equipment You Want"
 *                   requests, with status history and a message thread
 *
 * Roles, as in the git code:
 *   "Missions"       -> Requests from every hospital, approve / reject,
 *                       Admin Dashboard (asset manager), Add Equipment
 *   "Hospital Admin" -> My Requests
 *
 * The git page's starting register (the Asset Recycling Committee list)
 * can be loaded with `npm run seed:equipment`
 * (scripts/data/asset-recycling-list.json).
 *
 * Git bugs fixed: the apply form dropped the "why" and "how will you
 * collect" answers and the "Equipment You Want" form dropped everything but
 * the item name; the hospital list was three hard-coded names (now the
 * user's allotted hospitals, or all mission hospitals).
 */
(function () {

    const { html, raw, img, formatDate, emptyState, errorState, skeletonCards, skeletonList, pageHeader, section, dataTable, openDialog, multiline, safeUrl } = Kit;

    const CATEGORIES = ["Computer", "Furniture", "Accessory", "Spare", "Consumables", "Instrument"];
    const CONDITIONS = ["New", "Excellent", "Good — Serviced", "Fair — Functional", "Needs Repair"];
    const URGENCY = [["Critical", "Critical — patient care affected now"], ["High", "High — needed within weeks"], ["Medium", "Medium — planned improvement"], ["Low", "Low — would be useful eventually"]];
    const APPROVED_LIKE = ["Approved", "Ready for Collection", "Dispatched", "Collected", "Completed"];
    const MIN_LISTING_DAYS = 60;

    const CAROUSEL = [
        "_ccf78344fa7c5a757d6e73f2a3dd1d42_Pictures.jpeg", "_2269f308e1a93aea5d3eb315fd52cb07_Pictures.jpg", "_45e4bd81e470c59c0e8c6ff8325213fb_Pictures.jpg",
        "_b925445e5e3904f4edb0cf9b687f6280_Pictures.jpg", "_56dd2c06687d44fa93422717f686d21f_Pictures.jpg", "_ec3043ca05a909a7b05cf914d71e6bc5_Pictures.jpg"
    ].map(name => `https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/${name}`);

    // What a hospital sees for each internal status (git STATUS_META)
    const STATUS = {
        "Pending": ["Submitted", "", "We've received this and it's in the queue to be looked at."],
        "Under Review": ["Being Reviewed", "", "Missions Office is checking this against what's available."],
        "Approved": ["Approved", "success", "This has been approved for your hospital. We're now arranging to get it to you."],
        "Ready for Collection": ["Approved", "success", "This has been approved and is being made ready to send."],
        "Dispatched": ["On the way", "success", "This is on its way to you."],
        "Collected": ["Delivered", "success", "Delivered — this has been received at your hospital."],
        "Completed": ["Delivered", "success", "Delivered — this has been received at your hospital."],
        "Rejected": ["Not approved", "danger", "This request wasn't approved this time."],
        "Cancelled": ["Cancelled", "", "This request was cancelled."]
    };

    const statusOf = s => STATUS[s] || STATUS.Pending;
    const statusBadge = s => html`<span class="badge ${statusOf(s)[1] ? `badge-${statusOf(s)[1]}` : ""}">${statusOf(s)[0]}</span>`;

    const EMOJI = [[["wheel chair", "wheelchair"], "♿"], [["chair"], "🪑"], [["sanitizer"], "🧴"], [["scissors"], "✂️"], [["tray"], "🧺"], [["cup"], "🥣"], [["suction"], "🌀"], [["computer", "laptop", "desktop"], "💻"], [["bed"], "🛏️"], [["clamp", "forceps", "retractor", "holder", "clip", "devers"], "🗜️"]];
    const emojiFor = name => (EMOJI.find(([keys]) => keys.some(k => String(name || "").toLowerCase().includes(k))) || [null, "🩺"])[1];

    const me = () => window.currentUser || {};
    const has = role => (me().roles || []).includes(role);
    const stamp = key => ({ userId: me().id || "", userName: me().name || "", [key]: ConnectAPI.date(Date.now()) });

    const isoToday = () => new Date().toISOString().slice(0, 10);
    const minCloseISO = () => { const d = new Date(); d.setDate(d.getDate() + MIN_LISTING_DAYS); return d.toISOString().slice(0, 10); };

    const daysUntilClose = item => item.closeDateISO ? Math.ceil((new Date(`${item.closeDateISO}T23:59:59`) - new Date()) / 864e5) : null;
    const isAvailable = item => (item.units || 0) > 0 && (daysUntilClose(item) === null || daysUntilClose(item) >= 0);
    const closingSoon = item => { const d = daysUntilClose(item); return d !== null && d >= 0 && d <= 5; };

    function historyStatus(item) {
        if ((item.units || 0) <= 0) return ["Fully allotted", ""];
        const d = daysUntilClose(item);
        if (d !== null && d < 0) return ["Closed", "danger"];
        if (d !== null && d <= 5) return ["Closing soon", "warning"];
        return ["Available", "success"];
    }

    const picture = (item, cls) => item.images?.[0]
        ? img(item.images[0], item.name, cls)
        : html`<span class="${cls} emoji-tile" aria-hidden="true">${emojiFor(item.name)}</span>`;


    // -----------------------------------------------------------------
    // Data
    // -----------------------------------------------------------------

    const state = { assets: [], requests: [], hospitals: [], search: "", cat: "all" };

    async function loadHospitals() {

        try {
            const [admin] = await ConnectAPI.rows({ collection: "HospitalAdmins", query: { userDocId: me().id, isDeleted: "false" }, projection: { allottedMissionHospitals: 1 } });
            const allotted = (admin?.allottedMissionHospitals || []).map(h => ({ _id: h.hospitalDocId, name: h.hospitalName || h.missionHospitalName })).filter(h => h._id && h.name);
            if (allotted.length) return allotted;
            return (await ConnectAPI.rows({ collection: "MissionHospital", query: { isDeleted: "false" }, projection: { _id: 1, missionHospitalName: 1 }, options: { sort: { missionHospitalName: 1 } } }))
                .map(h => ({ _id: h._id, name: h.missionHospitalName }));
        } catch (error) {
            console.error(error);
            return [];
        }

    }

    async function loadAll() {

        const [assets, requests] = await Promise.all([
            ConnectAPI.rows({ collection: "Asset", query: { isDeleted: false }, options: { sort: { addedISO: -1 } } }),
            ConnectAPI.rows({ collection: "AssetRequest", query: has("Missions") ? { isDeleted: false } : { isDeleted: false, "added.userId": me().id }, options: { sort: { "added.addedDate": -1 } } })
        ]);

        state.assets = assets;
        state.requests = requests;

    }

    async function nextCode(collection, field, prefix, start) {
        const rows = await ConnectAPI.rows({ collection, query: { [field]: { $regex: `^${prefix}-\\d+$` } }, projection: { [field]: 1 } }).catch(() => []);
        const max = rows.reduce((m, r) => Math.max(m, parseInt(String(r[field]).split("-")[1], 10) || 0), start);
        return `${prefix}-${max + 1}`;
    }

    const hospitalSelect = (id, selected) => html`
        <select class="input" id="${id}" name="hospital" required>
            <option value="">Select your hospital</option>
            ${state.hospitals.map(h => html`<option value="${h._id}" ${selected === h._id ? raw("selected") : ""}>${h.name}</option>`)}
        </select>`;


    // -----------------------------------------------------------------
    // Forms (apply / equipment you want / add equipment)
    // -----------------------------------------------------------------

    function bindValidation(form, rules) {

        const setError = (name, message) => {
            const el = form.querySelector(`[data-error="${name}"]`);
            if (el) el.textContent = message || "";
            form.elements[name]?.classList.toggle("is-invalid", Boolean(message));
        };

        form.addEventListener("input", event => setError(event.target.name, ""));

        return () => {
            let ok = true;
            Object.entries(rules).forEach(([name, check]) => {
                const message = check(form.elements[name]?.value?.trim?.() ?? "", form);
                setError(name, message);
                if (message && ok) { form.elements[name]?.focus(); ok = false; }
            });
            return ok;
        };

    }

    const field = (label, control, name, hint) => html`
        <label class="field"><span class="field-label">${label}</span>${control}${hint ? html`<span class="field-hint">${hint}</span>` : ""}<span class="field-error" data-error="${name}" aria-live="polite"></span></label>`;

    function openItem(item, onDone) {

        const dialog = openDialog({
            title: item.name,
            size: "lg",
            body: html`
                <div class="asset-detail">
                    ${picture(item, "asset-detail-img")}
                    <div>
                        <p>${closingSoon(item) ? html`<span class="badge badge-warning">Closing soon</span>` : html`<span class="badge badge-success">Available</span>`} <span class="badge">${item.category}</span></p>
                        <dl class="info-grid">
                            <div class="info-grid-item"><dt>Units available</dt><dd>${item.units}${item.maxPerRequest ? html` <span class="text-muted">(up to ${item.maxPerRequest} per request)</span>` : ""}</dd></div>
                            <div class="info-grid-item"><dt>Condition</dt><dd>${item.condition || "—"}</dd></div>
                            ${item.model ? html`<div class="info-grid-item"><dt>Brand / model</dt><dd>${item.model}</dd></div>` : ""}
                            <div class="info-grid-item"><dt>Listing closes</dt><dd>${formatDate(item.closeDateISO, "long") || "—"}</dd></div>
                            ${item.collectDeadlineISO ? html`<div class="info-grid-item"><dt>Collect by</dt><dd>${formatDate(item.collectDeadlineISO, "long")}</dd></div>` : ""}
                        </dl>
                        <p>${item.description || ""}</p>
                    </div>
                </div>
                <h3 class="detail-subhead">Available to request</h3>
                <form class="stack-form" data-apply novalidate>
                    ${field("Hospital", hospitalSelect("applyHospital"), "hospital")}
                    ${field("How many do you need?", html`<input class="input" type="number" name="qty" min="1" ${item.maxPerRequest ? raw(`max="${item.maxPerRequest}"`) : ""} placeholder="e.g. 1">`, "qty")}
                    ${field("Could you tell us a little about why this would help?", html`<textarea class="input textarea" name="situation" rows="3" maxlength="3000" placeholder="e.g. Tell us about the situation this would help solve..."></textarea>`, "situation")}
                    ${field("How will you collect it?", html`<textarea class="input textarea" name="collection" rows="2" maxlength="2000" placeholder="e.g. Tell us how you'd use it and how you'd collect it..."></textarea>`, "collection")}
                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Send Request</button></div>
                </form>`
        });

        const form = dialog.body.querySelector("[data-apply]");

        const validate = bindValidation(form, {
            hospital: v => v ? "" : "Please select your hospital.",
            qty: v => {
                const n = parseInt(v, 10);
                if (!n || n < 1) return "Please enter how many you need.";
                if (item.maxPerRequest && n > item.maxPerRequest) return `You can request up to ${item.maxPerRequest} unit${item.maxPerRequest === 1 ? "" : "s"} of this item per request.`;
                if (n > item.units) return `Only ${item.units} unit${item.units === 1 ? "" : "s"} available.`;
                return "";
            },
            situation: v => v ? "" : "Please tell us why this would help.",
            collection: v => v ? "" : "Please tell us how you will collect it."
        });

        form.addEventListener("submit", async event => {

            event.preventDefault();

            if (!validate()) return;

            const button = event.submitter;
            const hospital = state.hospitals.find(h => String(h._id) === form.elements.hospital.value);

            UI.setLoading(button, true);

            try {

                const now = ConnectAPI.date(Date.now());

                await ConnectAPI.insert("AssetRequest", {
                    ref: await nextCode("AssetRequest", "ref", "REQ", 1008),
                    kind: "Application",
                    name: item.name,
                    assetId: item._id,
                    qty: parseInt(form.elements.qty.value, 10),
                    hospital: hospital ? { _id: hospital._id, missionHospitalName: hospital.name } : null,
                    situation: form.elements.situation.value.trim(),
                    collection: form.elements.collection.value.trim(),
                    status: "Pending",
                    statusHistory: [{ status: "Pending", when: now, note: "Submitted" }],
                    chatThread: [],
                    isDeleted: false,
                    added: stamp("addedDate")
                });

                UI.toast("Sent — check My Requests to see it.", { type: "success" });
                dialog.close();
                onDone();

            } catch (error) {
                UI.toast(error.message, { type: "error" });
                UI.setLoading(button, false);
            }

        });

    }

    function bindWantForm(form, onDone) {

        const validate = bindValidation(form, {
            hospital: v => v ? "" : "Please select your hospital.",
            name: v => v ? "" : "Please tell us what you need.",
            qty: v => parseInt(v, 10) > 0 ? "" : "Please enter how many.",
            why: v => v ? "" : "Please tell us why this would help."
        });

        form.addEventListener("submit", async event => {

            event.preventDefault();

            if (!validate()) return;

            const button = event.submitter;
            const hospital = state.hospitals.find(h => String(h._id) === form.elements.hospital.value);

            UI.setLoading(button, true);

            try {

                const now = ConnectAPI.date(Date.now());

                await ConnectAPI.insert("AssetRequest", {
                    ref: await nextCode("AssetRequest", "ref", "REQ", 1008),
                    kind: "Request",
                    name: form.elements.name.value.trim(),
                    category: form.elements.category.value,
                    qty: parseInt(form.elements.qty.value, 10),
                    urgency: form.elements.urgency.value,
                    situation: form.elements.why.value.trim(),
                    hospital: hospital ? { _id: hospital._id, missionHospitalName: hospital.name } : null,
                    assetId: null,
                    status: "Pending",
                    statusHistory: [{ status: "Pending", when: now, note: "Submitted" }],
                    chatThread: [],
                    isDeleted: false,
                    added: stamp("addedDate")
                });

                UI.toast("Sent — check My Requests to see it.", { type: "success" });
                form.reset();
                onDone();

            } catch (error) {
                UI.toast(error.message, { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

    }

    function openAddEquipment(onDone) {

        const dialog = openDialog({
            title: "Add equipment to the register",
            size: "lg",
            body: html`
                <p class="text-muted">Fill this in once — it shows up in Available Equipment right away.</p>
                <form class="stack-form form-grid" data-asset novalidate>
                    ${field("Item name", html`<input class="input" name="name" maxlength="200" placeholder="e.g. Oxygen Concentrator">`, "name")}
                    ${field("Category", html`<select class="input" name="category"><option value="">Select a category</option>${CATEGORIES.map(c => html`<option>${c}</option>`)}</select>`, "category")}
                    ${field("Condition", html`<select class="input" name="condition"><option value="">Select condition</option>${CONDITIONS.map(c => html`<option>${c}</option>`)}</select>`, "condition")}
                    ${field("Brand / model", html`<input class="input" name="model" maxlength="200" placeholder="e.g. Philips EverFlo, 2019">`, "model")}
                    ${field("Units available", html`<input class="input" type="number" min="0" name="units" placeholder="e.g. 2">`, "units")}
                    ${field("Max units per request (optional)", html`<input class="input" type="number" min="1" name="maxPerRequest" placeholder="e.g. 2 — leave blank for no limit">`, "maxPerRequest", "Caps how many units one hospital can ask for in a single request. Doesn't limit how many units are in stock.")}
                    <div class="form-grid-wide">${field("Description", html`<textarea class="input textarea" name="description" rows="3" maxlength="3000" placeholder="Condition notes, what it's suited for, anything a hospital should know..."></textarea>`, "description")}</div>
                    ${field("Listing closes on", html`<input class="input" type="date" name="closeDateISO" min="${minCloseISO()}">`, "closeDateISO", "Listings need to stay open for at least 2 months, so the earliest close date you can pick is 2 months from today.")}
                    ${field("Photo URL (optional)", html`<input class="input" name="photo" placeholder="Paste an image link — leave blank for a placeholder picture">`, "photo")}
                    <label class="check-row form-grid-wide"><input type="checkbox" name="hasDeadline"> Set a deadline to collect it by? (optional)</label>
                    <div class="form-grid-wide" data-deadline hidden>${field("Deadline to collect", html`<input class="input" type="date" name="collectDeadlineISO">`, "collectDeadlineISO", "Only needed if collection has to happen by a specific date. Leave the box above unchecked if not.")}</div>
                </form>`,
            footer: html`<button type="button" class="btn btn-secondary" data-cancel>Cancel</button><button type="button" class="btn btn-primary" data-save>Add to register</button>`
        });

        const form = dialog.body.querySelector("[data-asset]");

        form.elements.hasDeadline.addEventListener("change", () => { form.querySelector("[data-deadline]").hidden = !form.elements.hasDeadline.checked; });

        const validate = bindValidation(form, {
            name: v => v ? "" : "Please enter the item name.",
            category: v => v ? "" : "Please select a category.",
            condition: v => v ? "" : "Please select the condition.",
            units: v => v !== "" && parseInt(v, 10) >= 0 ? "" : "Please enter the units available.",
            description: v => v ? "" : "Please add a short description.",
            closeDateISO: v => !v ? "Please pick a close date." : v < minCloseISO() ? `Listings must stay open for at least 2 months — the earliest close date is ${formatDate(minCloseISO(), "long")}.` : "",
            photo: v => !v || safeUrl(v) ? "" : "Please enter a valid image link.",
            collectDeadlineISO: (v, f) => !f.elements.hasDeadline.checked ? "" : !v ? "Add a date, or leave the box above unchecked." : v < f.elements.closeDateISO.value ? "The collection deadline should be on or after the listing's close date." : ""
        });

        dialog.element.querySelector("[data-cancel]").addEventListener("click", dialog.close);

        dialog.element.querySelector("[data-save]").addEventListener("click", async event => {

            if (!validate()) return;

            const button = event.currentTarget;
            const f = form.elements;
            const max = parseInt(f.maxPerRequest.value, 10);

            UI.setLoading(button, true);

            try {

                await ConnectAPI.insert("Asset", {
                    code: await nextCode("Asset", "code", "AST", 2470),
                    name: f.name.value.trim(),
                    model: f.model.value.trim(),
                    category: f.category.value,
                    images: f.photo.value.trim() ? [safeUrl(f.photo.value.trim())] : [],
                    units: parseInt(f.units.value, 10),
                    maxPerRequest: max > 0 ? max : null,
                    condition: f.condition.value,
                    description: f.description.value.trim(),
                    addedISO: isoToday(),
                    closeDateISO: f.closeDateISO.value,
                    collectDeadlineISO: f.hasDeadline.checked ? f.collectDeadlineISO.value : null,
                    isDeleted: false,
                    added: stamp("addedDate")
                });

                UI.toast("Added — it's now showing in Available Equipment.", { type: "success" });
                dialog.close();
                onDone();

            } catch (error) {
                UI.toast(error.message, { type: "error" });
                UI.setLoading(button, false);
            }

        });

    }


    // -----------------------------------------------------------------
    // Request detail + messages (openRequestDetail / chat)
    // -----------------------------------------------------------------

    function openRequest(request, side, onDone) {

        const asset = state.assets.find(a => String(a._id) === String(request.assetId));
        const actionable = side === "connect" && has("Missions") && !APPROVED_LIKE.includes(request.status) && request.status !== "Rejected" && request.status !== "Cancelled";

        const dialog = openDialog({
            title: `${request.ref || "Request"} · ${request.name}`,
            size: "lg",
            body: html`
                <p>${statusBadge(request.status)} <span class="text-muted">${statusOf(request.status)[2]}</span></p>
                <dl class="info-grid">
                    <div class="info-grid-item"><dt>Type</dt><dd>${request.kind === "Application" ? "Listed item" : "Equipment wanted"}</dd></div>
                    <div class="info-grid-item"><dt>Hospital</dt><dd>${request.hospital?.missionHospitalName || request.hospital || "Not specified"}</dd></div>
                    ${request.qty ? html`<div class="info-grid-item"><dt>Quantity</dt><dd>${request.qty}${asset ? html` <span class="text-muted">(${asset.units} left)</span>` : ""}</dd></div>` : ""}
                    ${request.category ? html`<div class="info-grid-item"><dt>Category</dt><dd>${request.category}</dd></div>` : ""}
                    ${request.urgency ? html`<div class="info-grid-item"><dt>Urgency</dt><dd>${request.urgency}</dd></div>` : ""}
                    <div class="info-grid-item"><dt>Submitted</dt><dd>${formatDate(request.added?.addedDate, "datetime") || "—"} by ${request.added?.userName || "—"}</dd></div>
                    ${request.situation ? html`<div class="info-grid-item info-grid-wide"><dt>Why this would help</dt><dd>${multiline(request.situation)}</dd></div>` : ""}
                    ${request.collection ? html`<div class="info-grid-item info-grid-wide"><dt>How it will be collected</dt><dd>${multiline(request.collection)}</dd></div>` : ""}
                </dl>
                ${(request.statusHistory || []).length ? html`<h4 class="detail-subhead">History</h4><ul class="bullet-list">${request.statusHistory.map(h => html`<li>${statusOf(h.status)[0]} — ${formatDate(h.when, "datetime")}${h.note ? html` <span class="text-muted">(${h.note})</span>` : ""}</li>`)}</ul>` : ""}
                ${actionable ? html`<div class="form-actions"><button type="button" class="btn btn-danger-soft" data-decide="Rejected">Reject</button><button type="button" class="btn btn-primary" data-decide="Approved">Approve</button></div>` : ""}
                <h4 class="detail-subhead">Messages about this request</h4>
                <div class="chat-thread" data-thread></div>
                <form data-compose novalidate><label class="sr-only" for="eqChat">Message</label>
                    <textarea id="eqChat" class="input textarea" rows="2" maxlength="2000" placeholder="Write a message..."></textarea>
                    <span class="field-error" data-error aria-live="polite"></span>
                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Send</button></div></form>`
        });

        const thread = dialog.body.querySelector("[data-thread]");

        const drawThread = () => {
            const list = request.chatThread || [];
            thread.innerHTML = list.length
                ? String(html`${list.map(m => html`<div class="chat-msg ${m.authorId === me().id ? "from" : "to"}"><div>${multiline(m.message)}</div><div class="chat-meta">${m.authorRole === "connect" ? "Missions Office" : "Hospital"} · ${m.authorName || ""} · ${formatDate(m.postedAt, "datetime")}</div></div>`)}`)
                : String(html`<p class="text-muted">No messages yet.</p>`);
            thread.scrollTop = thread.scrollHeight;
        };

        drawThread();

        dialog.body.querySelectorAll("[data-decide]").forEach(button => button.addEventListener("click", async () => {

            const status = button.dataset.decide;
            const ok = await Forms.confirm({
                title: status === "Approved" ? "Approve this request?" : "Reject this request?",
                message: status === "Approved" ? "This will reduce the item's remaining units by the quantity requested." : "The hospital will see that this request wasn't approved.",
                confirmLabel: status === "Approved" ? "Approve" : "Reject",
                danger: status === "Rejected"
            });

            if (!ok) return;

            UI.setLoading(button, true);

            try {

                await ConnectAPI.update("AssetRequest", { _id: request._id }, {
                    $set: { status, modified: stamp("modifiedDate") },
                    $push: { statusHistory: { status, when: ConnectAPI.date(Date.now()), note: status === "Approved" ? "Approved by Missions Office" : "Not approved" } }
                });

                if (status === "Approved" && asset && request.qty) {
                    await ConnectAPI.update("Asset", { _id: asset._id }, { $set: { units: Math.max(0, (asset.units || 0) - request.qty) } });
                }

                UI.toast(status === "Approved" ? "Request approved" : "Request rejected", { type: "success" });
                dialog.close();
                onDone();

            } catch (error) {
                UI.toast(error.message, { type: "error" });
                UI.setLoading(button, false);
            }

        }));

        dialog.body.querySelector("[data-compose]").addEventListener("submit", async event => {

            event.preventDefault();

            const input = dialog.body.querySelector("#eqChat");
            const text = input.value.trim();

            if (!text) {
                input.classList.add("is-invalid");
                dialog.body.querySelector("[data-error]").textContent = "Please write a message.";
                return;
            }

            const button = event.submitter;
            const message = { message: text, authorRole: side, authorId: me().id || "", authorName: me().name || "", postedAt: new Date().toISOString() };

            UI.setLoading(button, true);

            try {
                await ConnectAPI.update("AssetRequest", { _id: request._id }, { $push: { chatThread: { ...message, postedAt: ConnectAPI.date(message.postedAt) } } });
                request.chatThread = [...(request.chatThread || []), message];
                input.value = "";
                drawThread();
            } catch (error) {
                UI.toast(error.message, { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

        dialog.body.querySelector("#eqChat").addEventListener("input", e => { e.target.classList.remove("is-invalid"); dialog.body.querySelector("[data-error]").textContent = ""; });

    }


    // -----------------------------------------------------------------
    // Page
    // -----------------------------------------------------------------

    async function render(view, params) {

        const admin = has("Missions");

        if (params[0] === "admin") return renderAdmin(view);
        if (params[0] === "history") return renderHistory(view);

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "A shared shelf for mission hospitals",
                title: "Equipment & Resources",
                icon: "bi-box-seam",
                color: "teal",
                description: "CMC lists equipment it no longer needs here first. Each listing stays open for a couple of weeks, so if something below helps, don't wait too long to ask.",
                actions: html`
                    ${admin ? html`<a class="btn btn-secondary" href="#/equipment/admin"><i class="bi bi-speedometer2"></i> Admin Dashboard</a>` : ""}
                    <a class="btn btn-secondary" href="#/equipment/history"><i class="bi bi-clock-history"></i> History</a>
                    ${admin ? html`<button type="button" class="btn btn-primary" data-add-asset><i class="bi bi-plus-lg"></i> Add Equipment</button>` : ""}`
            })}
            <div class="hero-strip">${CAROUSEL.slice(0, 3).map(src => img(src, "CMC V Connect — Equipment & Resources", "hero-strip-img"))}</div>
            ${section("Available Equipment", html`
                <div class="toolbar">
                    <div class="input-group"><i class="bi bi-search"></i><input class="input" type="search" data-search placeholder="Search..." aria-label="Search equipment"></div>
                    <select class="input toolbar-select" data-cat aria-label="Filter by type"><option value="all">All types</option>${CATEGORIES.map(c => html`<option>${c}</option>`)}</select>
                </div>
                <div data-register>${skeletonCards(6)}</div>`)}
            ${section("How allocation works", html`<p>Every application is reviewed against the same criteria we use for grants — so hospitals with the greatest need and the clearest impact are prioritised, not whoever applies first.</p>
                <ul class="pill-list"><li>Level of Need</li><li>Expected Impact</li><li>Readiness to Deploy</li><li>Fair Distribution</li></ul>`)}
            ${section("Equipment You Want", html`
                <p>Can't find what you need above? Tell us and we'll look into it.</p>
                <ul class="bullet-list text-muted"><li>Reviewed regularly — checked every few months.</li><li>Urgent needs first — mark it Critical for faster follow-up.</li><li>Track it anytime — see its status under My Requests.</li></ul>
                <form class="stack-form form-grid" data-want novalidate>
                    ${field("Hospital", hospitalSelect("wantHospital"), "hospital")}
                    ${field("What do you need?", html`<input class="input" name="name" maxlength="200">`, "name")}
                    ${field("Category", html`<select class="input" name="category">${[...CATEGORIES, "Other"].map(c => html`<option>${c}</option>`)}</select>`, "category")}
                    ${field("How many?", html`<input class="input" type="number" min="1" name="qty">`, "qty")}
                    ${field("Urgency", html`<select class="input" name="urgency">${URGENCY.map(([v, l]) => html`<option value="${v}">${l}</option>`)}</select>`, "urgency")}
                    <div class="form-grid-wide">${field("Could you tell us a little about why this would help?", html`<textarea class="input textarea" name="why" rows="3" maxlength="3000" placeholder="Tell us about the situation this would help solve..."></textarea>`, "why")}</div>
                    <div class="form-actions form-grid-wide"><button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Send Request</button></div>
                </form>`)}
            <div class="two-col" data-columns>
                ${section("My Requests", html`<div data-mine>${skeletonList(3)}</div>`, { description: "Everything you've asked for, and where it stands." })}
                ${admin ? section("Requests", html`<div data-connect>${skeletonList(3)}</div>`, { description: "Every request and application, from every hospital." }) : ""}
            </div>`);

        const refresh = async () => {
            try {
                await loadAll();
                drawRegister(view);
                drawRequests(view, admin, refresh);
            } catch (error) {
                view.querySelector("[data-register]").innerHTML = String(errorState(error.message));
            }
        };

        state.hospitals = await loadHospitals();

        view.querySelectorAll('select[name="hospital"]').forEach(select => {
            select.innerHTML = String(html`<option value="">Select your hospital</option>${state.hospitals.map(h => html`<option value="${h._id}">${h.name}</option>`)}`);
            if (state.hospitals.length === 1) select.value = state.hospitals[0]._id;
        });

        view.querySelector("[data-search]").addEventListener("input", e => { state.search = e.target.value.trim().toLowerCase(); drawRegister(view); });
        view.querySelector("[data-cat]").addEventListener("change", e => { state.cat = e.target.value; drawRegister(view); });
        view.querySelector("[data-add-asset]")?.addEventListener("click", () => openAddEquipment(refresh));
        view.querySelector("[data-register]").addEventListener("click", e => {
            const tile = e.target.closest("[data-asset]");
            if (tile) openItem(state.assets.find(a => String(a._id) === tile.dataset.asset), refresh);
        });

        bindWantForm(view.querySelector("[data-want]"), refresh);

        refresh();

    }

    function drawRegister(view) {

        const box = view.querySelector("[data-register]");
        const list = state.assets.filter(a => isAvailable(a) && (state.cat === "all" || a.category === state.cat) && (!state.search || String(a.name).toLowerCase().includes(state.search)));

        box.innerHTML = list.length
            ? String(html`<div class="asset-grid">${list.map(a => html`
                <button type="button" class="card asset-card" data-asset="${a._id}">
                    ${picture(a, "asset-card-img")}
                    <span class="asset-card-body">
                        <strong>${a.name}</strong>
                        <span class="text-muted">${a.category}${a.condition ? ` · ${a.condition}` : ""}</span>
                        <span class="asset-card-meta">${closingSoon(a) ? html`<span class="badge badge-warning">Closing soon</span>` : html`<span class="badge badge-success">Available</span>`}
                            <span>${a.units} unit${a.units === 1 ? "" : "s"}</span><span class="text-subtle">Closes ${formatDate(a.closeDateISO, "short")}</span></span>
                        <span class="btn btn-secondary btn-sm">View &amp; Apply</span>
                    </span>
                </button>`)}</div>`)
            : String(emptyState("bi-box-seam", state.assets.length ? "Nothing matches your search" : "No equipment listed right now", state.assets.length ? "Try another type or search term." : "Check back soon, or tell us what you need below."));

    }

    function drawRequests(view, admin, refresh) {

        const table = (box, rows, side) => {

            if (!box) return;

            dataTable(box, {
                columns: [
                    { key: "ref", title: "Ref" },
                    { key: "name", title: "Item" },
                    ...(side === "connect" ? [{ key: "hospital", title: "Hospital", sortValue: r => r.hospital?.missionHospitalName || "", render: r => r.hospital?.missionHospitalName || "Not specified" }] : []),
                    { key: "status", title: "Status", render: r => statusBadge(r.status) },
                    { key: "when", title: "Date", sortValue: r => r.added?.addedDate || "", render: r => formatDate(r.added?.addedDate) || "—" },
                    { key: "open", title: "", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-request="${r._id}" data-side="${side}"><i class="bi bi-chat-dots"></i> Open${r.chatThread?.length ? html` <span class="badge badge-accent">${r.chatThread.length}</span>` : ""}</button>` }
                ],
                rows,
                pageSize: 6,
                searchKeys: ["ref", "name", r => r.hospital?.missionHospitalName || ""],
                emptyText: side === "connect" ? "No requests have come in yet." : "You haven't asked for anything yet. Tap View & Apply on an item."
            });

            box.onclick = e => {
                const b = e.target.closest("[data-request]");
                if (b) openRequest(state.requests.find(r => String(r._id) === b.dataset.request), b.dataset.side, refresh);
            };

        };

        table(view.querySelector("[data-mine]"), state.requests.filter(r => r.added?.userId === me().id), "hospital");
        if (admin) table(view.querySelector("[data-connect]"), state.requests, "connect");

    }

    async function renderAdmin(view) {

        const back = { href: "#/equipment", label: "Back to Equipment" };

        if (!has("Missions")) {
            view.innerHTML = String(html`${pageHeader({ title: "Admin Dashboard", back })}${emptyState("bi-shield-lock", "Missions office only", "The equipment admin dashboard is available to users with the Missions role.")}`);
            return;
        }

        view.innerHTML = String(html`${pageHeader({ title: "Admin Dashboard", icon: "bi-speedometer2", color: "teal", back, description: "A consolidated view of every request and every listed asset." })}${skeletonCards(3, "kpi-grid")}`);

        try { await loadAll(); } catch (error) { view.innerHTML = String(html`${pageHeader({ title: "Admin Dashboard", back })}${errorState(error.message)}`); return; }

        const { assets, requests } = state;
        const pending = requests.filter(r => !APPROVED_LIKE.includes(r.status) && r.status !== "Rejected" && r.status !== "Cancelled").length;
        const approved = requests.filter(r => APPROVED_LIKE.includes(r.status)).length;
        const rejected = requests.filter(r => r.status === "Rejected").length;

        const byHospital = {};
        requests.forEach(r => {
            const h = r.hospital?.missionHospitalName || "Not specified";
            const row = byHospital[h] = byHospital[h] || { hospital: h, total: 0, approved: 0, pending: 0, rejected: 0, last: null };
            row.total++;
            if (APPROVED_LIKE.includes(r.status)) row.approved++; else if (r.status === "Rejected") row.rejected++; else row.pending++;
            if (!row.last || r.added?.addedDate > row.last) row.last = r.added?.addedDate;
        });

        const kpi = (label, value) => html`<div class="card kpi"><span>${label}</span><strong>${value}</strong></div>`;

        view.innerHTML = String(html`
            ${pageHeader({ title: "Admin Dashboard", icon: "bi-speedometer2", color: "teal", back, description: "A consolidated view of every request and every listed asset." })}
            <div class="kpi-grid">${kpi("Assets Listed", assets.length)}${kpi("Units In Stock", assets.reduce((s, a) => s + (a.units || 0), 0))}${kpi("Total Requests", requests.length)}${kpi("Pending Review", pending)}${kpi("Approved", approved)}${kpi("Rejected", rejected)}</div>
            ${section("Activity by Hospital", html`<div data-hospitals></div>`)}
            ${section("Asset Manager", html`<p class="text-muted">Set "Max per request" to cap how many units a hospital can ask for in one application. Leave blank for no limit. Changes save as soon as you leave the box.</p><div data-assets></div>`)}`);

        dataTable(view.querySelector("[data-hospitals]"), {
            columns: [{ key: "hospital", title: "Hospital" }, { key: "total", title: "Requests" }, { key: "approved", title: "Approved" }, { key: "pending", title: "Pending" }, { key: "rejected", title: "Rejected" }, { key: "last", title: "Last activity", render: r => formatDate(r.last) || "—" }],
            rows: Object.values(byHospital),
            emptyText: "No requests have come in yet."
        });

        const assetsBox = view.querySelector("[data-assets]");

        dataTable(assetsBox, {
            columns: [
                { key: "name", title: "Item" },
                { key: "category", title: "Category" },
                { key: "units", title: "Units left" },
                { key: "maxPerRequest", title: "Max per request", sortable: false, render: a => html`<input class="input input-sm" type="number" min="1" data-max="${a._id}" value="${a.maxPerRequest || ""}" placeholder="No limit" aria-label="Max per request for ${a.name}">` },
                { key: "status", title: "Status", sortValue: a => historyStatus(a)[0], render: a => html`<span class="badge ${historyStatus(a)[1] ? `badge-${historyStatus(a)[1]}` : ""}">${historyStatus(a)[0]}</span>` },
                { key: "requests", title: "Requests", sortValue: a => requests.filter(r => String(r.assetId) === String(a._id)).length, render: a => requests.filter(r => String(r.assetId) === String(a._id)).length }
            ],
            rows: assets,
            emptyText: "Nothing added to the register yet."
        });

        assetsBox.addEventListener("change", async event => {

            const input = event.target.closest("[data-max]");

            if (!input) return;

            const value = parseInt(input.value, 10);
            const max = value > 0 ? value : null;

            try {
                await ConnectAPI.update("Asset", { _id: input.dataset.max }, { $set: { maxPerRequest: max } });
                const asset = state.assets.find(a => String(a._id) === input.dataset.max);
                if (asset) asset.maxPerRequest = max;
                input.value = max || "";
                UI.toast("Saved", { type: "success", timeout: 1800 });
            } catch (error) {
                UI.toast(error.message, { type: "error" });
            }

        });

    }

    async function renderHistory(view) {

        const back = { href: "#/equipment", label: "Back to Equipment" };

        view.innerHTML = String(html`${pageHeader({ title: "Equipment history", icon: "bi-clock-history", color: "teal", back, description: "Everything that's been listed here, past and present." })}<section class="card panel"><div class="panel-body" data-history>${skeletonList(5)}</div></section>`);

        try {

            await loadAll();

            dataTable(view.querySelector("[data-history]"), {
                columns: [
                    { key: "name", title: "Item", render: a => html`<strong>${a.name}</strong><br><span class="text-muted">${a.code || ""} · ${a.category}</span>` },
                    { key: "addedISO", title: "Added / Closes", render: a => html`${formatDate(a.addedISO) || "—"}<br><span class="text-muted">closes ${formatDate(a.closeDateISO) || "—"}</span>` },
                    { key: "status", title: "Status", sortValue: a => historyStatus(a)[0], render: a => html`<span class="badge ${historyStatus(a)[1] ? `badge-${historyStatus(a)[1]}` : ""}">${historyStatus(a)[0]}</span>` }
                ],
                rows: state.assets,
                searchKeys: ["name", "code", "category"],
                emptyText: "Nothing has been added to the register yet."
            });

        } catch (error) {
            view.querySelector("[data-history]").innerHTML = String(errorState(error.message));
        }

    }

    App.register({ id: "equipment", title: "Equipment", icon: "bi-box-seam", color: "teal", group: "Missions", audiences: ["missions"], description: "A shared shelf of CMC equipment for mission hospitals.", render });

})();
