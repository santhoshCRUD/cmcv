/**
 * Manpower Requests and the hospital administrator workspace.
 *
 * Ports of the git code:
 *   loadSubcard('manpowerRequest') + datatablesMsnLoad  -> #/manpower
 *   renderMissionHospitalUser + datatablesMsqLoad (formKey
 *     "externalMissionRequest", MissionRequests) + chatWorker.js
 *     (misnExtupdateComments), with loadLegalHelpDataTable /
 *     loadFinanceDataTable for the hospital                -> #/my-hospital/<id>
 *   "manpowerRequest" / "missionRequest" modals in modal.js.
 *
 * Git bug fixed: chatWorker.js put $push outside `data`, so messages
 * were never stored in misnExtupdateComments.
 */
(function () {

    const { html, esc, formatDate, emptyState, errorState, skeletonList, skeletonCards, pageHeader, section, dataTable, openDialog, safeUrl } = Kit;

    const me = () => window.currentUser || {};

    const byId = list => new Map((list || []).map(item => [String(item._id), item]));

    const names = (items, key = "name") => (items || []).map(item => (item && typeof item === "object") ? item[key] : item).filter(Boolean);

    const bullet = items => items.length
        ? html`<ul class="plain-list">${items.map(item => html`<li>${item}</li>`)}</ul>`
        : html`<span class="text-muted">-nill-</span>`;


    // -----------------------------------------------------------------
    // Request details (manpowerRequest / missionRequest modal)
    // -----------------------------------------------------------------

    function requestDetails(request, { hospitalName, specialization }) {

        const rows = [
            hospitalName ? ["bi-hospital", "Mission Hospital", hospitalName] : null,
            ["bi-clipboard2-pulse", "Request for Specialization", specialization || "—"],
            ["bi-clipboard-check", "Request Status", request.requestStatus || "—"],
            ["bi-person-badge", "Request Type", request.requestType || "—"],
            ["bi-flag", "Mission Status", Forms.statusBadge(request.missionStatus)],
            ["bi-mortarboard", "Linked Courses", bullet(names(request.selectedLinkedCourses))],
            ["bi-building", "Linked Departments", bullet(names(request.selectedLinkedDepartments))],
            ["bi-eye", "Visit Purpose", bullet(names(request.visitPurpose))],
            ["bi-calendar-range", "Mission Request", html`${formatDate(request.fromMsnHospDate) || "—"} <span class="text-muted">to</span> ${formatDate(request.toMsnHospDate) || "—"}`]
        ].filter(Boolean);

        return html`<dl class="detail-grid">${rows.map(([icon, label, value]) => html`
            <div class="detail-grid-item"><dt><i class="bi ${icon}"></i> ${label}</dt><dd>${value}</dd></div>`)}</dl>`;

    }


    // -----------------------------------------------------------------
    // Manpower Requests (datatablesMsnLoad)
    // -----------------------------------------------------------------

    async function renderManpower(view) {

        view.innerHTML = String(html`
            ${pageHeader({ title: "Manpower Requests", icon: "bi-people", color: "blue" })}
            ${section("Requests from mission hospitals", html`
                <div class="status-chips" role="group" aria-label="Filter by status">
                    <button type="button" class="status-chip" data-status="open" aria-pressed="false"><i class="bi bi-envelope-open"></i><span>Open</span><strong data-count="open">–</strong></button>
                    <button type="button" class="status-chip" data-status="inprogress" aria-pressed="false"><i class="bi bi-hourglass-split"></i><span>In progress</span><strong data-count="inprogress">–</strong></button>
                    <button type="button" class="btn btn-ghost btn-sm" data-clear hidden>Clear filter</button>
                </div>
                <div id="manpowerTable">${skeletonList(5)}</div>`)}`);

        const tableEl = view.querySelector("#manpowerTable");

        const results = await ConnectAPI.fetchMany([
            { collection: "MissionHospital", query: { isDeleted: "false" }, projection: { _id: 1, missionHospitalName: 1 } },
            { collection: "MissionRequests", query: { isDeleted: "false", missionStatus: { $in: ["Open", "InProgress"] } }, projection: { _id: 1, missionHospitalId: 1, selectedLinkedDepartments: 1, specializationId: 1, fromMsnHospDate: 1, toMsnHospDate: 1, missionStatus: 1, requestStatus: 1 } },
            { collection: "MissionSpecializations", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } }
        ]);

        if (results.MissionRequests.error) {
            tableEl.innerHTML = String(errorState(results.MissionRequests.error));
            return;
        }

        const hospitals = byId(results.MissionHospital.data);
        const specs = byId(results.MissionSpecializations.data);

        const rows = results.MissionRequests.data.map(r => ({
            ...r,
            hospitalName: hospitals.get(String(r.missionHospitalId))?.missionHospitalName || "",
            specializationName: specs.get(String(r.specializationId))?.name || "",
            status: String(r.missionStatus || "").toLowerCase().replace(/\s+/g, "")
        }));

        const filter = new Set();
        const visible = () => filter.size ? rows.filter(r => filter.has(r.status)) : rows;

        const drawChips = () => {
            ["open", "inprogress"].forEach(key => { view.querySelector(`[data-count="${key}"]`).textContent = rows.filter(r => r.status === key).length; });
            view.querySelectorAll("[data-status]").forEach(chip => chip.setAttribute("aria-pressed", String(filter.has(chip.dataset.status))));
            view.querySelector("[data-clear]").hidden = !filter.size;
        };

        const table = dataTable(tableEl, {
            columns: [
                { key: "hospitalName", title: "Mission Hospital Name" },
                { key: "departments", title: "Department Name", sortable: false, render: r => html`<div class="cell-scroll">${names(r.selectedLinkedDepartments).map(n => html`<div>${n}</div>`)}</div>` },
                { key: "specializationName", title: "Specialization Name" },
                { key: "fromMsnHospDate", title: "From Date", render: r => formatDate(r.fromMsnHospDate) || "—" },
                { key: "toMsnHospDate", title: "To Date", render: r => formatDate(r.toMsnHospDate) || "—" },
                { key: "details", title: "View Details", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-details="${r._id}">Details</button>` }
            ],
            rows: visible(),
            searchKeys: ["hospitalName", "specializationName", r => names(r.selectedLinkedDepartments).join(" ")],
            searchPlaceholder: "Search hospital, department or specialization",
            emptyText: "There are no open manpower requests right now.",
            initialSort: { key: "fromMsnHospDate", dir: "desc" }
        });

        drawChips();

        view.addEventListener("click", async event => {

            const chip = event.target.closest("[data-status]");

            if (chip) {
                filter.has(chip.dataset.status) ? filter.delete(chip.dataset.status) : filter.add(chip.dataset.status);
                drawChips();
                table.setRows(visible());
                return;
            }

            if (event.target.closest("[data-clear]")) {
                filter.clear();
                drawChips();
                table.setRows(visible());
                return;
            }

            const button = event.target.closest("[data-details]");

            if (!button) return;

            const row = rows.find(r => String(r._id) === button.dataset.details);

            UI.setLoading(button, true);

            try {

                const [request] = await ConnectAPI.rows({ collection: "MissionRequests", query: { _id: button.dataset.details, isDeleted: "false" } });

                openDialog({
                    title: "Manpower Request",
                    size: "lg",
                    body: requestDetails(request || row, { hospitalName: row.hospitalName, specialization: row.specializationName })
                });

            } catch (error) {
                UI.toast(error.message, { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

    }


    // -----------------------------------------------------------------
    // Mission request chat (chatWorker.js)
    // -----------------------------------------------------------------

    const AUTO_REPLY = "This is an automated message. Our staffs will respond as soon as possible. Thank you";

    const bubble = (comment, mine = true) => html`
        <div class="chat-msg ${mine ? "from" : "to"}">
            <div>${comment.misnExtcomment}</div>
            <div class="chat-meta">on ${formatDate(comment.misnExtcmtDate)} by ${comment.misnExtcmtaddedBy || "—"}</div>
        </div>`;

    function openChat(request, specialization, onChange) {

        const comments = request.misnExtupdateComments || [];

        const dialog = openDialog({
            title: "Mission Request",
            size: "lg",
            body: html`
                ${requestDetails(request, { specialization })}
                <h4 class="detail-subhead">Messages</h4>
                <div class="chat-thread" data-thread>${comments.length ? comments.map(c => bubble(c, c.misnExtcmtaddedById === me().id || c.misnExtcmtaddedBy === me().name)) : html`<p class="text-muted chat-empty">No messages yet. Write to the Missions Office below.</p>`}</div>
                <form class="chat-compose" data-compose novalidate>
                    <label class="sr-only" for="chatInput">Message</label>
                    <textarea id="chatInput" class="input textarea" rows="2" placeholder="Type your message" maxlength="2000"></textarea>
                    <button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Send</button>
                </form>
                <span class="field-error" data-error aria-live="polite"></span>`
        });

        const thread = dialog.element.querySelector("[data-thread]");
        const input = dialog.element.querySelector("textarea");
        const error = dialog.element.querySelector("[data-error]");
        const scroll = () => { thread.scrollTop = thread.scrollHeight; };

        scroll();

        dialog.element.querySelector("[data-compose]").addEventListener("submit", async event => {

            event.preventDefault();

            const message = input.value.trim();

            if (!message) {
                input.classList.add("is-invalid");
                error.textContent = "Please type a message.";
                input.focus();
                return;
            }

            const button = event.submitter || dialog.element.querySelector('[data-compose] button');

            const comment = {
                misnExtcomment: message,
                misnExtcmtaddedBy: me().name || "",
                misnExtcmtaddedById: me().id || "",
                misnExtcmtDate: new Date().toISOString()
            };

            UI.setLoading(button, true);

            try {

                await ConnectAPI.update("MissionRequests", { _id: request._id }, {
                    $set: { ...comment, misnExtcmtDate: ConnectAPI.date(comment.misnExtcmtDate) },
                    $push: { misnExtupdateComments: { ...comment, misnExtcmtDate: ConnectAPI.date(comment.misnExtcmtDate) } }
                });

                thread.querySelector(".chat-empty")?.remove();
                thread.insertAdjacentHTML("beforeend", String(bubble(comment)));

                const ack = document.createElement("div");
                ack.className = "chat-msg to is-typing";
                ack.innerHTML = String(html`<div>Auto generating reply</div><div class="chat-meta">on ${formatDate(new Date())}</div>`);
                thread.appendChild(ack);
                setTimeout(() => { ack.classList.remove("is-typing"); ack.firstElementChild.textContent = AUTO_REPLY; }, 3500);

                input.value = "";
                scroll();
                onChange?.();

            } catch (err) {
                UI.toast(err.message || "Couldn't send the message", { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

        input.addEventListener("input", () => { input.classList.remove("is-invalid"); error.textContent = ""; });

    }


    // -----------------------------------------------------------------
    // Mission requests for one hospital (datatablesMsqLoad)
    // -----------------------------------------------------------------

    function missionRequests(mount, hospital, specializations) {

        const specs = byId(specializations);
        let table = null;
        let rows = [];

        mount.innerHTML = String(html`
            <div class="table-actions"><button type="button" class="btn btn-primary btn-sm" data-add><i class="bi bi-plus-lg"></i> Add</button></div>
            <div data-table>${skeletonList(3)}</div>`);

        const tableEl = mount.querySelector("[data-table]");
        const specName = id => specs.get(String(id && typeof id === "object" ? id._id : id))?.name || "";

        async function load() {

            try {

                rows = (await ConnectAPI.rows({
                    collection: "MissionRequests",
                    query: { missionHospitalId: hospital._id, isDeleted: "false" },
                    projection: { _id: 1, missionHospitalId: 1, specializationId: 1, missionStatus: 1, requestStatus: 1, requestType: 1, fromMsnHospDate: 1, toMsnHospDate: 1, misnExtupdateComments: 1 }
                })).map(r => ({ ...r, specializationName: specName(r.specializationId) }));

                const columns = [
                    { key: "specializationName", title: "Specialization Name" },
                    { key: "fromMsnHospDate", title: "From Date", render: r => formatDate(r.fromMsnHospDate) || "—" },
                    { key: "toMsnHospDate", title: "To Date", render: r => formatDate(r.toMsnHospDate) || "—" },
                    { key: "missionStatus", title: "Mission Status", render: r => Forms.statusBadge(r.missionStatus) },
                    {
                        key: "chat", title: "Chat", sortable: false,
                        render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-chat="${r._id}"><i class="bi bi-chat-dots"></i> Chat${r.misnExtupdateComments?.length ? html` <span class="badge badge-accent">${r.misnExtupdateComments.length}</span>` : ""}</button>`
                    }
                ];

                if (table) table.setRows(rows);
                else table = dataTable(tableEl, { columns, rows, searchPlaceholder: "Search requests", emptyText: "No mission requests yet. Use Add to request personnel.", initialSort: { key: "fromMsnHospDate", dir: "desc" } });

            } catch (error) {
                tableEl.innerHTML = String(errorState(error.message));
            }

        }

        function addRequest() {

            let linkedDepartments = [];
            let linkedCourses = [];

            Forms.open({
                title: `Add a mission request to ${hospital.missionHospitalName || "your hospital"}`,
                formKey: "externalMissionRequest",
                successMessage: "Mission request added",
                onReady: form => {

                    const hospComp = form.getComponent("missionHospitalId");

                    if (hospComp) {
                        hospComp.component.valueProperty = "_id";
                        hospComp.setValue(hospital._id);
                        hospComp.disabled = true;
                    }

                    form.on("change", async event => {

                        if (event.changed?.component?.key !== "specializationId" || !event.data.specializationId) return;

                        const value = form.getComponent("specializationId").getValue();
                        const specId = value && typeof value === "object" ? value._id : value;

                        if (!specId) return;

                        const [spec] = await ConnectAPI.rows({ collection: "MissionSpecializations", query: { _id: specId, isDeleted: "false" }, projection: { _id: 1, linkedDepartments: 1, linkedCourses: 1 } });

                        if (!spec?.linkedDepartments?.length || !spec?.linkedCourses?.length) return;

                        linkedDepartments = spec.linkedDepartments;
                        linkedCourses = spec.linkedCourses;

                        [["selectedLinkedDepartments", linkedDepartments], ["selectedLinkedCourses", linkedCourses]].forEach(([key, list]) => {

                            const comp = form.getComponent(key);

                            if (!comp) return;

                            comp.component.values = list.map(item => ({ label: item.name, value: item._id }));
                            comp.setValue(Object.fromEntries(list.map(item => [item._id, true])));
                            comp.redraw();

                        });

                    });

                },
                onSubmit: async data => {

                    const picked = (value, list) => Object.keys(value || {}).filter(key => value[key]).map(id => list.find(item => item._id === id)).filter(Boolean);

                    const doc = {
                        ...data,
                        missionHospitalId: hospital._id,
                        Date: ConnectAPI.date(Date.now()),
                        addedBy: me().name || "",
                        addedById: me().id || "",
                        isDeleted: "false",
                        requestType: "ManPower",
                        missionStatus: "Open",
                        misnExtupdateComments: [],
                        visitPurpose: Object.keys(data.visitPurpose || {}).filter(key => data.visitPurpose[key]),
                        selectedLinkedDepartments: picked(data.selectedLinkedDepartments, linkedDepartments),
                        selectedLinkedCourses: picked(data.selectedLinkedCourses, linkedCourses),
                        specializationId: data.specializationId && typeof data.specializationId === "object" ? data.specializationId._id : (data.specializationId || "")
                    };

                    await ConnectAPI.insert("MissionRequests", doc);

                    load();

                }
            });

        }

        mount.addEventListener("click", async event => {

            if (event.target.closest("[data-add]")) {
                addRequest();
                return;
            }

            const button = event.target.closest("[data-chat]");

            if (!button) return;

            UI.setLoading(button, true);

            try {

                const [request] = await ConnectAPI.rows({ collection: "MissionRequests", query: { _id: button.dataset.chat, isDeleted: "false" } });

                if (!request) throw new Error("This request is no longer available.");

                openChat(request, specName(request.specializationId), load);

            } catch (error) {
                UI.toast(error.message, { type: "error" });
            } finally {
                UI.setLoading(button, false);
            }

        });

        load();

    }


    // -----------------------------------------------------------------
    // Hospital workspace (renderMissionHospitalUser)
    // -----------------------------------------------------------------

    async function renderMyHospital(view, params) {

        const id = params[0];
        const back = { href: "#/", label: "Dashboard" };

        view.innerHTML = String(html`${pageHeader({ title: "Loading hospital…", back })}${skeletonCards(3)}`);

        const results = await ConnectAPI.fetchMany([
            { collection: "HospitalAdmins", query: { userDocId: me().id, isDeleted: "false" }, projection: { allottedMissionHospitals: 1 } },
            { collection: "MissionHospital", query: { _id: id, isDeleted: "false" } },
            { collection: "MissionSpecializations", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } }
        ]);

        const allotted = (results.HospitalAdmins.data || []).flatMap(doc => doc.allottedMissionHospitals || []);
        const hospital = results.MissionHospital.data?.[0];

        if (!id || !allotted.some(h => String(h.hospitalDocId) === String(id))) {
            view.innerHTML = String(html`${pageHeader({ title: "Hospital workspace", back })}${emptyState("bi-shield-lock", "This hospital is not allotted to you", "Open one of your hospitals from the dashboard, or contact the Missions office.")}`);
            return;
        }

        if (!hospital) {
            view.innerHTML = String(html`${pageHeader({ title: "Hospital workspace", back })}${errorState(results.MissionHospital.error || "This hospital could not be found.")}`);
            return;
        }

        const departments = hospital.hospitalDepartments || [];

        view.innerHTML = String(html`
            ${pageHeader({
                title: hospital.missionHospitalName || "Hospital",
                icon: "bi-hospital",
                color: "red",
                back,
                actions: html`<a class="btn btn-secondary" href="#/hospitals/${encodeURIComponent(id)}"><i class="bi bi-geo-alt"></i> Hospital profile</a>`
            })}
            <div class="stat-row">
                <a class="card stat-tile" href="https://cmcbms.handcaudit.com/" target="_blank" rel="noopener"><i class="bi bi-people"></i><span>Best Matching Program</span><strong><i class="bi bi-box-arrow-up-right"></i></strong></a>
                <div class="card stat-tile"><i class="bi bi-hospital"></i><span>Bed Strength</span><strong>${hospital.hospitalBedStrength || "—"}</strong></div>
                <div class="card stat-tile"><i class="bi bi-activity"></i><span>Status</span><strong>${hospital.hospitalFunctional ? "Functional" : "Not functional"}</strong></div>
            </div>
            ${section("Mission Requests", html`<div id="hospitalRequests"></div>`, { description: "Request personnel from CMC and message the Missions Office about each request." })}
            <div class="two-col">
                ${section("Legal Help", html`<div id="hospitalLegal"></div>`)}
                ${section("Finance", html`<div id="hospitalFinance"></div>`)}
            </div>
            ${departments.length ? section("Departments", html`<div id="hospitalDepartments"></div>`) : ""}`);

        const ref = { _id: hospital._id, missionHospitalName: hospital.missionHospitalName };

        missionRequests(view.querySelector("#hospitalRequests"), ref, results.MissionSpecializations.data);
        HelpRequests.tracker(view.querySelector("#hospitalLegal"), "legal", { hospital: ref });
        HelpRequests.tracker(view.querySelector("#hospitalFinance"), "finance", { hospital: ref });

        if (departments.length) {

            const keys = Object.keys(departments[0]).filter(key => !key.startsWith("_") && typeof departments[0][key] !== "object").slice(0, 5);

            dataTable(view.querySelector("#hospitalDepartments"), {
                columns: keys.map(key => ({ key, title: Forms.humanize(key) })),
                rows: departments,
                pageSize: 8,
                searchPlaceholder: "Search departments"
            });

        }

    }


    App.register({ id: "manpower", title: "Manpower Requests", icon: "bi-people", color: "blue", group: "Missions", audiences: ["missions"], description: "Personnel needs placed by mission hospitals.", render: renderManpower });
    App.register({ id: "my-hospital", title: "My hospital", icon: "bi-hospital", color: "red", group: "Missions", nav: false, render: renderMyHospital });

})();
