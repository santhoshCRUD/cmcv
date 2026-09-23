/**
 * Network Consults
 *
 * Ports of the git code:
 *   views/NetworkConslt/networkConslt.html + enableNetConsltRolesPage,
 *     loadNcDashboard (KPIs, case/application status, themes, activity),
 *     renderNcThemes, ncPatientReqtable / ncPatientReqForm
 *     ("clinicalCaseDiscussion"), ncMyDeptConsltTable, ncNodalsListTable,
 *     newPatientReq, loadNetConsltRegForm ("registryOfNetworkConsultants")
 *   views/NetworkConslt/patientWorkspace.html + openPatientWorkspace,
 *     initPatientMenu, renderReports / renderImages, the Q&A
 *     (NetConsltPatientQuery, polled every 10 s), updatePatientStatus,
 *     ncCallBtn and the doctor allotment log (NCAllotDocLog)
 *
 * Routes: #/network-consults            home + programme dashboard
 *         #/network-consults/themes     consult topics
 *         #/network-consults/requests   my patient requests (NC Request)
 *         #/network-consults/consult    department consults (NC Consultant)
 *         #/network-consults/nodal      nodal overview (NC Nodal)
 *         #/network-consults/patient/<patientId>
 *
 * Git bugs fixed: the delete put $set outside `data` (never applied);
 * allotting a doctor $push-ed into an NCAllotDocLog record that was never
 * created (the first allotment now creates it); new patient IDs are taken
 * from the highest existing ID instead of the latest "Allotted" record.
 * The consultant approval (Accepted / Rejected) exists in the git code but
 * its panel was never shown by the live initPatientMenu; it is shown here
 * to consultants allotted to the case.
 */
