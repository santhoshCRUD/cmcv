/**
 * Grants: overview, FOV Grant (Friends of Vellore UK) and SAM Project
 * (Dr Sunil Agarwal Memorial Fellowship).
 *
 * Ports of the git code:
 *   views/grants.html                                         -> #/grants
 *   views/FOV Grants/*.html + loadFovGrantsPage, loadFOVGrantForm /
 *     handleFovFormSave / generateFovGrantId ("fovProjectPo"),
 *     loadFovApplication, loadFovAppStatusTable, RequestChangeBtn and the
 *     FOV comments                                            -> #/fov[/dashboard|/admin]
 *   views/SAM Grants/*.html + loadSamGrantsPage, samProjectApplication /
 *     handleSamFormSave / generateSamGrantId, loadSamApplication,
 *     loadSamAppStatusTable / RequestChangeSamStatus, the SAM chat and the
 *     training reports                                        -> #/sam[/dashboard|/admin]
 *
 * Git bugs fixed / prototypes replaced:
 *   - FOV save had every database call commented out (and referenced an
 *     undefined insertResponse): applications are now stored in
 *     FovApplication.
 *   - The FOV applicant table showed hard-coded test data; it now runs the
 *     query that was commented out, limited to the user's own applications
 *     (added by them or listing them as a project coordinator).
 *   - The FOV admin table passed the whole API result instead of .data.
 *   - RequestChangeBtn / RequestChangeSamStatus used Meteor/Bert, which
 *     do not exist in the app: status changes now go through the API.
 *   - SAM used a browser localStorage prototype (SamLocalStore): records
 *     now live in samProjectApplicationForm / samTrainingReportForm, as
 *     the git comments describe for the switch to MongoDB.
 *   - The applicant "Reproposal" tab queried msnStatus "Reproposal"; it now
 *     matches msnStatus Submitted + fovStatus Reproposal as intended.
 *   - The generated application PDF (jsPDF + uploadToS3) is replaced by a
 *     printable read-only view of the submitted form.
 */
