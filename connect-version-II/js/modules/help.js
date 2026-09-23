/**
 * Help modules: Legal Help, Finance, Library Access, NABH Entry Level,
 * Feedback, and the Research Request form.
 *
 * Ports of formLoad.js in the git code:
 *   loadLegalHelpDataTable / loadFinanceDataTable + loadHelpForm
 *     (LegalHelp / FinancialHelp, formKeys "legalAssistance" / "finance"),
 *   confirmationResponse, loadLibraryAccessForm ("libraryAccess"),
 *   connectFeedbackForm ("formAllocation" -> ConnectFeedback),
 *   loadResearchRequest ("researchRequest" -> ResearchRequest),
 * and the "nabhEntryLevel" / "dls" entries of modal.js.
 *
 * HelpRequests.tracker() is also used by the hospital workspace
 * (my-hospital.js), where the git code passes hospIds.
 */
(function () {

    const { html, esc, formatDate, emptyState, errorState, skeletonList, pageHeader, section, dataTable, openDialog, safeUrl } = Kit;

    const MISSIONS_CONTACT = html`Please write to us: <a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a> · Or call: <a href="tel:+914162286117">+91 416 228 6117</a>`;

    const DLS_PDF = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_16b948137046166a5897731aa4ad2497_Pictures.pdf";

    const me = () => window.currentUser || {};

    const stamp = () => ({ userName: me().name || "", userId: me().id || "" });


    // -----------------------------------------------------------------
    // Legal Help / Finance request tracker
    // -----------------------------------------------------------------

    const KINDS = {
        legal: {
            collection: "LegalHelp",
            formKey: "legalAssistance",
            hidden: ["responseFromLegalTeam1", "confirmationFromLegalResponse"],
            response: row => row.responseFromLegalTeam,
            team: "Legal",
            noun: "Legal Help"
        },
        finance: {
            collection: "FinancialHelp",
            formKey: "finance",
            hidden: ["responseFromFinanceTeam", "confirmationFromFinanceResponse"],
            // The git table checks responseFromFinanceTeam, the response view reads responseFromFinanceTeam1.
            response: row => row.responseFromFinanceTeam1 || row.responseFromFinanceTeam,
            team: "Finance",
            noun: "Finance"
        }
    };

    const STATUSES = [
        ["submitted", "Submitted", "bi-send"],
        ["inprogress", "In progress", "bi-hourglass-split"],
        ["completed", "Completed", "bi-check2-circle"]
    ];

    const normStatus = status => String(status || "").toLowerCase().replace(/\s+/g, "");

    function showResponse(kind, row) {

        const files = row.supportingDocuments || [];

        openDialog({
            title: `Response from ${kind.team} Team`,
            body: html`
                <div class="response-view">
                    <p>${kind.response(row) || "No written response."}</p>
                    ${files.length ? html`
                        <h4 class="detail-subhead">Download supporting documents</h4>
                        <ul class="file-list">${files.map(file => html`
                            <li><i class="bi bi-file-earmark"></i><span>${file.originalName || file.name || "Document"}</span>
                                ${safeUrl(file.url) ? html`<a class="btn btn-secondary btn-sm" href="${safeUrl(file.url)}" target="_blank" rel="noopener" download="${file.originalName || ""}"><i class="bi bi-download"></i> Download</a>` : ""}</li>`)}</ul>` : ""}
                </div>`
        });

    }

    /**
     * Render the request tracker into `mount`.
     *   kindId   - "legal" | "finance"
     *   hospital - { _id, missionHospitalName } when opened from a hospital
     *              workspace (git: hospIds); otherwise the user's own requests
     */
    function tracker(mount, kindId, { hospital } = {}) {

        const kind = KINDS[kindId];
        const filter = new Set();
        let rows = [];
        let table = null;

        mount.innerHTML = String(html`
            <div class="status-chips" role="group" aria-label="Filter by status">
                ${STATUSES.map(([key, label, icon]) => html`
                    <button type="button" class="status-chip" data-status="${key}" aria-pressed="false">
                        <i class="bi ${icon}"></i><span>${label}</span><strong data-count="${key}">–</strong>
                    </button>`)}
                <button type="button" class="btn btn-ghost btn-sm" data-clear hidden>Clear filter</button>
                <button type="button" class="btn btn-primary btn-sm status-chips-add" data-add><i class="bi bi-plus-lg"></i> Add</button>
            </div>
            <div data-table>${skeletonList(4)}</div>`);

        const tableEl = mount.querySelector("[data-table]");

        const columns = [
            ...(hospital ? [] : [{ key: "hospital", title: "Hospital Name", sortValue: r => r.missionHospital?.missionHospitalName || "", render: r => r.missionHospital?.missionHospitalName || "—" }]),
            { key: "addedBy", title: "Added by", sortValue: r => r.added?.userName || "", render: r => r.added?.userName || "—" },
            { key: "addedDate", title: "Added Date", sortValue: r => r.added?.addedDate || "", render: r => formatDate(r.added?.addedDate) || "—" },
            { key: "status", title: "Status", render: r => Forms.statusBadge(r.status) },
            {
                key: "response", title: "Response", sortable: false,
                render: r => r.status === "completed" && (kind.response(r) || r.supportingDocuments?.length)
                    ? html`<button type="button" class="btn btn-secondary btn-sm" data-act="response" data-id="${r._id}"><i class="bi bi-file-earmark-text"></i> View</button>`
                    : html`<span class="text-muted">—</span>`
            },
            {
                key: "actions", title: "Actions", sortable: false, className: "cell-actions",
                render: r => r.status === "submitted"
                    ? html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="edit" data-id="${r._id}" aria-label="Edit" title="Edit"><i class="bi bi-pencil"></i></button>
                           <button type="button" class="btn btn-danger-soft btn-icon btn-sm" data-act="delete" data-id="${r._id}" aria-label="Delete" title="Delete"><i class="bi bi-trash3"></i></button>`
                    : html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="preview" data-id="${r._id}" aria-label="Preview" title="Preview"><i class="bi bi-eye"></i></button>`
            }
        ];

        const visible = () => filter.size ? rows.filter(r => filter.has(normStatus(r.status))) : rows;

        function drawCounts() {

            STATUSES.forEach(([key]) => {
                mount.querySelector(`[data-count="${key}"]`).textContent = rows.filter(r => normStatus(r.status) === key).length;
            });

            mount.querySelectorAll("[data-status]").forEach(chip => chip.setAttribute("aria-pressed", String(filter.has(chip.dataset.status))));
            mount.querySelector("[data-clear]").hidden = !filter.size;

        }

        async function load() {

            const query = { isDeleted: false };

            if (hospital) query["missionHospital._id"] = hospital._id;
            else query["added.userId"] = me().id;

            try {

                rows = await ConnectAPI.rows({ collection: kind.collection, query });

                drawCounts();

                if (table) table.setRows(visible());
                else table = dataTable(tableEl, {
                    columns,
                    rows: visible(),
                    searchPlaceholder: `Search ${kind.noun.toLowerCase()} requests`,
                    emptyText: `No ${kind.noun.toLowerCase()} requests yet. Use Add to raise one.`,
                    initialSort: { key: "addedDate", dir: "desc" }
                });

            } catch (error) {
                tableEl.innerHTML = String(errorState(error.message));
            }

        }

        function openForm(id, mode) {

            const readOnly = mode === "preview";

            Forms.open({
                title: id ? (readOnly ? `Preview ${kind.noun}` : `Edit ${kind.noun}`) : `Add new ${kind.noun}`,
                formKey: kind.formKey,
                hide: kind.hidden,
                readOnly,
                successMessage: id ? "Request updated" : "Request submitted",
                onReady: async form => {

                    form.getComponent("name")?.setValue(me().name || "");

                    const hospComp = form.getComponent("missionHospital");

                    if (hospital && hospComp) {
                        hospComp.component.valueProperty = "_id";
                        hospComp.setValue(hospital._id);
                        hospComp.disabled = true;
                    }

                    if (id) {

                        const [record] = await ConnectAPI.rows({ collection: kind.collection, query: { _id: id, isDeleted: false } });

                        if (record) {
                            form.submission = { data: record };
                            if (hospComp) hospComp.disabled = true;
                        }

                    }

                },
                onSubmit: async data => {

                    const doc = await Forms.uploadFiles({ ...data, isDeleted: false }, kind.collection);

                    if (id) {

                        await ConnectAPI.update(kind.collection, { _id: id }, { $set: { ...doc, modified: { ...stamp(), modifiedDate: ConnectAPI.date(Date.now()) } } });

                    } else {

                        if (hospital) {
                            doc.missionHospital = { _id: hospital._id, missionHospitalName: hospital.missionHospitalName || "" };
                        }

                        await ConnectAPI.insert(kind.collection, { ...doc, added: { ...stamp(), addedDate: ConnectAPI.date(Date.now()) }, status: "submitted" });

                    }

                    load();

                }
            });

        }

        mount.addEventListener("click", async event => {

            const chip = event.target.closest("[data-status]");

            if (chip) {
                filter.has(chip.dataset.status) ? filter.delete(chip.dataset.status) : filter.add(chip.dataset.status);
                drawCounts();
                table?.setRows(visible());
                return;
            }

            if (event.target.closest("[data-clear]")) {
                filter.clear();
                drawCounts();
                table?.setRows(visible());
                return;
            }

            if (event.target.closest("[data-add]")) {
                openForm(null);
                return;
            }

            const button = event.target.closest("[data-act]");

            if (!button) return;

            const id = button.dataset.id;
            const row = rows.find(r => String(r._id) === id);

            switch (button.dataset.act) {

                case "edit":
                case "preview":
                    openForm(id, button.dataset.act);
                    break;

                case "response":
                    if (row) showResponse(kind, row);
                    break;

                case "delete": {

                    const ok = await Forms.confirm({ title: "Delete this request?", message: "Are you sure you want to delete this record?", confirmLabel: "Delete", danger: true });

                    if (!ok) return;

                    try {
                        await ConnectAPI.update(kind.collection, { _id: id }, { $set: { isDeleted: true } });
                        UI.toast("Request deleted", { type: "success" });
                        load();
                    } catch (error) {
                        UI.toast(error.message, { type: "error" });
                    }

                    break;

                }

            }

        });

        load();

        return { reload: load };

    }

    function renderTrackerPage(kindId, title, icon, color) {

        return (view) => {

            view.innerHTML = String(html`
                ${pageHeader({ title, icon, color })}
                ${section(`My Requests for ${KINDS[kindId].noun}`, html`<div data-tracker></div>`)}
                <p class="page-footnote">${MISSIONS_CONTACT}</p>`);

            tracker(view.querySelector("[data-tracker]"), kindId);

        };

    }


    // -----------------------------------------------------------------
    // Library Access (views/libraryAccess.html + loadLibraryAccessForm)
    // -----------------------------------------------------------------

    async function renderLibrary(view) {

        view.innerHTML = String(html`
            ${pageHeader({
                title: "Our Library Services",
                icon: "bi-book",
                color: "purple",
                description: "Welcome to CMC's E-Library! We offer an extensive collection of digital resources, including academic journals, e-books, and various learning materials."
            })}
            <div class="two-col">
                <section class="card panel">
                    <div class="panel-body prose">
                        <p>This selection is designed to support the needs of students, professionals, and researchers in their academic, clinical, and research endeavors.</p>
                        <p><strong>Dive in and explore!</strong></p>
                        <p>If you have access, please login here</p>
                        <a class="btn btn-primary" href="https://app.myloft.xyz/user/login?institute=ckr0hexbsvrcd0927d54m0cbi" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Login</a>
                    </div>
                </section>
                <section class="card panel">
                    <div class="panel-header"><div><h2>CMC Library</h2></div></div>
                    <div class="panel-body prose">
                        <p>To access free journals and books available in the Dodd Library, please click the link:<br>
                            <a href="https://dodd.cmcvellore.ac.in/" target="_blank" rel="noopener">https://dodd.cmcvellore.ac.in/</a></p>
                        <p><a class="btn btn-secondary btn-sm" href="${DLS_PDF}" target="_blank" rel="noopener"><i class="bi bi-file-earmark-pdf"></i> DLS</a></p>
                    </div>
                </section>
            </div>
            ${section("Subscribed Journals", html`
                <div class="prose">
                    <p>To obtain access to subscribed journals, please follow these guidelines:</p>
                    <ol>
                        <li>Before submitting a new form, please verify with your Hospital Administrator whether your hospital or organization has already been granted access.</li>
                        <li>To request new access or to renew your existing access, kindly complete the designated short form provided.</li>
                    </ol>
                    <p class="text-muted">Access will be granted based on institutional affiliation and is subject to the approval of the Library Services team.</p>
                    <h3 class="detail-subhead">If you don't have access, please fill the form here</h3>
                </div>
                <div id="libraryForm"></div>`)}`);

        mountLibraryForm(view.querySelector("#libraryForm"));

    }

    function mountLibraryForm(container) {

        let checking = null;

        Forms.render(container, {
            formKey: "libraryAccess",
            hide: ["requestStatus", "comments", "accessValidationDate"],
            successMessage: null,
            onReady: form => {

                form.getComponent("name")?.setValue(me().name || "");

                // One request per institution (git: duplicate check on change)
                form.on("change", async () => {

                    const value = form.getComponent("nameOfTheInstitution._id")?.getValue()
                        ?? form.getComponent("nameOfTheInstitution")?.getValue();

                    const institutionId = value && typeof value === "object" ? value._id : value;

                    if (!institutionId || institutionId === checking) return;

                    checking = institutionId;

                    try {

                        const existing = await ConnectAPI.rows({ collection: "LibraryAccess", query: { "nameOfTheInstitution._id": institutionId, isDeleted: false }, projection: { _id: 1 } });

                        if (existing.length) {
                            UI.toast("This Institution already has a Library Access Request. Please contact your institution for more details.", { type: "warning", timeout: 7000 });
                            checking = null;
                            mountLibraryForm(container);
                        }

                    } catch (error) {
                        console.error(error);
                    }

                });

            },
            onSubmit: async data => {

                const doc = await Forms.uploadFiles({ ...data, isDeleted: false }, "LibraryAccess");

                await ConnectAPI.insert("LibraryAccess", { ...doc, added: { ...stamp(), addedDate: ConnectAPI.date(Date.now()) }, status: "submitted" });

                UI.toast("Your request is being processed. You will receive an email after confirmation. Thank you!", { type: "success", timeout: 7000 });

                mountLibraryForm(container);

            }
        });

    }


    // -----------------------------------------------------------------
    // NABH Entry Level (modal.js "nabhEntryLevel")
    // -----------------------------------------------------------------

    function renderNabh(view) {

        view.innerHTML = String(html`
            ${pageHeader({ title: "NABH Entry Level", icon: "bi-patch-check", color: "teal" })}
            ${section("For assistance in applying for entry-level NABH accreditation from CMC, please contact:", html`
                <ul class="contact-list">
                    <li><i class="bi bi-person"></i><span>Dr. Lallu Joseph</span></li>
                    <li><i class="bi bi-person-badge"></i><span>Directorate - Quality Management Cell</span></li>
                    <li><i class="bi bi-envelope"></i><span><a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a> · <a href="mailto:directorate.qmc@cmcvellore.ac.in">directorate.qmc@cmcvellore.ac.in</a></span></li>
                    <li><i class="bi bi-telephone"></i><span>Phone: <a href="tel:04162282437">0416-2282437</a></span></li>
                </ul>`)}`);

    }


    // -----------------------------------------------------------------
    // Feedback (connectFeedbackForm)
    // -----------------------------------------------------------------

    function renderFeedback(view) {

        view.innerHTML = String(html`
            ${pageHeader({ title: "Feedback", icon: "bi-chat-heart", color: "pink", description: "Please take a moment to share your feedback." })}
            <section class="card panel"><div class="panel-body" id="feedbackForm"></div></section>`);

        const mount = () => Forms.render(view.querySelector("#feedbackForm"), {
            formKey: "formAllocation",
            hide: ["missionOfficeUse"],
            successMessage: null,
            onReady: form => form.getComponent("name")?.setValue(me().name || ""),
            onSubmit: async data => {

                await ConnectAPI.insert("ConnectFeedback", { ...data, isDeleted: false, added: { ...stamp(), addedDate: ConnectAPI.date(Date.now()) } });

                UI.toast("Thank you for your valuable feedback. We will work on the points you’ve raised to improve our service.", { type: "success", timeout: 7000 });

                mount();

            }
        });

        mount();

    }


    // -----------------------------------------------------------------
    // Research Request (loadResearchRequest) - opened from Research
    // -----------------------------------------------------------------

    function researchRequest() {

        Forms.open({
            title: "Research Request Form",
            formKey: "researchRequest",
            hide: ["missionOfficeUse"],
            successMessage: "Your request is being processed, you will receive an email after confirmation. Thank you!",
            onSubmit: async data => {

                const doc = await Forms.uploadFiles({ ...data, isDeleted: false }, "ResearchRequest");

                await ConnectAPI.insert("ResearchRequest", { ...doc, status: "ongoing", added: { ...stamp(), addedDate: ConnectAPI.date(Date.now()) } });

            }
        });

    }


    window.HelpRequests = { tracker };
    window.HelpForms = { researchRequest };

    // In the git code these are cards on the Missions page (missions audience).
    App.register({ id: "legal-help", title: "Legal Help", icon: "bi-briefcase", color: "gray", group: "Help", audiences: ["missions"], description: "Request legal assistance for your mission hospital and follow your requests.", render: renderTrackerPage("legal", "Legal Help", "bi-briefcase", "gray") });
    App.register({ id: "finance", title: "Finance", icon: "bi-cash-coin", color: "green", group: "Help", audiences: ["missions"], description: "Request help from the finance team and follow your requests.", render: renderTrackerPage("finance", "Finance", "bi-cash-coin", "green") });
    App.register({ id: "library-access", title: "Library Access", icon: "bi-book", color: "purple", group: "Help", audiences: ["missions"], description: "CMC E-Library, Dodd Library and access to subscribed journals.", render: renderLibrary });
    App.register({ id: "nabh", title: "NABH Entry Level", icon: "bi-patch-check", color: "teal", group: "Help", audiences: ["missions"], description: "Assistance for entry-level NABH accreditation.", render: renderNabh });
    App.register({ id: "feedback", title: "Feedback", icon: "bi-chat-heart", color: "pink", group: "Help", description: "Please take a moment to share your feedback.", render: renderFeedback });

})();