(function () {

    const { html, raw, img, formatDate, emptyState, errorState, skeletonList, skeletonCards, pageHeader, section, dataTable, openDialog, multiline, safeUrl } = Kit;

    const PLACEHOLDER = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";

    const ROLE = { requests: "NC Request", consult: "NC Consultant", nodal: "NC Nodal" };

    const me = () => window.currentUser || {};
    const has = role => (me().roles || []).includes(role);
    const stamp = key => ({ userName: me().name || "", userId: me().id || "", [key]: ConnectAPI.date(Date.now()) });

    const date = value => formatDate(value) || "-";

    const nav = active => html`
        <nav class="subnav" aria-label="Network Consults">
            ${[["", "Home"], ["themes", "Themes"], ["requests", "Request"], ["consult", "Consult"], ["nodal", "Nodal"]]
                .filter(([id]) => !ROLE[id] || has(ROLE[id]))
                .map(([id, label]) => html`<a href="#/network-consults${id ? `/${id}` : ""}" class="${active === id ? "is-active" : ""}" ${active === id ? raw('aria-current="page"') : ""}>${label}</a>`)}
        </nav>`;

    const header = (active, title = "Network Consults", description) => html`
        ${pageHeader({ title, icon: "bi-heart-pulse", color: "red", description, back: active === null ? { href: "#/network-consults", label: "Network Consults" } : undefined })}
        ${active === null ? "" : nav(active)}`;


    // -----------------------------------------------------------------
    // Registration (loadNetConsltRegForm)
    // -----------------------------------------------------------------

    function openRegistration() {

        const user = me();

        Forms.open({
            title: "Register as Network Consultant",
            formKey: "registryOfNetworkConsultants",
            hide: ["missionsOfficeUse"],
            successMessage: "Your request is being processed, you will receive an email after confirmation. Thank you!",
            prepare: def => (def.components || []).forEach(page => {
                if (page.buttonSettings) Object.assign(page.buttonSettings, { cancel: false, next: false, submit: false, previous: false });
                page.breadcrumbClickable = false;
            }),
            onReady: form => {

                form.getComponent("name")?.setValue(user.name || "");
                form.getComponent("designation")?.setValue(user.designation || "");

                form.on("change", event => {
                    if (event.changed?.component?.key !== "areYouWorkingInCmc" || event.data.areYouWorkingInCmc !== "Yes") return;
                    form.getComponent("employeeNumber")?.setValue(user.employeeId || "");
                    if (user.departmentId) form.getComponent("cmcDepartments")?.setValue({ _id: user.departmentId, name: user.department || "" });
                    if (user.unit) form.getComponent("cmcUnit")?.setValue({ id: user.unitId, name: user.unit || "" });
                });

            },
            onSubmit: async data => {
                const doc = await Forms.uploadFiles({ ...data }, "NetConsltRegApp");
                await ConnectAPI.insert("NetConsltRegApp", { ...doc, userId: user.id, isDeleted: false, status: "Submitted", added: stamp("addedDate") });
            }
        });

    }


    // -----------------------------------------------------------------
    // Home + dashboard (loadNcDashboard)
    // -----------------------------------------------------------------

    const latestPerPatient = visits => {
        const seen = new Set();
        return visits.filter(v => {
            const key = v.patientId || v._id;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };

    const toDate = value => { const d = value ? new Date(value) : null; return d && !isNaN(d) ? d : null; };

    function duration(ms) {
        const hours = ms / 36e5;
        if (hours < 1) return `${Math.max(1, Math.round(ms / 6e4))} min`;
        if (hours < 48) return `${Math.round(hours)} h`;
        return `${Math.round(hours / 24)} days`;
    }

    function segmented(states, counts, total, noun) {

        const known = states.map(s => s.key);
        const other = Object.keys(counts).filter(k => !known.includes(k)).reduce((sum, k) => sum + counts[k], 0);
        const rows = states.map(s => ({ ...s, value: counts[s.key] || 0 })).filter(r => r.value);

        if (other) rows.push({ label: "Other", tone: "gray", value: other });

        if (!total || !rows.length) return emptyState("bi-bar-chart", `No ${noun}s yet.`);

        return html`
            <div class="seg-bar">${rows.map(r => html`<span class="seg seg-${r.tone}" style="width:${(r.value / total) * 100}%" title="${r.label}: ${r.value}"></span>`)}</div>
            <ul class="seg-legend">${rows.map(r => html`<li><span class="seg-dot seg-${r.tone}"></span><span>${r.label}</span><span class="text-muted">${Math.round((r.value / total) * 100)}%</span><strong>${r.value}</strong></li>`)}</ul>`;

    }

    async function renderHome(view) {

        const registered = has("NC Request");

        view.innerHTML = String(html`
            ${header("")}
            <section class="card feature-banner">
                <div class="feature-banner-copy">
                    <h2>Welcome to Network Consults</h2>
                    <p>This initiative provides an opportunity for our network doctors to engage directly with specialists at CMC to seek expert opinions on patient treatment and care.</p>
                    ${registered ? "" : html`<p>We invite you to register to begin participating in this collaborative consultation process.</p>
                        <button type="button" class="btn btn-primary" data-register><i class="bi bi-person-plus"></i> Register Now</button>`}
                </div>
            </section>
            <div class="tile-grid">
                ${has(ROLE.requests) ? html`<a class="card link-tile" href="#/network-consults/requests"><i class="bi bi-clipboard2-pulse"></i><strong>My Patient Requests</strong><span>Add a new patient, or check the status of ones you already sent.</span></a>` : ""}
                ${has(ROLE.consult) ? html`<a class="card link-tile" href="#/network-consults/consult"><i class="bi bi-people"></i><strong>Department Consults</strong><span>See the patient cases sent to your department for review.</span></a>` : ""}
                ${has(ROLE.nodal) ? html`<a class="card link-tile" href="#/network-consults/nodal"><i class="bi bi-diagram-3"></i><strong>Nodal Overview</strong><span>Review new patient cases and assign them to a specialist.</span></a>` : ""}
                <a class="card link-tile" href="#/network-consults/themes"><i class="bi bi-tags"></i><strong>Consult Topics</strong><span>Browse the areas our specialists are available to advise on.</span></a>
            </div>
            ${section("Programme at a Glance", html`<div id="ncDashboard">${skeletonCards(3, "kpi-grid")}</div>`, {
                description: "Live summary of consults, questions and registrations",
                actions: html`<button type="button" class="btn btn-secondary btn-sm" data-refresh><i class="bi bi-arrow-clockwise"></i> Refresh</button>`
            })}`);

        view.querySelector("[data-register]")?.addEventListener("click", openRegistration);
        view.querySelector("[data-refresh]").addEventListener("click", () => loadDashboard(view.querySelector("#ncDashboard")));

        loadDashboard(view.querySelector("#ncDashboard"));

    }

    async function loadDashboard(box) {

        box.innerHTML = String(skeletonCards(3, "kpi-grid"));

        const results = await ConnectAPI.fetchMany([
            { collection: "NetConsltPatient", query: { isDeleted: false }, projection: { patientId: 1, patientName: 1, patientStatus: 1, gender: 1, age: 1, patientRelatedThemeName: 1, instHsptlName: 1, added: 1 }, options: { sort: { "added.addedDate": -1 } } },
            { collection: "NetConsltRegApp", query: { isDeleted: false }, projection: { name: 1, designation: 1, status: 1, roles: 1, added: 1 } },
            { collection: "NetConsltTheme", query: { isDeleted: false }, projection: { themeName: 1, description: 1 } }
        ]);

        let queries = [];

        try {
            queries = await ConnectAPI.rows({ collection: "NetConsltPatientQuery", query: { isDeleted: false }, options: { sort: { "added.addedDate": -1 } } }, "fetchCollectionDataFromDB");
        } catch (error) {
            console.error(error);
        }

        if (results.NetConsltPatient.error) {
            box.innerHTML = String(errorState(results.NetConsltPatient.error));
            return;
        }

        const visits = results.NetConsltPatient.data;
        const apps = results.NetConsltRegApp.data;
        const themes = results.NetConsltTheme.data;
        const cases = latestPerPatient(visits);

        const open = queries.filter(q => !q.answers?.length);
        const high = open.filter(q => q.questionTag === "High").length;

        const gaps = queries.map(q => {
            const asked = toDate(q.added?.addedDate);
            const first = (q.answers || []).map(a => toDate(a.added?.addedDate)).filter(Boolean).sort((a, b) => a - b)[0];
            return asked && first && first >= asked ? first - asked : null;
        }).filter(v => v !== null);

        const consultants = apps.filter(a => (a.roles || []).some(r => (r?._id || r) === "NC Consultant")).length;
        const used = new Set(cases.map(c => (c.patientRelatedThemeName || "").trim()).filter(Boolean));

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const inRange = (from, to) => cases.filter(c => { const d = toDate(c.added?.addedDate); return d && d >= from && (!to || d < to); }).length;
        const thisMonth = inRange(monthStart);
        const lastMonth = inRange(prevStart, monthStart);
        const trend = !lastMonth ? (thisMonth ? "New this month" : "No cases last month") : `${thisMonth >= lastMonth ? "▲" : "▼"} ${Math.abs(Math.round(((thisMonth - lastMonth) / lastMonth) * 100))}% vs last month`;

        const kpi = (icon, label, value, foot) => html`<div class="card kpi"><i class="bi ${icon}"></i><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;

        const caseCounts = {};
        cases.forEach(c => { const key = c.patientStatus || "New"; caseCounts[key] = (caseCounts[key] || 0) + 1; });

        const appCounts = {};
        apps.forEach(a => { const key = a.status || "Submitted"; appCounts[key] = (appCounts[key] || 0) + 1; });

        const byTheme = new Map();
        cases.forEach(c => { const name = (c.patientRelatedThemeName || "").trim() || "Not specified"; byTheme.set(name, (byTheme.get(name) || 0) + 1); });
        let themeRows = [...byTheme.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        if (themeRows.length > 6) {
            const rest = themeRows.slice(6);
            themeRows = [...themeRows.slice(0, 6), { name: `Other (${rest.length})`, value: rest.reduce((s, r) => s + r.value, 0) }];
        }
        const maxTheme = Math.max(1, ...themeRows.map(r => r.value));

        const activity = [];
        visits.forEach(v => { const when = toDate(v.added?.addedDate); if (when) activity.push({ when, icon: "bi-file-earmark-medical", text: html`<strong>Dr. ${v.added?.userName || "A network doctor"}</strong> submitted a case — ${v.patientName || v.patientId || "patient"}${v.patientRelatedThemeName ? ` (${v.patientRelatedThemeName})` : ""}` }); });
        queries.forEach(q => {
            const asked = toDate(q.added?.addedDate);
            if (asked) activity.push({ when: asked, icon: "bi-question-circle", text: html`<strong>Dr. ${q.added?.userName || "-"}</strong> asked a ${q.questionTag || "new"} priority question on ${q.patientId || "a case"}` });
            (q.answers || []).forEach(a => { const when = toDate(a.added?.addedDate); if (when) activity.push({ when, icon: "bi-chat-left-text", text: html`<strong>Dr. ${a.added?.userName || "-"}</strong> answered a question on ${q.patientId || "a case"}` }); });
        });
        activity.sort((a, b) => b.when - a.when);

        box.innerHTML = String(html`
            <div class="kpi-grid">
                ${kpi("bi-folder2-open", "Total patient cases", cases.length, `${visits.length} visit${visits.length === 1 ? "" : "s"} recorded`)}
                ${kpi("bi-question-circle", "Open questions", open.length, high ? `${high} marked High priority` : "None at High priority")}
                ${kpi("bi-stopwatch", "Avg. response time", gaps.length ? duration(gaps.reduce((s, v) => s + v, 0) / gaps.length) : "--", gaps.length ? `across ${gaps.length} answered question${gaps.length === 1 ? "" : "s"}` : "No answered questions yet")}
                ${kpi("bi-person-badge", "Consultants", consultants, `${apps.length} registration${apps.length === 1 ? "" : "s"} in total`)}
                ${kpi("bi-tags", "Consult themes", themes.length, `${used.size} with cases submitted`)}
                ${kpi("bi-calendar-month", "Cases this month", thisMonth, trend)}
            </div>
            <div class="two-col">
                <div class="card panel"><div class="panel-header"><div><h2>Consults by Theme</h2><p>${themes.length} themes registered</p></div></div><div class="panel-body">
                    ${themeRows.length ? html`<ul class="bar-chart">${themeRows.map(r => html`<li><span class="bar-label" title="${r.name}">${r.name}</span><span class="bar-track"><span class="bar" style="width:${Math.max(4, Math.round((r.value / maxTheme) * 100))}%"></span></span><span class="bar-value">${r.value}</span></li>`)}</ul>` : emptyState("bi-bar-chart", "No cases submitted yet.")}
                </div></div>
                <div class="card panel"><div class="panel-header"><div><h2>Recent Activity</h2><p>Newest first</p></div></div><div class="panel-body">
                    ${activity.length ? html`<ul class="activity-feed">${activity.slice(0, 8).map(a => html`<li><i class="bi ${a.icon}"></i><span>${a.text}</span><time>${formatDate(a.when, "short")}</time></li>`)}</ul>` : emptyState("bi-activity", "No activity yet.")}
                </div></div>
            </div>
            <div class="two-col">
                <div class="card panel"><div class="panel-header"><div><h2>Patient Case Status</h2><p>${cases.length} cases</p></div></div><div class="panel-body">
                    ${segmented([{ key: "New", label: "New / unassigned", tone: "accent" }, { key: "Pending", label: "Pending", tone: "warning" }, { key: "Allotted", label: "Allotted", tone: "success" }, { key: "Referred", label: "Referred", tone: "purple" }], caseCounts, cases.length, "case")}
                </div></div>
                <div class="card panel"><div class="panel-header"><div><h2>Registration Applications</h2><p>${apps.length} applications</p></div></div><div class="panel-body">
                    ${segmented([{ key: "Submitted", label: "Submitted", tone: "warning" }, { key: "Approved", label: "Approved", tone: "success" }, { key: "Rejected", label: "Rejected", tone: "danger" }], appCounts, apps.length, "application")}
                </div></div>
            </div>`);

    }


    // -----------------------------------------------------------------
    // Themes (renderNcThemes)
    // -----------------------------------------------------------------

    async function renderThemes(view) {

        view.innerHTML = String(html`${header("themes")}${section("Consult Topics", html`<div id="themes">${skeletonCards(4)}</div>`, { description: "These are the areas our specialists can advise you on." })}`);

        const box = view.querySelector("#themes");

        try {
            const themes = await ConnectAPI.rows({ collection: "NetConsltTheme", query: { isDeleted: false } });
            box.innerHTML = themes.length
                ? String(html`<div class="theme-grid">${themes.map(t => html`
                    <article class="card theme-card">${img(t.iconUpload?.[0]?.data?.url || t.iconUpload?.[0]?.url || PLACEHOLDER, t.themeName, "theme-card-img")}
                        <div><h3>${t.themeName}</h3>${t.description ? html`<p>${t.description}</p>` : ""}</div></article>`)}</div>`)
                : String(emptyState("bi-tags", "No consult themes yet"));
        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }


    // -----------------------------------------------------------------
    // My patient requests (ncPatientReqtable / ncPatientReqForm)
    // -----------------------------------------------------------------

    async function nextPatientId() {

        const [last] = await ConnectAPI.rows({ collection: "NetConsltPatient", query: { isDeleted: false, patientId: { $exists: true, $ne: null } }, projection: { patientId: 1 }, options: { limit: 1, sort: { patientId: -1 } } });
        const year = new Date().getFullYear().toString().slice(2);
        const lastNum = Number(String(last?.patientId || `${year}NC0000`).split("NC")[1]) || 0;

        return `${year}NC${String(lastNum + 1).padStart(4, "0")}`;

    }

    function openCaseForm(type, existing, onSaved) {

        Forms.open({
            title: type === "add" ? "Add Patient Request" : type === "edit" ? `Edit ${existing.patientName || ""} Request` : `Add ${existing.patientName || ""} Request`,
            formKey: "clinicalCaseDiscussion",
            successMessage: `Patient request ${type === "edit" ? "updated" : "submitted"} successfully.`,
            onReady: async form => {

                if (existing) {

                    form.submission = { data: type === "edit" ? existing : { patientName: existing.patientName, gender: existing.gender, age: existing.age } };

                    ["patientId", "patientName", "gender"].forEach(key => {
                        const comp = form.getComponent(key);
                        if (comp) { comp.disabled = true; comp.redraw?.(); }
                    });

                }

            },
            onSubmit: async data => {

                const doc = await Forms.uploadFiles({ ...data, isDeleted: false }, "NetConsltPatient");

                delete doc._id;

                if (type === "edit") {
                    await ConnectAPI.update("NetConsltPatient", { _id: existing._id }, { $set: { ...doc, modified: stamp("modifiedDate") } });
                } else {
                    doc.patientId = type === "nextVisit" ? existing.patientId : await nextPatientId();
                    await ConnectAPI.insert("NetConsltPatient", { ...doc, added: stamp("addedDate") });
                }

                onSaved?.();

            }
        });

    }

    async function renderRequests(view) {

        view.innerHTML = String(html`
            ${header("requests")}
            ${section("My Patient Requests", html`
                <div class="table-actions"><button type="button" class="btn btn-primary btn-sm" data-add><i class="bi bi-plus-lg"></i> Enter new patient</button></div>
                <div id="reqTable">${skeletonList(4)}</div>`, { description: "Add a new patient case here, or click any row below to see its full summary." })}
            <div id="reqSummary"></div>`);

        const box = view.querySelector("#reqTable");
        let rows = [];
        let table = null;

        const load = async () => {

            try {

                rows = await ConnectAPI.rows({ collection: "NetConsltPatient", query: { isDeleted: false, "added.userId": me().id }, options: { sort: { "added.addedDate": -1 } } });

                const columns = [
                    { key: "patientId", title: "Patient ID" },
                    { key: "patientName", title: "Patient Name", render: r => html`<button type="button" class="link-button" data-summary="${r._id}">${r.patientName || "—"}</button>` },
                    { key: "gender", title: "Gender" },
                    { key: "added", title: "Date", sortValue: r => r.added?.addedDate || "", render: r => date(r.added?.addedDate) },
                    { key: "modified", title: "Last Seen Date", sortValue: r => r.modified?.modifiedDate || "", render: r => date(r.modified?.modifiedDate) },
                    {
                        key: "actions", title: "Actions", sortable: false, className: "cell-actions",
                        render: r => html`
                            <button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="nextVisit" data-id="${r._id}" title="Add next visit" aria-label="Add next visit"><i class="bi bi-plus-lg"></i></button>
                            <button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="edit" data-id="${r._id}" title="Edit" aria-label="Edit"><i class="bi bi-pencil"></i></button>
                            <a class="btn btn-secondary btn-icon btn-sm" href="#/network-consults/patient/${encodeURIComponent(r.patientId || "")}" title="Open workspace" aria-label="Open workspace"><i class="bi bi-layout-text-sidebar"></i></a>
                            <button type="button" class="btn btn-danger-soft btn-icon btn-sm" data-act="delete" data-id="${r._id}" title="Delete" aria-label="Delete"><i class="bi bi-trash3"></i></button>`
                    }
                ];

                if (table) table.setRows(rows);
                else table = dataTable(box, { columns, rows, searchPlaceholder: "Search patients", emptyText: "No patient requests yet. Use Enter new patient to add one." });

            } catch (error) {
                box.innerHTML = String(errorState(error.message));
            }

        };

        view.querySelector("[data-add]").addEventListener("click", () => openCaseForm("add", null, load));

        box.addEventListener("click", async event => {

            const summary = event.target.closest("[data-summary]");

            if (summary) {
                const r = rows.find(x => String(x._id) === summary.dataset.summary);
                const awaited = value => value || "Details Awaited";
                view.querySelector("#reqSummary").innerHTML = String(section("Patient Summary", html`
                    <dl class="info-grid">
                        <div class="info-grid-item"><dt>Name</dt><dd>${awaited(r.patientName)}</dd></div>
                        <div class="info-grid-item"><dt>Age</dt><dd>${awaited(r.age)}</dd></div>
                        <div class="info-grid-item"><dt>Place</dt><dd>${awaited(r.instHsptlName)}</dd></div>
                        <div class="info-grid-item"><dt>Start date</dt><dd>${awaited(formatDate(r.added?.addedDate))}</dd></div>
                        <div class="info-grid-item"><dt>Last seen date</dt><dd>${awaited(formatDate(r.lastSeenDate))}</dd></div>
                        <div class="info-grid-item info-grid-wide"><dt>History</dt><dd>${awaited(r.history)}</dd></div>
                        <div class="info-grid-item info-grid-wide"><dt>Investigations</dt><dd>${awaited(r.investigations)}</dd></div>
                        <div class="info-grid-item info-grid-wide"><dt>Plan</dt><dd>${awaited(r.plan)}</dd></div>
                    </dl>`));
                view.querySelector("#reqSummary").scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            const button = event.target.closest("[data-act]");

            if (!button) return;

            const row = rows.find(x => String(x._id) === button.dataset.id);

            if (button.dataset.act === "delete") {

                if (!await Forms.confirm({ title: "Delete this patient request?", message: "Are you sure you want to delete this patient request?", confirmLabel: "Delete", danger: true })) return;

                try {
                    await ConnectAPI.update("NetConsltPatient", { _id: row._id }, { $set: { isDeleted: true, modified: stamp("modifiedDate") } });
                    UI.toast("Patient request deleted", { type: "success" });
                    load();
                } catch (error) {
                    UI.toast(error.message, { type: "error" });
                }

                return;

            }

            openCaseForm(button.dataset.act, row, load);

        });

        load();

    }


    // -----------------------------------------------------------------
    // Consult / nodal pages
    // -----------------------------------------------------------------

    const deptName = a => Array.isArray(a.cmcDepartments) ? a.cmcDepartments.map(d => d?.name).filter(Boolean).join(", ") : (a.cmcDepartments?.name || a.department || "-");
    const unitName = a => a.cmcUnit?.name || (Array.isArray(a.cmcUnits) ? a.cmcUnits.map(u => u?.name || u).filter(Boolean).join(", ") : a.cmcUnits) || "-";
    const instName = a => a.missionHospital?.missionHospitalName || a.hospitalName || "CMC";

    function personDetails(a) {
        openDialog({
            title: a.name || "Details",
            body: html`<dl class="info-grid">
                <div class="info-grid-item"><dt>Designation</dt><dd>${a.designation || "-"}</dd></div>
                <div class="info-grid-item"><dt>Institution/Hospital</dt><dd>${instName(a)}</dd></div>
                <div class="info-grid-item"><dt>Department</dt><dd>${deptName(a)}</dd></div>
                <div class="info-grid-item"><dt>Units</dt><dd>${unitName(a)}</dd></div>
                <div class="info-grid-item"><dt>Status</dt><dd>${Forms.statusBadge(a.status)}</dd></div>
                <div class="info-grid-item"><dt>Registered</dt><dd>${date(a.added?.addedDate)}</dd></div>
            </dl>`
        });
    }

    async function patientCards(box, { mineOnly = false } = {}) {

        try {

            const [patients, logs] = await Promise.all([
                ConnectAPI.rows({ collection: "NetConsltPatient", query: { isDeleted: false }, options: { sort: { "added.addedDate": -1 } } }),
                ConnectAPI.rows({ collection: "NCAllotDocLog", query: { "allottedTo.docId": me().id } }, "fetchCollectionDataFromDB").catch(() => [])
            ]);

            const allotted = new Set(logs.map(l => l.patientId));
            const list = latestPerPatient(patients).filter(p => !mineOnly || allotted.has(p.patientId));

            box.innerHTML = list.length
                ? String(html`<div class="case-grid">${list.map(p => html`
                    <a class="card case-card" href="#/network-consults/patient/${encodeURIComponent(p.patientId || "")}">
                        <strong>${p.patientName || ""}</strong>
                        <span class="text-muted">${p.patientId || ""}</span>
                        ${allotted.has(p.patientId) ? html`<span class="badge badge-accent">Allotted to you</span>` : ""}
                        ${p.patientStatus ? Forms.statusBadge(p.patientStatus) : html`<span class="badge">New</span>`}
                        <dl><dt>Hospital</dt><dd>${p.instHsptlName || "-"}</dd><dt>Added By</dt><dd>Dr. ${p.added?.userName || "-"}</dd><dt>Date</dt><dd>${date(p.added?.addedDate)}</dd></dl>
                    </a>`)}</div>`)
                : String(emptyState("bi-folder2-open", "No new patient requests."));

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }

    async function renderConsult(view) {

        const user = me();

        view.innerHTML = String(html`
            ${header("consult")}
            ${section("Patient cases", html`<div id="consultCases">${skeletonCards(4)}</div>`, { description: "Patient cases sent to your department, waiting for your opinion." })}
            ${section(`${user.department || "Department"} Consults`, html`<div id="deptTable">${skeletonList(3)}</div>`)}`);

        patientCards(view.querySelector("#consultCases"));

        const box = view.querySelector("#deptTable");

        try {

            const rows = await ConnectAPI.rows({ collection: "NetConsltRegApp", query: has(ROLE.consult) ? { isDeleted: false, "cmcDepartments._id": user.departmentId } : { isDeleted: false } });

            dataTable(box, {
                columns: [
                    { key: "name", title: "Name" },
                    { key: "designation", title: "Designation" },
                    { key: "unit", title: "Units", sortValue: unitName, render: unitName },
                    { key: "details", title: "Details", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-person="${r._id}">Details</button>` }
                ],
                rows,
                searchPlaceholder: "Search consultants"
            });

            box.addEventListener("click", event => {
                const b = event.target.closest("[data-person]");
                if (b) personDetails(rows.find(r => String(r._id) === b.dataset.person));
            });

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }

    async function renderNodal(view) {

        view.innerHTML = String(html`
            ${header("nodal")}
            ${section("Nodal Overview", html`<div id="nodalCases">${skeletonCards(4)}</div>`, { description: "New patient cases waiting for you to assign them to the right specialist." })}
            ${section("Nodal officers", html`<div id="nodalTable">${skeletonList(3)}</div>`)}`);

        patientCards(view.querySelector("#nodalCases"));

        const box = view.querySelector("#nodalTable");

        try {

            const rows = await ConnectAPI.rows({ collection: "NetConsltRegApp", query: { isDeleted: false, "roles._id": "NC Nodal" } });

            dataTable(box, {
                columns: [
                    { key: "name", title: "Name" },
                    { key: "designation", title: "Designation" },
                    { key: "inst", title: "Institution/Hospital Name", sortValue: instName, render: instName },
                    { key: "unit", title: "Units", sortValue: unitName, render: unitName },
                    { key: "details", title: "Details", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-person="${r._id}">Details</button>` }
                ],
                rows,
                searchPlaceholder: "Search nodal officers"
            });

            box.addEventListener("click", event => {
                const b = event.target.closest("[data-person]");
                if (b) personDetails(rows.find(r => String(r._id) === b.dataset.person));
            });

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }


    // -----------------------------------------------------------------
    // Patient workspace
    // -----------------------------------------------------------------

    const REPORTS = [
        { label: "Medical Reports 1", files: "medicalReport1", summary: "summaryOfReport1", date: "medicalReport1Date" },
        { label: "Medical Reports 2", files: "medicalReport2", summary: "medicalReport2Summary", date: "medicalReport2Date" },
        { label: "Radiological Reports", files: "radioImgReports", summary: "radioImgReportsSummary" },
        { label: "Histopathological Reports 1", files: "histopathoReport1", summary: "histopathoReport1Summary" },
        { label: "Histopathological Reports 2", files: "histopathoReport2", summary: "histopathoReport2Summary" },
        { label: "Blood Reports", files: "bloodReports", summary: "bloodReportsSummary" }
    ];

    const fileUrlOf = f => f?.url || f?.data?.url || "";
    const isImage = f => /\.(png|jpe?g|gif|webp|bmp|tiff?)(\?|$)/i.test(fileUrlOf(f) || f?.originalName || "") || String(f?.type || "").startsWith("image/");

    const fileLinks = files => files.length
        ? html`<ul class="file-list">${files.map(f => html`<li><i class="bi ${isImage(f) ? "bi-image" : "bi-file-earmark"}"></i><span>${f.originalName || f.name || "File"}</span>${safeUrl(fileUrlOf(f)) ? html`<a class="btn btn-secondary btn-sm" href="${safeUrl(fileUrlOf(f))}" target="_blank" rel="noopener">Open</a>` : ""}</li>`)}</ul>`
        : html`<p class="text-muted">No files uploaded.</p>`;

    async function renderPatient(view, patientId) {

        view.innerHTML = String(html`${header(null, "Patient workspace")}${skeletonCards(2)}`);

        let visits, myAllotment;

        try {
            [visits, myAllotment] = await Promise.all([
                ConnectAPI.rows({ collection: "NetConsltPatient", query: { patientId, isDeleted: false }, options: { sort: { "added.addedDate": -1 } } }),
                ConnectAPI.rows({ collection: "NCAllotDocLog", query: { patientId, "allottedTo.docId": me().id } }, "fetchCollectionDataFromDB").catch(() => [])
            ]);
        } catch (error) {
            view.innerHTML = String(html`${header(null, "Patient workspace")}${errorState(error.message)}`);
            return;
        }

        const latest = visits[0];

        if (!latest) {
            view.innerHTML = String(html`${header(null, "Patient workspace")}${emptyState("bi-person-x", "Patient not found", "This case may have been deleted.")}`);
            return;
        }

        const isNodal = has(ROLE.nodal);
        const isConsultant = has(ROLE.consult);
        const myEntry = myAllotment[0]?.allottedTo?.find(a => a.docId === me().id);
        let selected = latest;
        let pollTimer = null;
        let lastSignature = "";
        let activeQuestion = null;

        view.innerHTML = String(html`
            ${pageHeader({ title: latest.patientName || "Patient Name", eyebrow: latest.patientId || "Patient Id", icon: "bi-person-vcard", color: "red", back: { href: "#/network-consults", label: "Network Consults" } })}
            <div class="workspace">
                <aside class="card workspace-side">
                    ${isNodal ? html`<label class="field"><span class="field-label">Patient Status</span>
                        <select class="input" data-status><option value="">Select Status</option>${["Allotted", "Pending", "Referred"].map(s => html`<option ${latest.patientStatus === s ? raw("selected") : ""}>${s}</option>`)}</select></label>` : ""}
                    ${isConsultant && myEntry ? html`<label class="field"><span class="field-label">Approval Status</span>
                        <select class="input" data-approval><option value="">Select Status</option>${["Accepted", "Rejected"].map(s => html`<option ${myEntry.status === s ? raw("selected") : ""}>${s}</option>`)}</select></label>` : ""}
                    ${visits.length > 1 ? html`<label class="field"><span class="field-label">Total Visits</span>
                        <select class="input" data-visit>${visits.map((v, i) => html`<option value="${v._id}">${i === 0 ? `Visit ${visits.length} (Latest)` : `Visit ${visits.length - i}`}</option>`)}</select></label>` : ""}
                    <nav class="workspace-nav" role="tablist">
                        ${[["overview", "bi-person", "Overview", "Patient details and diagnosis"], ["queries", "bi-chat-square-text", "Case Discussion - Q&A", "Ask CMC specialists a question"], ["reports", "bi-file-earmark-medical", "Reports", "Lab and medical reports"], ["images", "bi-images", "Images", "X-rays and scans"]]
                            .map(([id, icon, label, sub], i) => html`<button type="button" role="tab" data-tab="${id}" class="${i === 0 ? "is-active" : ""}"><i class="bi ${icon}"></i><span><strong>${label}</strong><small>${sub}</small></span></button>`)}
                        <button type="button" role="tab" data-tab="call" ${latest.ncCall?.ncCall === "Yes" ? "" : raw("hidden")}><i class="bi bi-camera-video"></i><span><strong>Conference Call</strong><small>Join the discussion call</small></span></button>
                        ${isNodal ? html`<button type="button" role="tab" data-tab="allot"><i class="bi bi-person-check"></i><span><strong>Allotted Doctors</strong><small>Doctors assigned to this case</small></span></button>` : ""}
                    </nav>
                </aside>
                <div class="workspace-main" data-pane></div>
            </div>`);

        const pane = view.querySelector("[data-pane]");

        const stopPolling = () => { if (pollTimer) clearInterval(pollTimer); pollTimer = null; };

        const tabs = {

            overview() {
                const r = selected;
                pane.innerHTML = String(html`
                    ${section("Demographics", html`<dl class="info-grid">
                        ${[["Name", r.patientName], ["Patient ID", r.patientId], ["Gender", r.gender], ["Age", r.age], ["Hospital", r.instHsptlName], ["Pincode", r.pincode]].map(([k, v]) => html`<div class="info-grid-item"><dt>${k}</dt><dd>${v || "-"}</dd></div>`)}
                    </dl>`)}
                    ${section("Diagnosis", html`<dl class="info-grid">
                        ${[["Primary Diagnosis", r.diagnosisPrimary], ["ICD Diagnosis", r.icdDiagnosis], ["Date", formatDate(r.added?.addedDate)], ["Theme", r.patientRelatedThemeName]].map(([k, v]) => html`<div class="info-grid-item"><dt>${k}</dt><dd>${v || "-"}</dd></div>`)}
                    </dl>`)}
                    ${section("Clinical Details", html`<div class="prose">${multiline(r.patientClinicalDetails || "-")}</div>`)}
                    ${isConsultant ? section("Does this patient require a Conference Call?", html`
                        <div class="inline-form"><select class="input" data-call>${["Yes", "No"].map(v => html`<option ${(latest.ncCall?.ncCall || "No") === v ? raw("selected") : ""}>${v}</option>`)}</select>
                        <button type="button" class="btn btn-primary" data-call-save>Submit</button></div>`) : ""}`);
            },

            reports() {
                const r = selected;
                pane.innerHTML = REPORTS.map(rep => String(section(rep.label, html`
                    ${rep.date && r[rep.date] ? html`<p><strong>Date:</strong> ${date(r[rep.date])}</p>` : ""}
                    ${fileLinks(r[rep.files] || [])}
                    <h4 class="detail-subhead">Summary</h4><p class="text-muted">${r[rep.summary] || "No summary available."}</p>`))).join("");
            },

            images() {
                const r = selected;
                const groups = REPORTS.map(rep => ({ label: rep.label, files: (r[rep.files] || []).filter(isImage) })).filter(g => g.files.length);
                pane.innerHTML = groups.length
                    ? groups.map(g => String(section(g.label, html`<div class="image-grid">${g.files.map(f => html`<a href="${safeUrl(fileUrlOf(f)) || "#"}" target="_blank" rel="noopener">${img(fileUrlOf(f), f.originalName || g.label, "image-grid-img")}</a>`)}</div>`))).join("")
                    : String(section("Images", emptyState("bi-image", "No images uploaded for this visit.")));
            },

            queries() {
                pane.innerHTML = String(html`
                    <div class="card panel qa">
                        <div class="panel-header"><div><h2>Questions</h2></div>
                            <div class="panel-actions"><button type="button" class="btn btn-secondary btn-sm" data-qa-refresh><i class="bi bi-arrow-clockwise"></i> Refresh</button>
                            <button type="button" class="btn btn-primary btn-sm" data-qa-add><i class="bi bi-plus-lg"></i> Add</button></div></div>
                        <form class="qa-new" data-qa-form hidden novalidate>
                            <label class="field"><span class="field-label">Priority</span><select class="input" name="questionTag"><option value="">Select Priority</option><option>High</option><option>Medium</option><option>Low</option></select></label>
                            <label class="field"><span class="field-label">Question</span><textarea class="input textarea" name="question" rows="3" maxlength="2000"></textarea><span class="field-error" data-error aria-live="polite"></span></label>
                            <div class="form-actions"><button type="button" class="btn btn-secondary" data-qa-cancel>Cancel</button><button type="submit" class="btn btn-primary">Submit</button></div>
                        </form>
                        <div class="qa-body"><div class="qa-list" data-qa-list>${skeletonList(3)}</div><div class="qa-thread" data-qa-thread><p class="text-muted">Select a question from the left panel to view discussion details.</p></div></div>
                    </div>`);
                loadQuestions(true);
                stopPolling();
                pollTimer = setInterval(() => loadQuestions(false), 10000);
            },

            call() {
                const c = latest.ncCall || {};
                pane.innerHTML = String(section("Conference Call", html`<p>Conference Call</p>${c.ncCallUpdatedBy ? html`<p class="text-muted">Enabled by ${c.ncCallUpdatedBy} on ${date(c.ncCallUpdatedOn)}</p>` : ""}`));
            },

            async allot() {
                pane.innerHTML = String(section("Allotted Doctor", html`<div class="table-actions"><button type="button" class="btn btn-primary btn-sm" data-allot><i class="bi bi-person-plus"></i> Allot Doctor</button></div><div data-allot-table>${skeletonList(2)}</div>`));
                loadAllotments();
            }

        };

        async function loadQuestions(force) {

            const list = view.querySelector("[data-qa-list]");

            if (!list) return stopPolling();

            let questions;

            try {
                questions = await ConnectAPI.rows({ collection: "NetConsltPatientQuery", query: { isDeleted: false, patientId: latest.patientId }, options: { sort: { "added.addedDate": -1 } } }, "fetchCollectionDataFromDB");
            } catch (error) {
                if (force) list.innerHTML = String(errorState(error.message));
                return;
            }

            const signature = questions.map(q => `${q._id}:${q.answers?.length ?? 0}`).join("|");

            if (!force && signature === lastSignature) return;

            lastSignature = signature;

            if (!questions.length) {
                list.innerHTML = String(emptyState("bi-chat-square-text", "No questions available"));
                return;
            }

            if (!questions.some(q => q._id === activeQuestion)) activeQuestion = questions[0]._id;

            const tone = t => t === "High" ? "danger" : t === "Medium" ? "warning" : "success";

            list.innerHTML = String(html`${questions.map(q => html`
                <button type="button" class="qa-item ${q._id === activeQuestion ? "is-active" : ""}" data-qid="${q._id}">
                    <span>${q.question || "Untitled Question"} ${q.questionTag ? html`<span class="badge badge-${tone(q.questionTag)}">${q.questionTag}</span>` : ""}</span>
                    <small>${q.added?.userName || ""} • ${date(q.added?.addedDate)}</small>
                </button>`)}`);

            list.onclick = event => {
                const item = event.target.closest("[data-qid]");
                if (!item) return;
                activeQuestion = item.dataset.qid;
                list.querySelectorAll("[data-qid]").forEach(b => b.classList.toggle("is-active", b === item));
                showThread(questions.find(q => q._id === activeQuestion));
            };

            showThread(questions.find(q => q._id === activeQuestion));

        }

        function showThread(q) {

            const thread = view.querySelector("[data-qa-thread]");

            if (!thread || !q) return;

            const answers = q.answers || [];

            thread.innerHTML = String(html`
                <h3>${q.question}</h3>
                <p class="text-muted">Asked by <strong>${q.added?.userName || ""}</strong></p>
                <h4 class="detail-subhead">Answers</h4>
                ${answers.length ? html`<div class="chat-thread">${answers.map(a => html`<div class="chat-msg ${a.added?.userId === me().id ? "from" : "to"}"><div class="chat-meta"><strong>${a.added?.userId === me().id ? "Me" : (a.added?.userName || "")}</strong></div><div>${multiline(a.answer || "")}</div></div>`)}</div>` : html`<p class="text-muted">No answers yet</p>`}
                <form data-answer novalidate>
                    <label class="sr-only" for="ncAnswer">Your answer</label>
                    <textarea id="ncAnswer" class="input textarea" rows="4" placeholder="Write your answer..." maxlength="5000"></textarea>
                    <span class="field-error" data-error aria-live="polite"></span>
                    <div class="form-actions"><button type="submit" class="btn btn-primary">Submit Answer</button></div>
                </form>`);

            thread.querySelector("[data-answer]").addEventListener("submit", async event => {

                event.preventDefault();

                const input = thread.querySelector("textarea");
                const error = thread.querySelector("[data-error]");
                const text = input.value.trim();

                if (!text) {
                    input.classList.add("is-invalid");
                    error.textContent = "Please write an answer.";
                    return;
                }

                const button = event.submitter || thread.querySelector('button[type="submit"]');

                UI.setLoading(button, true);

                try {
                    await ConnectAPI.update("NetConsltPatientQuery", { _id: q._id }, { $push: { answers: { answer: text, added: stamp("addedDate") } } }, true);
                    await loadQuestions(true);
                } catch (err) {
                    UI.toast(err.message, { type: "error" });
                } finally {
                    UI.setLoading(button, false);
                }

            });

        }

        async function loadAllotments() {

            const box = view.querySelector("[data-allot-table]");

            try {

                const [log] = await ConnectAPI.rows({ collection: "NCAllotDocLog", query: { patientId: latest.patientId } }, "fetchCollectionDataFromDB");
                const rows = log?.allottedTo || [];

                dataTable(box, {
                    columns: [
                        { key: "docName", title: "Doctor Name" },
                        { key: "updatedDate", title: "Updated Date", render: r => date(r.updatedDate) },
                        { key: "status", title: "Status", render: r => Forms.statusBadge(r.status) },
                        { key: "action", title: "Action", sortable: false, render: r => html`<button type="button" class="btn btn-danger-soft btn-icon btn-sm" data-remove="${r.docId}" aria-label="Remove" title="Remove"><i class="bi bi-trash3"></i></button>` }
                    ],
                    rows,
                    emptyText: "No doctors allotted yet.",
                    searchPlaceholder: "Search doctors"
                });

                box.onclick = async event => {
                    const b = event.target.closest("[data-remove]");
                    if (!b || !await Forms.confirm({ title: "Remove this doctor?", message: "Are you sure you want to remove this doctor?", confirmLabel: "Remove", danger: true })) return;
                    try {
                        await ConnectAPI.update("NCAllotDocLog", { patientId: latest.patientId }, { $pull: { allottedTo: { docId: b.dataset.remove } } }, true);
                        UI.toast("Doctor removed", { type: "success" });
                        loadAllotments();
                    } catch (error) {
                        UI.toast(error.message, { type: "error" });
                    }
                };

                view.querySelector("[data-allot]").onclick = () => allotDoctor(Boolean(log));

            } catch (error) {
                box.innerHTML = String(errorState(error.message));
            }

        }

        async function allotDoctor(logExists) {

            let consultants = [];

            try {
                consultants = await ConnectAPI.rows({ collection: "NetConsltRegApp", query: { "roles._id": { $in: ["NC Consultant"] }, isDeleted: false } });
            } catch (error) {
                UI.toast(error.message, { type: "error" });
                return;
            }

            const dialog = openDialog({
                title: "Select Doctor",
                size: "sm",
                body: html`<label class="field"><span class="field-label">Doctor</span>
                    <select class="input"><option value="">Select a doctor</option>${consultants.map(c => html`<option value="${c.userId}">${c.name}${c.cmcDepartments?.name ? ` - ${c.cmcDepartments.name}` : ""}</option>`)}</select>
                    <span class="field-error" aria-live="polite"></span></label>`,
                footer: html`<button type="button" class="btn btn-secondary" data-cancel>Cancel</button><button type="button" class="btn btn-primary" data-ok>Add</button>`
            });

            dialog.element.querySelector("[data-cancel]").addEventListener("click", dialog.close);

            dialog.element.querySelector("[data-ok]").addEventListener("click", async event => {

                const select = dialog.element.querySelector("select");

                if (!select.value) {
                    select.classList.add("is-invalid");
                    dialog.element.querySelector(".field-error").textContent = "Please select a doctor.";
                    return;
                }

                const entry = { docId: select.value, docName: consultants.find(c => c.userId === select.value)?.name || "", status: "Pending", updatedDate: ConnectAPI.date(Date.now()) };

                UI.setLoading(event.currentTarget, true);

                try {
                    if (logExists) await ConnectAPI.update("NCAllotDocLog", { patientId: latest.patientId }, { $push: { allottedTo: entry } }, true);
                    else await ConnectAPI.insert("NCAllotDocLog", { patientId: latest.patientId, allottedTo: [entry] }, true);
                    UI.toast("Doctor allotted", { type: "success" });
                    dialog.close();
                    loadAllotments();
                } catch (error) {
                    UI.toast(error.message, { type: "error" });
                    UI.setLoading(event.currentTarget, false);
                }

            });

        }

        function show(tab) {
            stopPolling();
            view.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("is-active", b.dataset.tab === tab));
            tabs[tab]();
        }

        view.querySelector(".workspace-nav").addEventListener("click", event => {
            const b = event.target.closest("[data-tab]");
            if (b) show(b.dataset.tab);
        });

        view.querySelector("[data-visit]")?.addEventListener("change", event => {
            selected = visits.find(v => v._id === event.target.value) || latest;
            const active = view.querySelector("[data-tab].is-active")?.dataset.tab || "overview";
            if (active !== "queries") show(active);
        });

        view.querySelector("[data-status]")?.addEventListener("change", async event => {

            const select = event.target;
            const value = select.value;

            if (!value) return;

            if (!await Forms.confirm({ title: "Update status", message: "Are you sure you want to update the status for this patient?", confirmLabel: "Update" })) {
                select.value = latest.patientStatus || "";
                return;
            }

            const update = { patientStatus: value, patientStatusUpdatedBy: me().name || "", patientStatusUpdatedById: me().id || "", patientStatusUpdatedOn: ConnectAPI.date(Date.now()) };

            try {
                if (value === "Allotted" && !latest.patientId) update.patientId = await nextPatientId();
                await ConnectAPI.update("NetConsltPatient", { _id: latest._id }, { $set: update }, true);
                Object.assign(latest, update);
                UI.toast("Status updated", { type: "success" });
            } catch (error) {
                UI.toast("Could not update the status. Please try again.", { type: "error", message: error.message });
                select.value = latest.patientStatus || "";
            }

        });

        view.querySelector("[data-approval]")?.addEventListener("change", async event => {

            const select = event.target;

            if (!select.value || !await Forms.confirm({ title: "Update approval", message: "Are you sure you want to update the status for this patient?", confirmLabel: "Update" })) {
                select.value = myEntry.status || "";
                return;
            }

            try {
                await ConnectAPI.update("NCAllotDocLog", { patientId: latest.patientId, "allottedTo.docId": me().id }, { $set: { "allottedTo.$.status": select.value, "allottedTo.$.updatedDate": ConnectAPI.date(Date.now()) } }, true);
                myEntry.status = select.value;
                UI.toast("Approval status updated", { type: "success" });
            } catch (error) {
                UI.toast(error.message, { type: "error" });
                select.value = myEntry.status || "";
            }

        });

        view.addEventListener("click", async event => {

            if (event.target.closest("[data-qa-add]")) {
                const form = view.querySelector("[data-qa-form]");
                form.hidden = !form.hidden;
                if (!form.hidden) form.elements.question.focus();
            }

            if (event.target.closest("[data-qa-cancel]")) view.querySelector("[data-qa-form]").hidden = true;

            if (event.target.closest("[data-qa-refresh]")) loadQuestions(true);

            if (event.target.closest("[data-call-save]")) {

                const value = view.querySelector("[data-call]").value;

                if (!await Forms.confirm({ title: "Conference call", message: "Are you sure you want to update the conference call for this patient?", confirmLabel: "Update" })) return;

                const ncCall = { ncCall: value, ncCallUpdatedBy: me().name || "", ncCallUpdatedById: me().id || "", ncCallUpdatedOn: ConnectAPI.date(Date.now()) };

                try {
                    await ConnectAPI.update("NetConsltPatient", { patientId: latest.patientId }, { $set: { ncCall } }, true);
                    latest.ncCall = { ...ncCall, ncCallUpdatedOn: new Date().toISOString() };
                    view.querySelector('[data-tab="call"]').hidden = value !== "Yes";
                    UI.toast("Conference call updated", { type: "success" });
                    if (value === "Yes") show("call");
                } catch (error) {
                    UI.toast("Could not update the conference call. Please try again.", { type: "error", message: error.message });
                }

            }

        });

        view.addEventListener("submit", async event => {

            const form = event.target.closest("[data-qa-form]");

            if (!form) return;

            event.preventDefault();

            const question = form.elements.question.value.trim();
            const error = form.querySelector("[data-error]");

            if (!question) {
                form.elements.question.classList.add("is-invalid");
                error.textContent = "Please type your question.";
                return;
            }

            const button = event.submitter;

            UI.setLoading(button, true);

            try {
                await ConnectAPI.insert("NetConsltPatientQuery", { patientId: latest.patientId, questionTag: form.elements.questionTag.value, question, answers: [], isDeleted: false, added: stamp("addedDate") }, true);
                form.reset();
                form.hidden = true;
                activeQuestion = null;
                await loadQuestions(true);
            } catch (err) {
                UI.toast(err.message, { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

        show("overview");

        return stopPolling;

    }


    // -----------------------------------------------------------------
    // Router
    // -----------------------------------------------------------------

    function render(view, params) {

        const [page, id] = params;

        if (page === "patient" && id) return renderPatient(view, id);
        if (page === "themes") return renderThemes(view);

        if (ROLE[page] && !has(ROLE[page])) {
            view.innerHTML = String(html`${header("")}${emptyState("bi-shield-lock", "You don't have access to this page", `It is available to users with the ${ROLE[page]} role. Register as a network consultant or contact the Missions office.`)}`);
            return;
        }

        if (page === "requests") return renderRequests(view);
        if (page === "consult") return renderConsult(view);
        if (page === "nodal") return renderNodal(view);

        return renderHome(view);

    }

    App.register({
        id: "network-consults",
        title: "Network Consults",
        icon: "bi-heart-pulse",
        color: "red",
        group: "Missions",
        audiences: ["missions"],
        description: "Seek expert opinions from CMC specialists on patient care.",
        render
    });

})();