(function () {

    const { html, raw, img, formatDate, emptyState, errorState, skeletonList, pageHeader, section, dataTable, openDialog, multiline, safeUrl } = Kit;

    const S3 = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/";
    const FOV_GUIDELINES = `${S3}FovGuidelines/_5ba358582081c0a06bab681402bc811e_FovGuidelines.pdf`;
    const SAM_GUIDELINES = `${S3}FovGuidelines/_2c2539e39c0553ca4c9926d35b9e4d20_FovGuidelines.pdf`;

    const SAM_ADMIN_ROLES = ["Admin", "admin", "superAdmin", "faculty", "Missions"];

    const me = () => window.currentUser || {};
    const stamp = key => ({ userId: me().id || "", userName: me().name || "", [key]: ConnectAPI.date(Date.now()) });

    const isFovAdmin = () => me().role === "Admin";
    const isSamAdmin = () => [...(me().roles || []), me().role].some(r => SAM_ADMIN_ROLES.includes(r));
    const isGrantUser = user => String(user.userType || "").toLowerCase() === "external user" && (user.roles || []).includes("Missions");

    const date = value => formatDate(value) || "—";

    const grantFor = row => Object.keys(row.grantFor || {}).filter(k => row.grantFor[k] === true || row.grantFor[k] === "true").join(", ") || "—";

    const lastComment = list => {
        const last = Array.isArray(list) && list.length ? list[list.length - 1] : null;
        return last ? html`<span class="text-subtle">${date(isNaN(Number(last.date)) ? last.date : Number(last.date))}</span><br>${raw(sanitize(last.comment))}` : "";
    };

    // Comments were stored as Quill HTML in the git code; keep only basic formatting.
    function sanitize(markup) {
        const doc = new DOMParser().parseFromString(`<div>${markup || ""}</div>`, "text/html");
        const allowed = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "DIV", "SPAN"]);
        doc.body.querySelectorAll("*").forEach(el => {
            if (!allowed.has(el.tagName)) el.replaceWith(...el.childNodes);
            else [...el.attributes].forEach(a => el.removeAttribute(a.name));
        });
        return doc.body.firstElementChild?.innerHTML || "";
    }

    const subnav = (base, active, items) => html`
        <nav class="subnav" aria-label="${base}">${items.filter(Boolean).map(([id, label]) => html`
            <a href="#/${base}${id ? `/${id}` : ""}" class="${active === id ? "is-active" : ""}" ${active === id ? raw('aria-current="page"') : ""}>${label}</a>`)}</nav>`;

    const tabBar = (tabs, active) => html`
        <div class="status-chips" role="tablist">${tabs.map(([id, label]) => html`
            <button type="button" role="tab" class="status-chip" data-tab="${id}" aria-pressed="${String(id === active)}"><span>${label}</span></button>`)}</div>`;


    // -----------------------------------------------------------------
    // Shared: read-only form view + documents + comments/chat
    // -----------------------------------------------------------------

    function collectFiles(value, label, out = []) {

        if (Array.isArray(value)) value.forEach(v => collectFiles(v, label, out));
        else if (value && typeof value === "object") {
            if (typeof value.url === "string" && (value.originalName || value.name)) out.push({ label, file: value });
            else Object.entries(value).forEach(([k, v]) => collectFiles(v, value.docName || label || k, out));
        }

        return out;

    }

    function viewApplication({ title, formKey, record, fileFields }) {

        const files = fileFields.flatMap(([key, label]) => collectFiles(record[key], label));

        const dialog = openDialog({
            title,
            size: "xl",
            body: html`
                <div class="print-actions"><button type="button" class="btn btn-secondary btn-sm" data-print><i class="bi bi-printer"></i> Print</button></div>
                ${files.length ? html`<h3 class="detail-subhead">Documents</h3>
                    <ul class="file-list">${files.map(({ label, file }) => html`<li><i class="bi bi-file-earmark"></i><span>${label ? html`<strong>${label}:</strong> ` : ""}${file.originalName || file.name}</span>
                        ${safeUrl(file.url) ? html`<a class="btn btn-secondary btn-sm" href="${safeUrl(file.url)}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Open</a>` : ""}</li>`)}</ul>` : ""}
                <h3 class="detail-subhead">Application</h3>
                <div data-form></div>`
        });

        dialog.element.querySelector("[data-print]").addEventListener("click", () => {
            document.body.classList.add("is-printing-dialog");
            window.print();
            setTimeout(() => document.body.classList.remove("is-printing-dialog"), 500);
        });

        Forms.render(dialog.body.querySelector("[data-form]"), { formKey, readOnly: true, submission: record });

    }

    function openThread({ title, record, field, collection, canWrite, canEdit, authorRole, onChange }) {

        let items = Array.isArray(record[field]) ? [...record[field]] : [];
        let editing = null;

        const text = item => item.comment ?? item.message ?? "";
        const when = item => item.date ?? item.postedAt;
        const who = item => item.userName ?? item.authorName ?? "";

        const dialog = openDialog({ title, size: "lg", body: html`<div data-thread></div>` });
        const box = dialog.body.querySelector("[data-thread]");

        function draw() {

            box.innerHTML = String(html`
                ${items.length ? html`<div class="chat-thread">${items.map((item, i) => html`
                    <div class="chat-msg ${(item.userId || item.authorId) === me().id ? "from" : "to"}">
                        <div>${raw(sanitize(text(item)))}</div>
                        <div class="chat-meta">${who(item) ? html`${who(item)} · ` : ""}${date(isNaN(Number(when(item))) ? when(item) : Number(when(item)))}
                            ${canEdit ? html` · <button type="button" class="link-button" data-edit="${i}">Edit</button> · <button type="button" class="link-button" data-delete="${i}">Delete</button>` : ""}</div>
                    </div>`)}</div>` : html`<p class="text-muted">No messages yet.</p>`}
                ${canWrite ? html`
                    <form data-compose novalidate>
                        <label class="sr-only" for="threadInput">Message</label>
                        <textarea id="threadInput" class="input textarea" rows="3" maxlength="5000" placeholder="Write a message…">${editing !== null ? text(items[editing]).replace(/<[^>]+>/g, "") : ""}</textarea>
                        <span class="field-error" data-error aria-live="polite"></span>
                        <div class="form-actions">${editing !== null ? html`<button type="button" class="btn btn-secondary" data-cancel>Cancel</button>` : ""}
                            <button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> ${editing !== null ? "Update" : "Send"}</button></div>
                    </form>` : ""}`);

        }

        async function save(next) {
            await ConnectAPI.update(collection, { _id: record._id }, { $set: { [field]: next } });
            items = next;
            record[field] = next;
            onChange?.();
        }

        box.addEventListener("click", async event => {

            const edit = event.target.closest("[data-edit]");
            const del = event.target.closest("[data-delete]");

            if (edit) { editing = Number(edit.dataset.edit); draw(); box.querySelector("textarea").focus(); }
            if (event.target.closest("[data-cancel]")) { editing = null; draw(); }

            if (del && await Forms.confirm({ title: "Delete this message?", message: "This cannot be undone.", confirmLabel: "Delete", danger: true })) {
                try { await save(items.filter((_, i) => i !== Number(del.dataset.delete))); draw(); }
                catch (error) { UI.toast(error.message, { type: "error" }); }
            }

        });

        box.addEventListener("submit", async event => {

            event.preventDefault();

            const input = box.querySelector("textarea");
            const value = input.value.trim();

            if (!value) {
                input.classList.add("is-invalid");
                box.querySelector("[data-error]").textContent = "Please enter a message.";
                return;
            }

            const button = event.submitter;
            const markup = String(multiline(value));
            const now = new Date().toISOString();

            UI.setLoading(button, true);

            try {

                if (editing !== null) {
                    const next = items.map((item, i) => i === editing ? { ...item, [item.message !== undefined ? "message" : "comment"]: markup } : item);
                    await save(next);
                    editing = null;
                } else {
                    const entry = field === "samChatThread"
                        ? { message: markup, authorRole, authorId: me().id || "", authorName: me().name || "", postedAt: now }
                        : { date: now, comment: markup, userId: me().id || "", userName: me().name || "" };
                    await ConnectAPI.update(collection, { _id: record._id }, { $push: { [field]: entry } });
                    items = [...items, entry];
                    record[field] = items;
                    onChange?.();
                }

                draw();

            } catch (error) {
                UI.toast(error.message || "Unable to send message.", { type: "error" });
                UI.setLoading(button, false);
            }

        });

        draw();

    }

    async function nextGrantId(collection, field, tag, width = 5) {

        const year = new Date().getFullYear().toString().slice(-2);
        let next = 1;

        try {
            const [last] = await ConnectAPI.rows({ collection, query: { isDeleted: false, [field]: { $regex: `^${year}${tag}` } }, projection: { [field]: 1 }, options: { limit: 1, sort: { [field]: -1 } } });
            const parsed = parseInt(String(last?.[field] || "").split(tag)[1], 10);
            if (!isNaN(parsed)) next = parsed + 1;
        } catch (error) {
            console.error(error);
        }

        return `${year}${tag}${String(next).padStart(width, "0")}`;

    }


    // -----------------------------------------------------------------
    // Grants overview (views/grants.html)
    // -----------------------------------------------------------------

    function renderGrants(view) {

        const card = (tag, title, sub, body, href, image) => html`
            <article class="card program-card">
                ${image ? img(image, title, "program-card-img") : ""}
                <div class="program-card-body">
                    <span class="eyebrow">${tag}</span>
                    <h2>${title}</h2>
                    <p class="text-muted">${sub}</p>
                    ${body.map(p => html`<p>${p}</p>`)}
                    <a class="btn btn-primary btn-sm" href="${href}">View Grant</a>
                </div>
            </article>`;

        view.innerHTML = String(html`
            ${pageHeader({ title: "Grants", icon: "bi-cash-stack", color: "green", description: "Three ways we support healing across India's mission hospitals." })}
            <section class="card panel"><div class="panel-body prose">
                <p>From general project funding to specialist training and collaborative research — each grant plays a different part in strengthening the CMC Vellore mission network</p>
                <p class="pull-quote">"Every grant we offer is more than funding; it is an investment in lives transformed — a life-saving surgery made possible, a young doctor equipped with new skills, a ward rebuilt to serve another generation of patients. These grants strengthen the hands of those who have chosen to serve in the hardest places, ensuring that no one is turned away for their inability to pay."</p>
                <p>Across India's most underserved corners, mission hospitals stand as beacons of hope — often working with limited resources, yet unwavering in their commitment to serve the poor and marginalised with dignity and compassion. In supporting these hospitals, we help sustain a legacy of healing that reaches far beyond hospital walls — into families, villages, and communities that would otherwise be forgotten. This is the quiet, powerful difference that thoughtful giving can make: turning compassion into lasting care.</p>
            </div></section>
            <div class="program-list">
                ${card("FOV Grant", "Friends of Vellore", "Building and Equipment", [
                    "Friends of Vellore UK is a UK-based charity dedicated to bringing hope and healing to poor and marginalised communities across India, working hand in hand with Christian Medical College Vellore and its network of mission hospitals.",
                    "Rooted in compassion and inspired by Christ's example, we believe that quality healthcare should never depend on a person's ability to pay or their faith. Through our grants, we support hospitals striving to reach the most vulnerable — funding equipment, treatment, training, and vital infrastructure that transform lives on the ground.",
                    "We warmly welcome applications from mission hospitals within the CMC Vellore family who share this vision of compassionate, accessible care. Together, we can extend the reach of healing to those who need it most."
                ], "#/fov")}
                ${card("SAM Project", "Dr Sunil Agarwal Memorial Fellowship", "Training and Fellowship", [
                    "The Dr Sunil Agarwal Memorial Fellowship, established by the MBBS Batch of 1978 in loving memory of their classmate, Dr Sunil Agarwal, offers dedicated health professionals from mission and NGO hospitals in underserved areas of India the opportunity to spend two to four weeks at CMC Vellore for focused training and reskilling",
                    "Named after a doctor who devoted his life to training and supporting colleagues at mission hospitals — and who tragically lost his life while travelling to one such outreach programme — this fellowship carries forward his spirit of service and mentorship. The grant covers accommodation and meals at CMC Vellore, allowing Fellows to immerse themselves fully in learning without financial worry.",
                    "We warmly invite staff of mission and NGO hospitals with a long-term commitment to underserved communities to apply and be part of this legacy of learning and service."
                ], "#/sam")}
                ${card("Research Grant", "CMC Vellore Mission Network Collaborative Research Grant", "Collaborative Research", [
                    "Welcome to the CMC Vellore Mission Network Collaborative Research Grant, a funding initiative of Christian Medical College (CMC), Vellore, designed to strengthen collaborative research across the CMC Vellore Mission Network.",
                    "This grant aims to foster meaningful partnerships between CMC Vellore faculty and Mission Network Hospitals, enabling high-quality research that addresses locally relevant health priorities. By supporting field-based, epidemiological, clinical, and translational research, the programme seeks to build research capacity, encourage multidisciplinary collaboration, and generate evidence that improves patient care and public health.",
                    "Through this initiative, CMC Vellore reaffirms its commitment to advancing excellence in research while strengthening the shared mission of service, innovation, and academic collaboration. We look forward to your participation in building a vibrant and impactful research network."
                ], "#/research")}
            </div>`);

    }


    // -----------------------------------------------------------------
    // FOV
    // -----------------------------------------------------------------

    const FOV_FILES = [["supportingDoc", "Supporting document"], ["uploadBudget", "Budget"], ["IFbuildPlanAndCostEstimPrepared", "Building plan and cost estimate"], ["uploadSignature", "Signature"], ["finalPDFDocs", "Application PDF"]];

    const fovNav = active => subnav("fov", active, [["", "Overview"], ["dashboard", "Applicant Dashboard"], isFovAdmin() ? ["admin", "Admin Dashboard"] : null]);

    function openFovForm(reqId, onSaved) {

        let currentId = reqId;

        const save = async (form, final) => {

            if (final) {
                const valid = await form.checkValidity(form.data, true);
                if (!valid) { form.showErrors(); UI.toast("Please fix the highlighted fields.", { type: "warning" }); return; }
            }

            const data = await Forms.uploadFiles({ ...form.data }, "FovApplication");

            delete data._id;
            data.fovGrantId = data.fovGrantId || await nextGrantId("FovApplication", "fovGrantId", "FOV");
            data.msnStatus = final ? "Submitted" : "Draft";
            data.isDeleted = false;

            if (currentId) {
                await ConnectAPI.update("FovApplication", { _id: currentId }, { $set: { ...data, modified: stamp("modifiedDate") } });
            } else {
                const result = await ConnectAPI.insert("FovApplication", { ...data, added: stamp("addedDate") });
                currentId = result.insertedId;
            }

            form.getComponent("fovGrantId")?.setValue(data.fovGrantId);

            UI.toast(final ? "Thank you for your application. Your form has been submitted successfully." : "Thank you for your application. Your form draft has been saved successfully.", { type: "success", timeout: 6000 });

            dialog.close();
            onSaved?.();

        };

        const dialog = Forms.open({
            title: "FOV Grant Application",
            formKey: "fovProjectPo",
            hide: ["approval"],
            keepOpen: true,
            successMessage: null,
            onReady: async form => {
                if (currentId) {
                    const [record] = await ConnectAPI.rows({ collection: "FovApplication", query: { _id: currentId, isDeleted: false }, options: { limit: 1 } });
                    if (record) form.submission = { data: record };
                } else {
                    form.getComponent("applicantName")?.setValue(me().name || "");
                }
            },
            onEvent: (type, form) => type === "saveDraft" ? save(form, false) : null,
            onSubmit: (data, form) => save(form, true)
        });

    }

    function renderFovOverview(view) {

        const figures = [["£6000 +", "Awarded in Grants"], ["140 +", "Hospitals Supported"], ["10 +", "Years of Partnership"], ["15 states", "Across India"]];

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Friends Of Vellore UK",
                title: "Mission Hospital Grant Programme",
                icon: "bi-building-add",
                color: "blue",
                back: { href: "#/grants", label: "Grants" },
                description: "Supporting mission hospitals serving poor and marginalised communities across India.",
                actions: html`<button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply For Grant</button>
                    <a class="btn btn-secondary" href="${FOV_GUIDELINES}" target="_blank" rel="noopener"><i class="bi bi-download"></i> Download Guidelines</a>`
            })}
            ${fovNav("")}
            <div class="stat-row">${figures.map(([value, label]) => html`<div class="card stat-tile"><strong>${value}</strong><span>${label}</span></div>`)}</div>
            ${section("Funding at a glance", html`<dl class="info-grid">
                <div class="info-grid-item"><dt>Available Funding</dt><dd>Up to £12,000 for one-off grants (approx 14 lakhs)<br>Up to £20,000 (approx 20 lakhs) over 3 years for ongoing programme grants</dd></div>
                <div class="info-grid-item"><dt>Eligible Applicants</dt><dd>Mission hospitals in the CMC Vellore network or formally affiliated with CMC, with valid FCRA registration</dd></div>
                <div class="info-grid-item"><dt>Application Cycle</dt><dd>Reviewed twice yearly — April and October</dd></div>
                <div class="info-grid-item"><dt>Grant Duration</dt><dd>Up to 12 months for one-off grants<br>Upto 3 years for programme grants</dd></div>
            </dl>`)}
            <div class="two-col">
                ${section("What we fund", html`<ul class="check-list">${["Medical Equipment", "Patient Treatment Support", "Training and Capacity Building", "Essential Building or Infrastructure works", "Pilot Staffing Positions (Max 3 yrs)", "Environmental and Sustainability Projects"].map(t => html`<li>${t}</li>`)}</ul>`)}
                ${section("We do not fund", html`<ul class="cross-list">${["Retrospective expenses already incurred", "Routine operational deficits without a sustainability plan", "Capital projects lacking long-term viability"].map(t => html`<li>${t}</li>`)}</ul>`)}
            </div>
            ${section("Ready to apply?", html`
                <ul class="check-list">
                    <li>Is your hospital within CMC Vellore's mission network or formally affiliated with CMC Vellore?</li>
                    <li>Does your hospital hold a valid Foreign Contribution Regulation Act (FCRA) registration?</li>
                    <li>Does your hospital demonstrate commitment to ethical medical practice, safeguarding, and non-discriminatory patient care?</li>
                </ul>
                <p class="text-muted">Please ensure that the requested grant falls within the scope permitted by FCRA. Please submit proposal, Buildings/equipment checklist correctly.</p>
                <button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply for Grant</button>`)}
            ${section("Selection Criteria", html`<dl class="info-grid">${[["Community Impact", "How the project benefits the poor and marginalised communities."], ["Sustainability", "Will the project continue beyond the grant period?"], ["Strategic Alignment", "Alignment with the vision of Friends of Vellore UK and CMC Vellore."], ["Institutional Capacity", "Leadership, staffing and readiness to deliver"], ["Accountability", "Previous reporting quality and responsible use of funds"], ["Fair Distribution", "We aim to support a broad range of hospitals across India"]].map(([k, v]) => html`<div class="info-grid-item"><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
                <p class="text-muted">Submission of an application does not guarantee funding. The Board may decline applications or award grants at a lower level than requested due to limited funds and broader allocation across hospitals and regions.</p>`)}
            <div class="two-col">
                ${section("Application Timeline", html`<ol class="flow-steps">${[["Grant Opens", "Applications invited"], ["Submit Application", "Complete and submit online application"], ["Board Review", "Trustees review proposals"], ["Funding Decision", "Decision announced on portal"], ["Grant Award", "Funds transferred upon approval"], ["Progress Report", "Reports at 6 and 12 months"]].map(([t, d], i) => html`<li class="flow-step"><span class="flow-num">${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`)}</ol>`)}
                ${section("Application Process", html`
                    <h4 class="detail-subhead">Required Documents</h4>
                    <ul class="check-list"><li>FCRA Certificate</li><li>Supporting Documents and Photos</li><li>Building/ Equipment Specifications (If applicable)</li></ul>
                    <ul class="bullet-list">
                        <li>Add the names of your project coordinators. Ensure all of them have access to CMCVConnect portal</li>
                        <li>You can save the application anytime as draft. Upload all necessary documents</li>
                        <li>Once you have verified the application, please save and Submit</li>
                        <li>You will receive intimation by mail/ portal</li>
                        <li>Board will review and may request more information</li>
                    </ul>`)}
            </div>
            <div class="two-col">
                ${section("Have questions or need assistance?", html`<p>Our team is here to help you through the application process.</p>
                    <ul class="contact-list"><li><i class="bi bi-telephone"></i><span>Ms. Bency - <a href="tel:8925396116">8925396116</a></span></li><li><i class="bi bi-telephone"></i><span>Mr. Abishek - <a href="tel:9789377354">9789377354</a></span></li></ul>`)}
                ${section("Why we do what we do", html`<ul class="bullet-list">
                    <li>To support healthcare and education in India at CMC Vellore and partner mission hospitals.</li>
                    <li>To assist CMC Vellore and partner institutions in maintaining their Christian character and professional standards through financial, professional, networking and prayer support.</li>
                    <li>To give special priority to the needs of the poorest and most excluded patients and communities.</li></ul>
                    <a class="btn btn-secondary btn-sm" href="https://friendsofvellore.org/" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Visit FOV Website</a>`)}
            </div>`);

        view.querySelectorAll("[data-apply]").forEach(b => b.addEventListener("click", () => openFovForm(null, () => App.navigate("fov/dashboard"))));

    }

    function fovTable(view, { admin }) {

        const tabs = admin
            ? [["Pending", "Approved by Msn"], ["Reproposal", "Reproposal"], ["Approved", "Approved by Msn & FOV"], ["Rejected", "Rejected by FOV"], ["All", "All"]]
            : [["Draft", "Draft"], ["Submitted", "Submitted"], ["Reproposal", "Reproposal"], ["Approved", "Approved by Msn & FOV"], ["Rejected", "Rejected by Msn & FOV"]];

        let active = tabs[0][0];
        let rows = [];
        let table = null;

        const box = view.querySelector("[data-apps]");
        box.innerHTML = String(html`${tabBar(tabs, active)}<div data-table>${skeletonList(4)}</div>`);

        const tableEl = box.querySelector("[data-table]");

        function query() {

            const q = { isDeleted: false };

            if (admin) {
                if (active !== "All") q.fovStatus = active;
                return q;
            }

            q.$or = [{ "added.userId": me().id }, { "projectCoordinators.email": me().email }];

            if (active === "Approved" || active === "Rejected") Object.assign(q, { msnStatus: active, fovStatus: active });
            else if (active === "Reproposal") Object.assign(q, { msnStatus: "Submitted", fovStatus: "Reproposal" });
            else q.msnStatus = active;

            return q;

        }

        const actions = r => {
            if (!admin) {
                return active === "Draft" || active === "Reproposal"
                    ? html`<button type="button" class="btn btn-primary btn-sm" data-act="edit" data-id="${r._id}"><i class="bi bi-pencil"></i> Continue</button>`
                    : "";
            }
            if (active === "Rejected") return html`<button type="button" class="btn btn-secondary btn-sm" data-status="Pending" data-id="${r._id}">Reopen</button>`;
            if (active === "Pending") return html`<div class="btn-stack"><button type="button" class="btn btn-primary btn-sm" data-status="Approved" data-id="${r._id}">Approve</button><button type="button" class="btn btn-secondary btn-sm" data-status="Reproposal" data-id="${r._id}">Reproposal</button><button type="button" class="btn btn-danger-soft btn-sm" data-status="Rejected" data-id="${r._id}">Reject</button></div>`;
            if (active === "Approved") return html`<button type="button" class="btn btn-danger-soft btn-sm" data-status="Rejected" data-id="${r._id}">Reject</button>`;
            return Forms.statusBadge(r.fovStatus);
        };

        async function load() {

            tableEl.innerHTML = String(skeletonList(4));
            table = null;

            try {

                rows = await ConnectAPI.rows({ collection: "FovApplication", query: query(), options: { sort: { "added.addedDate": -1 } } });

                const columns = [
                    ...(admin ? [] : [{ key: "fovGrantId", title: "FOV Grant ID" }]),
                    { key: "applicantName", title: "Applicant Name" },
                    { key: "hospital", title: "Mission Hospital", sortValue: r => r.missionHospital?.missionHospitalName || "", render: r => r.missionHospital?.missionHospitalName || "—" },
                    { key: "projectTitle", title: "Project Title", render: r => html`<span class="cell-clamp">${r.projectTitle || "—"}</span>` },
                    { key: "grantFor", title: "Grant For", sortValue: grantFor, render: grantFor },
                    ...((admin && (active === "Pending" || active === "Rejected")) || (!admin && (active === "Approved" || active === "Rejected")) ? [{ key: "msnComments", title: "Missions Comments", sortable: false, render: r => lastComment(r.msnOfficeFeedback) }] : []),
                    ...(admin && active === "Rejected" ? [{ key: "fovComments", title: "FOV Comments", sortable: false, render: r => lastComment(r.fovFeedback) }] : []),
                    { key: "status", title: admin ? ({ All: "Request Status", Pending: "Approved by Msn", Approved: "Approved by Msn & FOV", Rejected: "Rejected by FOV", Reproposal: "Re-proposal" })[active] : "Action", sortable: false, render: actions },
                    { key: "view", title: "View", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="view" data-id="${r._id}" aria-label="View" title="View"><i class="bi bi-eye"></i></button>` },
                    { key: "comments", title: "Comments", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="comments" data-id="${r._id}" aria-label="Comments" title="Comments"><i class="bi bi-chat-left-text"></i>${r.fovFeedback?.length ? html`<span class="badge badge-accent">${r.fovFeedback.length}</span>` : ""}</button>` }
                ];

                table = dataTable(tableEl, { columns, rows, searchKeys: ["fovGrantId", "applicantName", "projectTitle", r => r.missionHospital?.missionHospitalName || ""], searchPlaceholder: "Search applications", emptyText: "No applications in this list." });

            } catch (error) {
                tableEl.innerHTML = String(errorState(error.message));
            }

        }

        box.addEventListener("click", async event => {

            const tab = event.target.closest("[data-tab]");

            if (tab) {
                active = tab.dataset.tab;
                box.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-pressed", String(b === tab)));
                load();
                return;
            }

            const status = event.target.closest("[data-status]");

            if (status) {

                const labels = { Pending: "reopen", Approved: "approve", Reproposal: "send back for re-proposal", Rejected: "reject" };

                if (!await Forms.confirm({ title: "Update application", message: `Are you sure you want to ${labels[status.dataset.status]} this application?`, confirmLabel: "Confirm", danger: status.dataset.status === "Rejected" })) return;

                try {
                    await ConnectAPI.update("FovApplication", { _id: status.dataset.id }, { $set: { fovStatus: status.dataset.status, modified: stamp("modifiedDate") } });
                    UI.toast("FOV application updated successfully", { type: "success" });
                    load();
                } catch (error) {
                    UI.toast("Could not update this application. Please try again.", { type: "error", message: error.message });
                }

                return;

            }

            const act = event.target.closest("[data-act]");

            if (!act) return;

            const row = rows.find(r => String(r._id) === act.dataset.id);

            if (act.dataset.act === "edit") openFovForm(row._id, load);
            if (act.dataset.act === "view") viewApplication({ title: `FOV Application ${row.fovGrantId || ""}`, formKey: "fovProjectPo", record: row, fileFields: FOV_FILES });
            if (act.dataset.act === "comments") openThread({ title: "FOV Comments", record: row, field: "fovFeedback", collection: "FovApplication", canWrite: admin, canEdit: admin, onChange: () => table?.setRows(rows) });

        });

        load();

    }

    function renderFovDashboard(view, admin) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: me().name || "", title: admin ? "Welcome to FOV Grants Admin Dashboard" : "Welcome to FOV Grants Applicant Dashboard", icon: "bi-building-add", color: "blue", back: { href: "#/grants", label: "Grants" },
                actions: admin ? "" : html`<button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply For Grant</button>` })}
            ${fovNav(admin ? "admin" : "dashboard")}
            ${section("Applications", html`<div data-apps></div>`)}`);

        view.querySelector("[data-apply]")?.addEventListener("click", () => openFovForm(null, () => renderFovDashboard(view, admin)));

        fovTable(view, { admin });

    }

    function renderFov(view, params) {

        if (params[0] === "admin") {
            if (!isFovAdmin()) {
                view.innerHTML = String(html`${pageHeader({ title: "FOV Admin Dashboard", back: { href: "#/fov", label: "FOV Grant" } })}${emptyState("bi-shield-lock", "Admins only", "The FOV admin dashboard is available to FOV administrators.")}`);
                return;
            }
            return renderFovDashboard(view, true);
        }

        if (params[0] === "dashboard") return renderFovDashboard(view, false);

        return renderFovOverview(view);

    }


    // -----------------------------------------------------------------
    // SAM
    // -----------------------------------------------------------------

    const samNav = active => subnav("sam", active, [["", "Overview"], ["dashboard", "Applicant Dashboard"], isSamAdmin() ? ["admin", "Admin Dashboard"] : null]);

    function openSamForm(reqId, onSaved) {

        let currentId = reqId;

        const save = async (form, final) => {

            if (final) {
                const valid = await form.checkValidity(form.data, true);
                if (!valid) { form.showErrors(); UI.toast("Please fix the highlighted fields.", { type: "warning" }); return; }
            }

            const data = await Forms.uploadFiles({ ...form.data }, "samProjectApplicationForm");

            delete data._id;
            data.samGrantId = data.samGrantId || await nextGrantId("samProjectApplicationForm", "samGrantId", "SAM");
            data.applicationStatus = final ? "Submitted" : "Draft";
            data.isDeleted = false;

            if (currentId) {
                await ConnectAPI.update("samProjectApplicationForm", { _id: currentId }, { $set: { ...data, modified: stamp("modifiedDate") } });
            } else {
                const result = await ConnectAPI.insert("samProjectApplicationForm", { ...data, samChatThread: [], added: stamp("addedDate") });
                currentId = result.insertedId;
            }

            UI.toast(final ? "Thank you — your SAM Project application has been submitted." : "Your application draft has been saved. You can find it under Draft in your Applicant Dashboard.", { type: "success", timeout: 6000 });

            dialog.close();
            onSaved?.();

        };

        const dialog = Forms.open({
            title: "SAM Project Application",
            formKey: "samProjectApplicationForm",
            hide: ["missionOfficeUse"],
            keepOpen: true,
            successMessage: null,
            onReady: async form => {
                if (currentId) {
                    const [record] = await ConnectAPI.rows({ collection: "samProjectApplicationForm", query: { _id: currentId, isDeleted: false }, options: { limit: 1 } });
                    if (record) form.submission = { data: record };
                } else {
                    form.getComponent("applicantName")?.setValue(me().name || "");
                    form.getComponent("applicationStatus")?.setValue("Draft");
                    form.getComponent("samGrantId")?.setValue(await nextGrantId("samProjectApplicationForm", "samGrantId", "SAM"));
                }
            },
            onEvent: (type, form) => type === "saveDraft" ? save(form, false) : null,
            onSubmit: (data, form) => save(form, true)
        });

    }

    async function openReportForm(reqId, onSaved) {

        let currentId = reqId;
        let grantId = null;

        if (!reqId) {

            const [approved] = await ConnectAPI.rows({ collection: "samProjectApplicationForm", query: { isDeleted: false, "added.userId": me().id, applicationStatus: "Approved" }, options: { limit: 1, sort: { "added.addedDate": -1 } } });

            grantId = approved?.samGrantId;

            if (!grantId) {
                openDialog({ title: "Submit Training Report", body: html`<div class="notice-inline"><i class="bi bi-info-circle"></i> You don't have an Approved SAM application yet — a Training Report can only be submitted once your application has been approved and your training is complete.</div>` });
                return;
            }

        }

        const save = async (form, final) => {

            if (final) {
                const valid = await form.checkValidity(form.data, true);
                if (!valid) { form.showErrors(); UI.toast("Please fix the highlighted fields.", { type: "warning" }); return; }
            }

            const data = await Forms.uploadFiles({ ...form.data }, "samTrainingReportForm");

            delete data._id;
            data.reportStatus = final ? "Submitted" : "Draft";

            if (currentId) {
                await ConnectAPI.update("samTrainingReportForm", { _id: currentId }, { $set: { ...data, modified: stamp("modifiedDate") } });
            } else {
                const result = await ConnectAPI.insert("samTrainingReportForm", { ...data, isDeleted: false, added: stamp("addedDate") });
                currentId = result.insertedId;
            }

            UI.toast(final ? "Thank you — your training report has been submitted." : "Your training report draft has been saved.", { type: "success" });

            dialog.close();
            onSaved?.();

        };

        const dialog = Forms.open({
            title: "Training Report",
            formKey: "samTrainingReportForm",
            keepOpen: true,
            successMessage: null,
            onReady: async form => {
                if (currentId) {
                    const [record] = await ConnectAPI.rows({ collection: "samTrainingReportForm", query: { _id: currentId, isDeleted: false } });
                    if (record) form.submission = { data: record };
                } else {
                    form.getComponent("samGrantId")?.setValue(grantId);
                }
            },
            onEvent: (type, form) => type === "saveDraft" ? save(form, false) : null,
            onSubmit: (data, form) => save(form, true)
        });

    }

    function renderSamOverview(view) {

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Established by the MBBS Alumni Batch of 1978, in partnership with the Missions Office, CMC Vellore.",
                title: "Dr. Sunil Agarwal Memorial Project for Mission Hospitals",
                icon: "bi-mortarboard",
                color: "purple",
                back: { href: "#/grants", label: "Grants" },
                description: "The Dr Sunil Agarwal Memorial Fellowship sends mission and NGO hospital staff to CMC Vellore for focused re‑skilling carrying forward the work of a doctor who gave his life travelling to train others.",
                actions: html`<button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply For Grant</button>
                    <a class="btn btn-secondary" href="${SAM_GUIDELINES}" target="_blank" rel="noopener"><i class="bi bi-download"></i> Download Guidelines</a>`
            })}
            ${samNav("")}
            <div class="stat-row">
                <div class="card stat-tile"><span>Grant Covers</span><strong>Stay and meals</strong></div>
                <div class="card stat-tile"><span>Duration</span><strong>1 – 4 weeks</strong></div>
                <div class="card stat-tile"><span>Applications Close</span><strong>31st May 2026</strong></div>
            </div>
            <section class="card panel"><div class="panel-body prose">
                <p class="pull-quote">He didn't wait for people to come to him. He went to where the need was.</p>
                <h3>In memory of a doctor who never stopped teaching.</h3>
                <p>Dr Sunil Agarwal trained countless mission hospital doctors at CMC Vellore and often travelled himself to distant hospitals to teach on-site. It was on the way to one such programme, on 4 February 2020, that he lost his life in a road accident.</p>
                <p>His MBBS batch of 1978 created this fellowship so his way of teaching patient, hands-on, and willing to go the distance would continue through others.</p>
            </div></section>
            <div class="two-col">
                ${section("What the Fellowship Offers", html`<p><strong>Room to learn, without the worry of cost.</strong></p>
                    <p>Selected Fellows spend two to four weeks embedded in a CMC Vellore department that matches their hospital's real needs set individually by the Missions Office, not off a fixed curriculum.</p>
                    <p>Accommodation and meals in Vellore are fully covered. Training fees are rarely charged to mission hospitals; where they are, the Grant Committee negotiates directly with the department.</p>
                    <p class="text-muted">*Travel to and from the home hospital is not included and is expected to be arranged separately.</p>
                    <ul class="check-list"><li>Accommodation &amp; meals covered</li><li>Training fees waived or negotiated</li><li>Placement matched to your hospital's needs</li></ul>`)}
                ${section("Eligibility — Who can apply?", html`<p>The Fellowship is open to permanent mission hospital staff who intend to keep serving where they are.</p>
                    <ul class="check-list">
                        <li>A permanent employee of a Mission hospital or NGO associated with CMC Vellore, situated in an underserved area.</li>
                        <li>Doctors, nurses, and allied health workers with medical training are all eligible.</li>
                        <li>At least two years of service at the mission hospital prior to applying.</li>
                        <li>A demonstrated long-term commitment to continue serving at the mission hospital.</li></ul>`)}
            </div>
            ${section("Application Information — How the cycle works, and what's covered", html`<dl class="info-grid">
                <div class="info-grid-item"><dt>Application Cycle</dt><dd>Advertised each January on the CMC V Connect Portal and through partner networks CMAI, CHAI, EMFI and EHA. Applications close three months later, and awards are announced by 15th May. The grant may be used any time within the award year.</dd></div>
                <div class="info-grid-item"><dt>Duration &amp; Coverage</dt><dd>Two to four weeks, set individually based on the training need identified. Accommodation and meals at CMC Vellore for the full duration of stay.</dd></div>
                <div class="info-grid-item"><dt>What's Covered</dt><dd>Accommodation and meals at CMC Vellore for the full duration of training; training fees are rarely charged, and where they are, the Grant Committee negotiates directly with the department.</dd></div>
                <div class="info-grid-item"><dt>What's Not Covered</dt><dd>Travel to and from the home hospital this is expected to be arranged separately.</dd></div>
            </dl>`)}
            <div class="two-col">
                ${section("Before You Apply — Documents to have ready", html`<dl class="info-grid">${[["Two References", "From the institution head/senior colleague and another colleague."], ["Visitor-Observer Application", "CMC Vellore format with required certificates and health declaration."], ["Leave Sanction Letter", "Confirming approved leave for the training period."], ["Medical Fitness Certificate", "Confirming fitness to travel and attend the programme."]].map(([k, v]) => html`<div class="info-grid-item"><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>`)}
                ${section("The cycle runs once a year, giving hospitals time to plan around it.", html`<ol class="flow-steps">${[["Call Opens", "Advertised via CMC Vellore's website and partner networks."], ["Apply", "Submit the form with two references and required certificates before the closing date."], ["Screening", "A committee with the Associate Director, Missions, and FOV UK reviews the application."], ["Award", "Results are announced by 15th May. A tailored training plan is prepared for you."], ["Train at CMC", "Two to four weeks of re-skilling, with accommodation and meals arranged."], ["Return & Report", "Fellows return to their hospital and share what they learned with their team."]].map(([t, d], i) => html`<li class="flow-step"><span class="flow-num">${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`)}</ol>`)}
            </div>
            <section class="card feature-banner"><div class="feature-banner-copy">
                <h2>Ready to Apply?</h2>
                <p>Two to four weeks at CMC Vellore, fully arranged the next call closes 31st May 2026.</p>
                <div class="btn-row"><button type="button" class="btn btn-primary" data-apply>Apply For Grant</button><a class="btn btn-secondary" href="${SAM_GUIDELINES}" target="_blank" rel="noopener">Download Guidelines</a></div>
            </div></section>`);

        view.querySelectorAll("[data-apply]").forEach(b => b.addEventListener("click", () => openSamForm(null, () => App.navigate("sam/dashboard"))));

    }

    function samApplications(box, admin) {

        const tabs = admin
            ? [["Submitted", "Submitted"], ["UnderReview", "Under Review"], ["Approved", "Approved"], ["Rejected", "Rejected"], ["All", "All"]]
            : [["Draft", "Draft"], ["Submitted", "Submitted"], ["UnderReview", "Under Review"], ["Approved", "Approved"], ["Rejected", "Rejected"]];

        let active = tabs[0][0];
        let rows = [];
        let table = null;

        box.innerHTML = String(html`${tabBar(tabs, active)}<div data-table>${skeletonList(4)}</div>`);

        const tableEl = box.querySelector("[data-table]");
        const statusOf = tab => tab === "UnderReview" ? "Under Review" : tab;

        const actions = r => {
            if (!admin) return active === "Draft" ? html`<button type="button" class="btn btn-primary btn-sm" data-act="edit" data-id="${r._id}"><i class="bi bi-pencil"></i> Edit</button>` : Forms.statusBadge(r.applicationStatus);
            if (active === "Submitted") return html`<div class="btn-stack"><button type="button" class="btn btn-secondary btn-sm" data-status="Under Review" data-id="${r._id}">Start Review</button><button type="button" class="btn btn-danger-soft btn-sm" data-status="Rejected" data-id="${r._id}">Reject</button></div>`;
            if (active === "UnderReview") return html`<div class="btn-stack"><button type="button" class="btn btn-primary btn-sm" data-status="Approved" data-id="${r._id}">Approve</button><button type="button" class="btn btn-danger-soft btn-sm" data-status="Rejected" data-id="${r._id}">Reject</button></div>`;
            if (active === "Approved") return html`<button type="button" class="btn btn-danger-soft btn-sm" data-status="Rejected" data-id="${r._id}">Reject</button>`;
            if (active === "Rejected") return html`<button type="button" class="btn btn-secondary btn-sm" data-status="Submitted" data-id="${r._id}">Reopen</button>`;
            return Forms.statusBadge(r.applicationStatus);
        };

        async function load() {

            tableEl.innerHTML = String(skeletonList(4));
            table = null;

            const q = { isDeleted: false };

            if (!admin) q["added.userId"] = me().id;

            q.applicationStatus = active === "All" ? { $ne: "Draft" } : statusOf(active);

            try {

                rows = await ConnectAPI.rows({ collection: "samProjectApplicationForm", query: q, options: { sort: { "added.addedDate": -1 } } });

                table = dataTable(tableEl, {
                    columns: [
                        { key: "samGrantId", title: "SAM Grant ID", render: r => r.samGrantId || "Not yet assigned" },
                        ...(admin ? [{ key: "applicantName", title: "Applicant" }, { key: "hospitalNameAddress", title: "Mission Hospital" }] : []),
                        { key: "trainingArea", title: "Training Area" },
                        { key: "added", title: "Submitted", sortValue: r => r.added?.addedDate || "", render: r => date(r.added?.addedDate) },
                        { key: "status", title: admin ? "Status / Action" : "Status", sortable: false, render: actions },
                        { key: "view", title: "View", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="view" data-id="${r._id}" aria-label="View" title="View"><i class="bi bi-eye"></i></button>` },
                        { key: "chat", title: "Chat", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-act="chat" data-id="${r._id}" aria-label="Chat" title="Chat"><i class="bi bi-chat-dots"></i>${r.samChatThread?.length ? html`<span class="badge badge-accent">${r.samChatThread.length}</span>` : ""}</button>` }
                    ],
                    rows,
                    searchKeys: ["samGrantId", "applicantName", "hospitalNameAddress", "trainingArea"],
                    searchPlaceholder: "Search applications",
                    emptyText: "No applications in this list."
                });

            } catch (error) {
                tableEl.innerHTML = String(errorState(error.message));
            }

        }

        box.addEventListener("click", async event => {

            const tab = event.target.closest("[data-tab]");

            if (tab) {
                active = tab.dataset.tab;
                box.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-pressed", String(b === tab)));
                load();
                return;
            }

            const status = event.target.closest("[data-status]");

            if (status) {

                if (!await Forms.confirm({ title: "Update application", message: `Change this application's status to "${status.dataset.status}"?`, confirmLabel: "Confirm", danger: status.dataset.status === "Rejected" })) return;

                try {
                    await ConnectAPI.update("samProjectApplicationForm", { _id: status.dataset.id }, { $set: { applicationStatus: status.dataset.status, modified: stamp("modifiedDate") } });
                    UI.toast("SAM application updated successfully", { type: "success" });
                    load();
                } catch (error) {
                    UI.toast("Could not update this application. Please try again.", { type: "error", message: error.message });
                }

                return;

            }

            const act = event.target.closest("[data-act]");

            if (!act) return;

            const row = rows.find(r => String(r._id) === act.dataset.id);

            if (act.dataset.act === "edit") openSamForm(row._id, load);
            if (act.dataset.act === "view") viewApplication({ title: `SAM Application ${row.samGrantId || ""}`, formKey: "samProjectApplicationForm", record: row, fileFields: Object.keys(row).map(k => [k, ""]) });
            if (act.dataset.act === "chat") openThread({ title: "Messages", record: row, field: "samChatThread", collection: "samProjectApplicationForm", canWrite: true, canEdit: false, authorRole: admin ? "admin" : "applicant", onChange: () => table?.setRows(rows) });

        });

        load();

    }

    async function samReports(box, admin) {

        box.innerHTML = String(skeletonList(3));

        try {

            const rows = await ConnectAPI.rows({ collection: "samTrainingReportForm", query: admin ? { isDeleted: false, reportStatus: "Submitted" } : { isDeleted: false, "added.userId": me().id }, options: { sort: { "added.addedDate": -1 } } });

            dataTable(box, {
                columns: [
                    { key: "samGrantId", title: "SAM Grant ID" },
                    ...(admin ? [{ key: "fellow", title: "Fellow", sortValue: r => r.added?.userName || "", render: r => r.added?.userName || "—" }] : []),
                    { key: "trainingArea", title: "Training Area" },
                    { key: "added", title: "Submitted", sortValue: r => r.added?.addedDate || "", render: r => date(r.added?.addedDate) },
                    ...(admin ? [] : [{ key: "reportStatus", title: "Status", render: r => Forms.statusBadge(r.reportStatus) }]),
                    { key: "view", title: "View", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-report="${r._id}" aria-label="View" title="View"><i class="bi bi-eye"></i></button>${!admin && r.reportStatus === "Draft" ? html` <button type="button" class="btn btn-primary btn-sm" data-edit-report="${r._id}">Edit</button>` : ""}` }
                ],
                rows,
                emptyText: admin ? "No training reports have been submitted yet." : "Reports you've already sent in are listed here."
            });

            box.onclick = event => {
                const view = event.target.closest("[data-report]");
                const edit = event.target.closest("[data-edit-report]");
                if (view) viewApplication({ title: "Training Report", formKey: "samTrainingReportForm", record: rows.find(r => String(r._id) === view.dataset.report), fileFields: [] });
                if (edit) openReportForm(edit.dataset.editReport, () => samReports(box, admin));
            };

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }

    function renderSamDashboard(view, admin) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: me().name || "", title: admin ? "Welcome to SAM Project Admin Dashboard" : "Welcome to SAM Project Applicant Dashboard", icon: "bi-mortarboard", color: "purple", back: { href: "#/grants", label: "Grants" },
                actions: admin ? "" : html`<button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply For Grant</button>` })}
            ${samNav(admin ? "admin" : "dashboard")}
            ${section(admin ? "Applications" : "My Application", html`<div data-apps></div>`)}
            ${section("Training Report", html`<div data-reports></div>`, admin ? {} : {
                description: "Available once your application has been Approved and your training at CMC Vellore is complete. Reports you've already sent in are listed below.",
                actions: html`<button type="button" class="btn btn-secondary btn-sm" data-report-new><i class="bi bi-journal-plus"></i> Submit Training Report</button>`
            })}`);

        const reports = view.querySelector("[data-reports]");

        view.querySelector("[data-apply]")?.addEventListener("click", () => openSamForm(null, () => renderSamDashboard(view, admin)));
        view.querySelector("[data-report-new]")?.addEventListener("click", () => openReportForm(null, () => samReports(reports, admin)));

        samApplications(view.querySelector("[data-apps]"), admin);
        samReports(reports, admin);

    }

    function renderSam(view, params) {

        if (params[0] === "admin") {
            if (!isSamAdmin()) {
                view.innerHTML = String(html`${pageHeader({ title: "SAM Admin Dashboard", back: { href: "#/sam", label: "SAM Project" } })}${emptyState("bi-shield-lock", "Admins only", "The SAM admin dashboard is available to the Grant Committee.")}`);
                return;
            }
            return renderSamDashboard(view, true);
        }

        if (params[0] === "dashboard") return renderSamDashboard(view, false);

        return renderSamOverview(view);

    }


    // git header: Grants menu for userType "external user" with the Missions role;
    // FOV / SAM admins also need to reach their dashboards.
    const grantAccess = user => isGrantUser(user) || isFovAdmin() || isSamAdmin();

    App.register({ id: "grants", title: "Grants", icon: "bi-cash-stack", color: "green", group: "Grants", when: grantAccess, description: "FOV, SAM and research grants for mission hospitals.", render: renderGrants });
    App.register({ id: "fov", title: "FOV Grant", icon: "bi-building-add", color: "blue", group: "Grants", when: grantAccess, description: "Friends of Vellore UK grants for equipment, buildings and more.", render: renderFov });
    App.register({ id: "sam", title: "SAM Project", icon: "bi-mortarboard", color: "purple", group: "Grants", when: grantAccess, description: "Two to four weeks of re-skilling at CMC Vellore.", render: renderSam });

})();
