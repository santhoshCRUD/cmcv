/**
 * Mission Engagement (faculty): overview, Mandatory Mission Service and
 * Mission Visits.
 *
 * Ports of the git code:
 *   views/msnEngagement.html                           -> #/engagement
 *   views/MMService/mmService.html + loadMmServicePage,
 *     loadMmsApplication / handleMmsFormSave ("missionVisitApplication"),
 *     loadMmsOtherVisitApp ("mmsOtherVisits"), loadPreMmsVisits  -> #/mms, #/mms/visits
 *   views/missionVisits.html + msnVisitManPowerTable / saveMPInterest,
 *     loadMsnVisitForm ("missionVisits"), loadNotesFromJourney  -> #/mission-visits
 *
 * The Sabbatical page is "Coming Soon" in the git code
 * (views/msnSabbatical.html, loadMsnSabbaticalPage is undefined).
 * The MMS state chart (Chart.js in the git code) is drawn with CSS bars.
 */
(function () {

    const { html, raw, img, formatDate, emptyState, errorState, skeletonList, skeletonCards, pageHeader, section, dataTable, openDialog, multiline, renderMap } = Kit;

    const S3 = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/";
    const PLACEHOLDER = `${S3}_43782473c4ed75b1e167091821a4d700_Pictures.png`;
    const DEFAULT_HOSPITAL = `${S3}_313ea5411cb9f9e319423cc9a033b275_Pictures.png`;

    const me = () => window.currentUser || {};
    const isFaculty = user => String(user.userType || "").toLowerCase().includes("faculty");

    const tabs = active => html`
        <nav class="subnav" aria-label="Mission Engagement">
            ${[["engagement", "Overview"], ["mms", "Mandatory Mission Service"], ["mission-visits", "Mission Visits"]].map(([id, label]) => html`
                <a href="#/${id}" class="${active === id ? "is-active" : ""}" ${active === id ? raw('aria-current="page"') : ""}>${label}</a>`)}
        </nav>`;


    // -----------------------------------------------------------------
    // Overview (views/msnEngagement.html)
    // -----------------------------------------------------------------

    const TESTIMONIALS = [
        {
            quote: "Although I have very little experience in intensive care unit and trauma care, I must say that God equipped me in my training place (Department of Family Medicine, CMC Vellore) to manage the serious and critically ill patients. During my stay in this hospital, I experienced a spiritual renewal, grew closer to God, and began to cling to Him at every moment in my work place. I must say that every day I felt abundant Grace and Mercy showered upon me from above in managing diverse patient conditions! By the grace of God, I was able to assist and pray for patients in distress (first time I did in my life time) and saw multiple successful recoveries.",
            name: "Dr. Bino Rajamani J",
            detail: "MBBS, DCH, MD, DNB (Family Medicine)",
            place: "Makunda Christian Leprosy and General Hospital",
            dates: "16th March 2025 – 27th March 2025"
        },
        {
            quote: "This hospital has been serving the people of Trichy district from the year 1910 and functions under the CSI Trichy Tanjore Diocese. During my time there, I helped organize a Daycare chemotherapy administration area at this institution, as they do get patients referred from CMC, Vellore from the departments of Medical Oncology and Paediatric Haematology Oncology for their continuation chemotherapy sessions. However, as there was no laminar flow, NABH had not given them approval for administering chemotherapy. I liased with the laminar flow agents and organized CSR funding for purchase of the same. I have also compiled detailed instructions for administration of chemotherapy including checklists, monitoring sheets and drug loading instructions for individual drugs.",
            name: "Dr. Leenu Joseph",
            place: "CSI Mission General Hospital, Trichy",
            dates: "5th – 19th May 2025"
        }
    ];

    function renderOverview(view) {

        const program = (title, image, text, points, link) => html`
            <article class="card program-card">
                ${img(image, title, "program-card-img")}
                <div class="program-card-body">
                    <h2>${title}</h2>
                    ${text.map(p => html`<p>${p}</p>`)}
                    <ul class="check-list">${points.map(p => html`<li>${p}</li>`)}</ul>
                    ${link ? html`<a class="btn btn-primary btn-sm" href="${link}">Read More</a>` : html`<span class="badge">Coming Soon</span>`}
                </div>
            </article>`;

        view.innerHTML = String(html`
            ${pageHeader({ title: "Mission Engagement", icon: "bi-compass", color: "orange" })}
            ${tabs("engagement")}
            <section class="card panel"><div class="panel-body prose">
                <p>Christian Medical College (CMC) Vellore, being a quaternary-level teaching hospital - providing the highest quality of patient care and medical training, also has a deep ethos of serving marginalized communities across India. This commitment is carried forward through its Mission Hospitals Network—encompassing over 170 mission hospitals that operate primarily in remote or resource-limited regions where access to quality healthcare is scarce.</p>
                <p>Mission Engagement encompasses various programs designed by CMC to foster collaborative engagements that enable faculty from the Institution to engage with various mission hospitals. Currently, there are 3 broad programs that involve engagements at the department level as well as at the individual faculty level.</p>
                <p>The Missions Department coordinates these engagements and has facilitated hundreds of deputations to mission hospitals for clinical and operational support, enabling staff from CMC to contribute across a wide spectrum of healthcare disciplines.</p>
            </div></section>
            <div class="program-list">
                ${program("Mandatory Mission Service", `${S3}_ad7b8fbd975e61bc645281d17768ff4a_Pictures.jpg`, [
                    "The Mandatory Mission Service is part of a Faculty Engagement Program with Mission Hospitals and is designed for medical faculty to have an orientation to healthcare needs in the country, resources available and healthcare practice in mission hospitals.",
                    "All medical faculty (preclinical, paraclinical and clinical) are required to spend 14 days in select mission hospitals twice during their career period; once before confirmation and later before promotion to Professor level."
                ], ["Broadens faculty exposure to regional disease patterns and care practices.", "Complements academic and clinical relevance.", "Provide hands-on care to underserved populations.", "Strengthens mission hospitals through shared expertise."], "#/mms")}
                ${program("Mission Sabbatical", `${S3}_178631d73e4f9176a2f119c1c647fd4a_Pictures.jpg`, [
                    "The Mission Sabbatical—is a structured opportunity for senior faculty take short sabbatical leave of 6 months in a mission hospital. This is to enable faculty and staff to decentralize and develop education, service, research by adopting relevant mission hospitals for a short period and also to mentor young graduates and postgraduates posted for service commitment. It gives opportunity to contribute significantly to healthcare delivery in areas with pressing needs by offering clinical expertise, teaching, mentorship, and leadership support to these centres."
                ], ["Faculty on mission sabbatical continue receiving their full CMC salary and benefits, as per institutional sabbatical policies.", "Complements academic and clinical relevance.", "Travel and accommodation support are provided by respective mission hospitals.", "The mission sabbatical does not entail an additional service obligation."], null)}
                ${program("Mission Hospital Visits", `${S3}_233057fc8e3efde9b7935a4d806ac84b_Pictures.jpg`, [
                    "Mission hospital visits, either as part of Secondary Hospital Posting or Short deputations, are a key way to engage with mission hospitals and rural healthcare settings. These short-term or periodic visits serve several purposes."
                ], ["Clinical & Non-Clinical Support: Faculty provide direct patient care or developing systems in mission hospitals, filling gaps in specialist services and supporting local teams.", "Training and Mentorship: Through on-site teaching, case discussions, and skills transfer, CMC faculty help build the clinical and operational capacity of mission hospital staff.", "Assessment and Collaboration: Faculty also visit to assess the healthcare needs of mission hospitals and suggest operational improvements, governance models, and training opportunities."], "#/mission-visits")}
            </div>
            <div class="quote-grid">${TESTIMONIALS.map(t => html`
                <figure class="card quote-card">
                    <blockquote>${t.quote}</blockquote>
                    <figcaption><strong>${t.name}</strong>${t.detail ? html`<span>${t.detail}</span>` : ""}<span>${t.place}</span><span class="text-muted">${t.dates}</span></figcaption>
                </figure>`)}</div>`);

    }


    // -----------------------------------------------------------------
    // MMS application form (loadMmsApplication / handleMmsFormSave)
    // -----------------------------------------------------------------

    async function eligibleHospitals(departmentId) {

        const list = async query => (await ConnectAPI.rows({ collection: "MmsDepHsptlAll", query: { ...query, isDeleted: false }, projection: { allottedMissionHospitals: 1 } }))
            .flatMap(doc => doc.allottedMissionHospitals || [])
            .filter(h => h.hospitalEligibleForMmp === "yes" && h.missionHospitals);

        let hospitals = departmentId ? await list({ departmentId }) : [];

        return { hospitals, byDepartment: hospitals.length > 0, all: hospitals.length ? null : await list({}) };

    }

    function openApplication(pageKey = "application", id, onSaved) {

        const user = me();

        const titles = { application: "Application", indemnityCertificatePanel: "Upload Indemnity Certificate", visitStatusPanel: "Update Visit" };

        let recordId = null;

        const save = async (form, action) => {

            if (action !== "saveDraft") {
                const valid = await form.checkValidity(form.data, true);
                if (!valid) {
                    form.showErrors();
                    UI.toast("Please fix the highlighted fields.", { type: "warning" });
                    return;
                }
            }

            const data = await Forms.uploadFiles({ ...form.data }, "MmsApplication");
            const now = ConnectAPI.date(Date.now());
            const stamp = { userId: user.id || "", userName: user.name || "" };

            if (action === "saveDraft") Object.assign(data, { saveDraft: true, status: "draft", submit: false, added: data.added || { ...stamp, addedDate: now } });
            else if (action === "submitApplication") Object.assign(data, { saveDraft: false, submit: false, status: "submitted" });
            else Object.assign(data, { saveDraft: false, submit: false });

            data.departmentId = data.departmentId || user.departmentId || "";
            delete data._id;

            if (recordId) {
                await ConnectAPI.update("MmsApplication", { _id: recordId }, { $set: { ...data, modified: { ...stamp, modifiedDate: now } } });
            } else {
                await ConnectAPI.insert("MmsApplication", { ...data, added: { ...stamp, addedDate: now } });
            }

            UI.toast(action === "saveDraft"
                ? "Your draft has been saved successfully."
                : action === "submitApplication"
                    ? "Your request is being processed, you will receive an email after confirmation. Thank you!"
                    : "Your application has been saved successfully.", { type: "success", timeout: 6000 });

            dialog.close();
            onSaved?.();

        };

        const dialog = Forms.open({
            title: titles[pageKey] || "Application",
            formKey: "missionVisitApplication",
            keepOpen: true,
            prepare: def => {
                // One wizard page at a time, no wizard buttons (the form's own buttons emit events)
                (def.components || []).forEach(page => {
                    if (page.buttonSettings) Object.assign(page.buttonSettings, { cancel: false, next: false, submit: false, previous: false });
                    page.hidden = false;
                    page.customConditional = page.key === pageKey ? "show = true" : "show = false";
                    page.breadcrumbClickable = false;
                });
            },
            onReady: async form => {

                const set = (key, value) => form.getComponent(key)?.setValue(value || "");

                set("name", user.name);
                set("department", user.department);
                set("designation", user.designation);
                set("empNumber", user.employeeId);
                set("email", user.email);

                const hospComp = form.getComponent("missionHospital");

                if (hospComp && user.departmentId) {

                    const { hospitals } = await eligibleHospitals(user.departmentId);

                    if (hospitals.length) {
                        hospComp.component.data = { ...(hospComp.component.data || {}), values: hospitals.map(h => ({ label: h.missionHospitals.missionHospitalName, value: { _id: h.missionHospitals._id, missionHospitalName: h.missionHospitals.missionHospitalName } })) };
                        hospComp.component.dataSrc = "values";
                        hospComp.redraw();
                        hospComp.setValue(null);
                    }

                }

                const filter = { empNumber: user.employeeId, isDeleted: false, ...(pageKey === "application" ? { status: "draft" } : { saveDraft: false }), ...(id ? { _id: id } : {}) };

                const [existing] = await ConnectAPI.rows({ collection: "MmsApplication", query: filter });

                if (existing) {
                    recordId = existing._id;
                    form.submission = { data: existing };
                }

            },
            onEvent: (type, form) => ["saveDraft", "submitApplication", "save"].includes(type) ? save(form, type) : null,
            onSubmit: (data, form) => save(form, "save"),
            successMessage: null
        });

    }

    function openOtherVisit() {

        const user = me();

        Forms.open({
            title: "Other Visits",
            formKey: "mmsOtherVisits",
            hide: ["missionsOfficeUse"],
            successMessage: "Your visit details have been saved successfully.",
            onReady: form => {
                [["name", user.name], ["employeeNo", user.employeeId], ["department", user.department], ["designation", user.designation], ["email", user.email]]
                    .forEach(([key, value]) => form.getComponent(key)?.setValue(value || ""));
            },
            onSubmit: async data => {
                const doc = await Forms.uploadFiles({ ...data }, "MmsOtherVisit");
                await ConnectAPI.insert("MmsOtherVisit", { ...doc, status: "submitted", isDeleted: false, added: { userName: user.name || "", userId: user.id || "", addedDate: ConnectAPI.date(Date.now()) } });
            }
        });

    }


    // -----------------------------------------------------------------
    // Visit report dialog ("preMmsVisits" modal)
    // -----------------------------------------------------------------

    const pictureOf = visit => visit.uploadPicture?.[0]?.data?.url || visit.uploadPicture?.[0]?.url || visit.imageUrl || PLACEHOLDER;

    function openReport(visit) {

        openDialog({
            title: visit.missionHospital?.missionHospitalName || visit.missionHospitalName || "Visit",
            size: "lg",
            body: html`
                <div class="report-view">
                    ${img(pictureOf(visit), "Visit picture", "report-view-img")}
                    <h3>Dr. ${visit.name || ""}</h3>
                    <p class="text-muted"><strong>Date:</strong> ${formatDate(visit.fromDate2 || visit.fromDate) || "-"} - ${formatDate(visit.toDate2 || visit.toDate) || "-"}</p>
                    ${visit.highlightedQuote ? html`<blockquote class="report-quote">${visit.highlightedQuote}</blockquote>` : ""}
                    <div class="prose">${multiline(visit.finalReportForPublicaions || visit.briefReport || visit.summary || "")}</div>
                </div>`
        });

    }

    const visitRow = visit => html`
        <button type="button" class="visit-row" data-visit="${visit._id}">
            ${img(pictureOf(visit), "", "visit-row-img")}
            <span><strong>${visit.name || visit.missionHospital?.missionHospitalName || ""}</strong>
                <span class="text-muted">${formatDate(visit.fromDate2 || visit.fromDate)} - ${formatDate(visit.toDate2 || visit.toDate)}</span>
                <span class="text-subtle">Brief Report</span></span>
        </button>`;


    // -----------------------------------------------------------------
    // MMS page (loadMmServicePage)
    // -----------------------------------------------------------------

    const FLOW = [
        ["Planning and Selection", [
            ["Obtain Initial Permission", "Secure authorization from the Head of Department/Unit (HOD/HOU) to pursue the visit."],
            ["Identify Eligible Hospitals", "Use the interactive map provided below to view the list of eligible Mission Hospitals for MMS."],
            ["Consult and Choose Hospital", "Select a Mission Hospital with guidance from the Missions Office. The team responds to queries within 1 week."],
            ["Contact the Hospital Administrator", "Connect with the Mission Hospital administrator to confirm scheduling and coordinate visit logistics."]
        ]],
        ["Application and Approval", [
            ["Submit Application Form", "Fill out and submit the official Application form on the portal, after assessing the needs of the hospital, to make the best use of your visit."],
            ["Application Review & Decision", "The Missions Office will approve/reject the application within a week."],
            ["Monitor Application Status", "Monitor the application status in the portal for updates."]
        ]],
        ["Upcoming Visit Preparation", [
            ["Apply for Deputation Leave", "Upon receiving the Missions Office approval email, request deputation leave from the Associate Director (Medical)"],
            ["Issuing of Indemnity Certificate", "The MS Office will issue the Indemnity Certificate."],
            ["Final Visit Notification", "The Missions Office will email you, your HOD, and the Mission Hospital confirming the approved visit."]
        ]],
        ["Visit and Post-Visit Report", [
            ["Hospital Information", "Please collect information about the hospital that may be useful for others who are visiting the same hospital."],
            ["Update Visit Details", "Please ensure that you update your visit details in the form to record your visit for confirmation/promotion purposes."],
            ["Incorporate Insights", "Use information from these visits into teaching and research to give future medical professionals a country-wide healthcare perspective."]
        ]]
    ];

    const FAQ = [
        ["How would I benefit?", ["You will receive an orientation to the country's healthcare needs.", "You will learn to work in a resource-limited facility.", "You will also learn healthcare practices in mission hospitals."]],
        ["When is it mandatory?", ["When you are due for confirmation.", "When you are due for promotion to professorship.", "Those completing their service obligation can finish the MMS with HOD consultation during their service obligation period before confirmation."]],
        ["How many days should I go?", ["You should preferably go for a single visit of 2 weeks.", "Or two visits of one week each.", "Visit to mission hospitals undertaken within three years prior to confirmation and promotion can also be considered. (See FAQ 10)"]],
        ["How can it be done?", ["Accompanying medical students on a Secondary Hospital Program (SHP).", "If the SHP duration is less than two weeks, the remaining duration needs to be compensated by staying back in the MH for the required number of days post SHP or by going for another SHP, or by visiting a Mission Hospital later.", "If you are not interested in going for SHP, you can directly apply for a service posting in the application above based on the hospital's needs."]],
        ["Choosing a Hospital", ["MHs in areas of need and/or those that have requested HR may be highlighted in the list.", "Please note that mission hospitals in capital cities in South India / those located near CMC, are excluded from this list, as the broad objective of MMP is for the faculty to understand the health and socio-economic dynamics of various regions in our country."]],
        ["Pre-clinical and Para-Clinical Departments", ["Pre-clinical and para-clinical department faculty should preferably go to centers with teaching needs, as many Mission Hospitals run Nursing and Allied Health courses.", "Para-clinical faculty may visit MHs for: Lab upgradation; Staff training (based on MH’s existing needs and facilities).", "Accompanying students for SHP also counts"]],
        ["Subspecialty", ["If there aren’t enough hospitals with the subspecialty, a Mission Hospital with the respective broad specialty may be chosen."]],
        ["Travel", ["Travel as per eligibility.", "If air travel is inevitable, taxi travel (at institutional rates) from residence to the nearest airport may be claimed."]],
        ["Food", ["Faculty can enroll in the campus mess/food service, with charges reimbursed upon bill submission.", "If on-campus food isn't available, Z-city rates will apply to all faculty."]],
        ["Previous Mission Hospital camps/visits", ["Service in camps and activities organized by your department at a mission hospital can count toward your MMS credits. (those which happened within the last 3 years).", "However, you must spend at least 7 of the required 14 days working directly at a mission hospital.", "If you have participated in such work, you must submit a report detailing your contributions and visit dates, signed by the HOD or HOU."]],
        ["Spouse and Children", ["Spouses and Children are welcome to join, but please inform the mission hospital in advance for arrangements.", "If the spouse is a clinician or healthcare worker, they can discuss their involvement with the hospital.", "Expenses for children and the spouse (if not visiting for MMP or at the hospital's request) are the faculty's responsibility."]],
        ["Hospitals in the MMS list", ["Mission Hospitals in CMC’s network that have requested specialty assistance or have potential for service delivery and educational activities are listed.", "To maintain equitable faculty distribution, the list is updated periodically, temporarily removing hospitals that have been previously visited until others are visited."]],
        ["Accommodation", ["Faculty members are encouraged to stay on campus at the mission hospital when possible.", "Some hospitals may provide free accommodation.", "If there is a charge, faculty must submit the actual bill for reimbursement.", "If on-campus accommodation is not available, the hospital will arrange off-campus housing. Reimbursement will follow Z-city rates for all eligible faculty members, requiring submission of the actual bill."]],
        ["Communicating your visit to the hospital", ["While official correspondence from CMC communicates the dates and details of the faculty visiting the mission hospital, to ensure optimal logistics, the faculty should contact the Mission hospital's nodal person prior to the visit."]],
        ["What about leave?", ["Deputation leave can be used for visits, including travel days.", "However, travel days are excluded from MMS, but Sundays within the service period can be counted.", "Annual leave can cover any remaining days if there aren’t enough deputation leaves."]],
        ["What about Expenses?", ["Expenses will be met from the respective department's special fund.", "For SHP, travel expenses will be reimbursed according to SHP guidelines informed by the principal’s office."]],
        ["Completion Report from Mission Hospital", ["The Mission Hospital is to provide the Missions department with a certificate of completion for your posting, detailing the work done by you during MMS and the dates of your visit."]],
        ["Updating Visit details on returning", ["Please update your visit on the portal with details of clinical/teaching/training work undertaken by you during the posting, observations about healthcare practices at the MH, and suggestions for changes.", "Possible collaborations between your department and the MH in the future, as well as any other relevant input, may also be included."]]
    ];

    async function renderMms(view, params) {

        if (params[0] === "visits") return renderPreMmsVisits(view);

        const user = me();

        view.innerHTML = String(html`
            ${pageHeader({ title: "Mandatory Missions Service", icon: "bi-hospital", color: "orange", actions: html`<a class="btn btn-secondary" href="#mms-faq" data-scroll><i class="bi bi-question-circle"></i> FAQ</a>` })}
            ${tabs("mms")}
            <div id="mmsUpcoming"></div>
            <section class="card panel"><div class="panel-body prose">
                <p>The Christian Medical College, Vellore is governed by the Christian Medical College Vellore Association—representing over 50 diverse Indian churches and organizations. With more than 164 hospitals in our network, many serve as lifelines for rural communities in need.</p>
                <p>Our institution stands as a powerful symbol of hope and healing. At the heart of our mission is our commitment to nurture compassionate healthcare professionals devoted to serving others in the spirit of Christ. To ensure our faculty are equipped to tackle the pressing healthcare challenges faced by our nation, and to immerse themselves in the invaluable resources and practices found within our mission hospitals, those seeking confirmation or promotion to professorship are encouraged to dedicate at least two weeks of service within this vital network. This transformative experience is not just a requirement but a profound opportunity for growth, ensuring our faculty remain deeply connected to our mission and the communities we serve with unwavering dedication.</p>
                <p class="pull-quote">"Greatness begins where comfort ends"<br><span>Will you go to a state where only a few have gone and make a difference?</span></p>
            </div></section>
            ${section("Mission Hospital Visit Approval & Logistics Flow", html`
                <ol class="flow-steps">${FLOW.map(([title, steps], i) => html`
                    <li class="flow-step"><span class="flow-num">${i + 1}</span><div><strong>${title}</strong>
                        <ul>${steps.map(([label, text]) => html`<li><strong>${label}:</strong> ${text}</li>`)}</ul></div></li>`)}</ol>`)}
            <div class="two-col">
                ${section("Apply for MMS", html`
                    <p>If this is your first time applying for MMS, kindly go through the "Mission Hospital Visit Approval and Logistics Flow" outlined above before clicking here to submit your application.</p>
                    <div id="draftMsg"></div>
                    <button type="button" class="btn btn-primary" data-apply><i class="bi bi-pencil-square"></i> Apply Here</button>`)}
                ${section("Other Visits (Within The Past Three Years)", html`
                    <p>Please submit supporting documentation for any Mission Hospital visits (camps, SHPs, or departmental activities) to be considered for Mandatory Mission Service.</p>
                    <button type="button" class="btn btn-secondary" data-other><i class="bi bi-plus-lg"></i> Enter Other Visit Details</button>`)}
            </div>
            <div id="userMmsVisits"></div>
            <div class="two-col">
                ${section(`Past ${user.department || "department"} Visits`, html`<div id="preMmsVisits">${skeletonList(3)}</div>`)}
                ${section("Faculty visits by state", html`<div id="mmsChart">${skeletonList(3)}</div>`)}
            </div>
            ${section("Mission Network Hospital", html`<div id="mmsHospitals">${skeletonList(4)}</div>`, {
                description: "Explore our interactive map and discover inspiring opportunities where your department's services are needed.",
                actions: html`<button type="button" class="btn btn-secondary btn-sm" data-map hidden><i class="bi bi-map"></i> Show map</button>`
            })}
            ${section("Some Frequently Asked Questions", html`<div class="accordion-list">${FAQ.map(([q, answers], i) => html`
                <details class="accordion-item-lite"><summary><strong>${i + 1}. ${q}</strong></summary><ul>${answers.map(a => html`<li>${a}</li>`)}</ul></details>`)}</div>`, { id: "mms-faq" })}`);

        const reload = () => renderMms(view, params);

        view.querySelector("[data-apply]").addEventListener("click", () => openApplication("application", null, reload));
        view.querySelector("[data-other]").addEventListener("click", openOtherVisit);
        view.querySelector("[data-scroll]").addEventListener("click", event => { event.preventDefault(); view.querySelector("#mms-faq").scrollIntoView({ behavior: "smooth" }); });

        loadEligible(view, user);

        const results = await ConnectAPI.fetchMany([
            { collection: "MmsApplication", query: { isDeleted: false } },
            { collection: "MissionHospital", query: { isDeleted: "false" }, projection: { _id: 1, hospitalState: 1, hospitalImages: 1 } },
            { collection: "MmsOtherVisit", query: { employeeNo: user.employeeId, isDeleted: false } },
            { collection: "MmsVisitComplt", query: { employeeNo: user.employeeId, isDeleted: false } }
        ]);

        if (results.MmsApplication.error) {
            view.querySelector("#preMmsVisits").innerHTML = String(errorState(results.MmsApplication.error));
            view.querySelector("#mmsChart").innerHTML = "";
            return;
        }

        const apps = results.MmsApplication.data;
        const hospitals = new Map(results.MissionHospital.data.map(h => [String(h._id), h]));
        const inDept = item => item.department === user.department || item.departmentId === user.departmentId;

        // State chart (completed visits, total vs. your department)
        const counts = {};

        apps.filter(a => a.visitStatus === "completed").forEach(a => {
            const state = hospitals.get(String(a.missionHospital?._id))?.hospitalState;
            if (!state) return;
            counts[state] = counts[state] || { total: 0, dept: 0 };
            counts[state].total++;
            if (inDept(a)) counts[state].dept++;
        });

        const rows = Object.entries(counts).sort((a, b) => b[1].total - a[1].total);
        const totalVisits = rows.reduce((sum, [, c]) => sum + c.total, 0);
        const max = Math.max(1, ...rows.map(([, c]) => c.total));
        const pct = value => `${((value / totalVisits) * 100).toFixed(1)}%`;

        view.querySelector("#mmsChart").innerHTML = rows.length ? String(html`
            <div class="bar-legend"><span><i class="bar-swatch"></i>Total Faculty Visit</span><span><i class="bar-swatch bar-swatch-alt"></i>${user.department || "Department"} Faculty Visit</span></div>
            <ul class="bar-chart">${rows.map(([state, c]) => html`
                <li><span class="bar-label">${state}</span>
                    <span class="bar-track"><span class="bar" style="width:${(c.total / max) * 100}%"></span><span class="bar bar-alt" style="width:${(c.dept / max) * 100}%"></span></span>
                    <span class="bar-value">${pct(c.total)}${c.dept ? html` <span class="text-subtle">/ ${pct(c.dept)}</span>` : ""}</span></li>`)}</ul>`)
            : String(emptyState("bi-bar-chart", "No completed visits yet"));

        // Department + own applications
        const deptApps = apps.filter(inDept);
        const mine = deptApps.filter(a => a.empNumber === user.employeeId);

        if (mine.some(a => a.status === "draft")) {
            view.querySelector("#draftMsg").innerHTML = String(html`<p class="notice-inline"><i class="bi bi-exclamation-circle"></i> You have a saved draft. Please click Apply Here to continue your application.</p>`);
        }

        const upcoming = mine.filter(a => (a.status === "approved" || a.status === "submitted") && a.visitStatus !== "completed" && a.visitStatus !== "cancelled");

        if (upcoming.length) {

            view.querySelector("#mmsUpcoming").innerHTML = String(section("Your Upcoming Visit", html`<div class="upcoming-grid">${upcoming.map(a => {
                const approved = a.status === "approved";
                const hospitalImg = hospitals.get(String(a.missionHospital?._id))?.hospitalImages?.[0]?.url || DEFAULT_HOSPITAL;
                return html`
                    <article class="card upcoming-card">
                        ${img(hospitalImg, "Hospital", "upcoming-card-img")}
                        <div class="upcoming-card-body">
                            <p>Dear Dr. ${a.name || user.name || ""}, your Mandatory Mission Service visit is ${Forms.statusBadge(approved ? "Approved" : "Submitted")}</p>
                            <dl><dt>Date of Visit</dt><dd>${formatDate(a.fromDate) || "-"} - ${formatDate(a.toDate) || "-"}</dd>
                                <dt>Hospital chosen for MMS</dt><dd>${a.missionHospital?.missionHospitalName || "-"}</dd></dl>
                            ${approved ? html`
                                <div class="upcoming-actions">
                                    <button type="button" class="btn btn-secondary btn-sm" data-page="indemnityCertificatePanel" data-id="${a._id}"><i class="bi bi-upload"></i> Upload indemnity certificate</button>
                                    <button type="button" class="btn btn-primary btn-sm" data-page="visitStatusPanel" data-id="${a._id}"><i class="bi bi-pencil-square"></i> Update Visit</button>
                                </div>` : html`<p class="text-muted">Your application is submitted and is being processed.</p>`}
                        </div>
                    </article>`;
            })}</div>`));

            view.querySelectorAll("#mmsUpcoming [data-page]").forEach(button => button.addEventListener("click", () => openApplication(button.dataset.page, button.dataset.id, reload)));

        }

        // Past department visits
        const completed = deptApps.filter(a => a.visitStatus === "completed" && a.numberOfDays !== null);
        const preBox = view.querySelector("#preMmsVisits");

        preBox.innerHTML = completed.length
            ? String(html`<div class="visit-list">${completed.slice(0, 5).map(visitRow)}</div><a class="btn btn-secondary btn-sm" href="#/mms/visits">View More</a>`)
            : String(emptyState("bi-person-walking", "Our records show that you are the first person from your department."));

        const all = [...completed, ...results.MmsOtherVisit.data];

        preBox.addEventListener("click", event => {
            const row = event.target.closest("[data-visit]");
            if (row) openReport(completed.find(v => String(v._id) === row.dataset.visit));
        });

        // Completion records (confirmation / professorship)
        const myCompleted = [...completed.filter(a => a.empNumber === user.employeeId), ...results.MmsOtherVisit.data];
        const records = results.MmsVisitComplt.data;

        if (completed.some(a => a.empNumber === user.employeeId) && records.length) {

            const block = (record, title) => record ? html`
                <details class="accordion-item-lite" open>
                    <summary><strong>${title}</strong></summary>
                    <p>Number of days you have finished your MMS: <span class="badge badge-accent">${record.totalNumberOfDays ?? "—"}</span></p>
                    ${record.completionCertificate?.[0]?.url ? html`<p><a class="btn btn-secondary btn-sm" href="${record.completionCertificate[0].url}" target="_blank" rel="noopener"><i class="bi bi-download"></i> Download your MMS certificate</a></p>` : ""}
                    <h4 class="detail-subhead">Past Visits</h4>
                    <div class="visit-list">${myCompleted.filter(v => record.visitedHospital?.some(h => h.missionHospitalName === v.missionHospital?.missionHospitalName)).map(visitRow)}</div>
                </details>` : "";

            view.querySelector("#userMmsVisits").innerHTML = String(section("Your MMS", html`<div class="accordion-list">
                ${block(records.find(r => r.reason === "confirmation"), "Visits for Confirmation")}
                ${block(records.find(r => r.reason === "professorship"), "Visits for Professorship")}</div>`));

            view.querySelector("#userMmsVisits").addEventListener("click", event => {
                const row = event.target.closest("[data-visit]");
                if (row) openReport(all.find(v => String(v._id) === row.dataset.visit) || {});
            });

        }

    }

    async function loadEligible(view, user) {

        const box = view.querySelector("#mmsHospitals");
        const mapBtn = view.querySelector("[data-map]");

        try {

            const { hospitals, all } = await eligibleHospitals(user.departmentId);
            const list = (hospitals.length ? hospitals : all || []).map(h => ({
                hospitalName: h.missionHospitals?.missionHospitalName || "",
                hospitalId: h.missionHospitals?._id || "",
                contactPerson: h.contactPerson || "Details",
                contactNumber: h.contactNumber || "Details"
            }));

            if (!list.length) {
                box.innerHTML = String(emptyState("bi-hospital", "No eligible hospitals listed right now", "Contact the Missions office for guidance."));
                return;
            }

            box.innerHTML = String(html`<div data-map-box class="map-box" hidden></div><div data-table></div>`);

            dataTable(box.querySelector("[data-table]"), {
                columns: [
                    { key: "hospitalName", title: "Hospital", render: h => html`<a href="#/hospitals/${encodeURIComponent(h.hospitalId)}">${h.hospitalName}</a>` },
                    { key: "contactPerson", title: "Contact Person" },
                    { key: "contactNumber", title: "Contact Number" }
                ],
                rows: list,
                pageSize: 8,
                searchPlaceholder: "Search hospitals"
            });

            mapBtn.hidden = false;

            mapBtn.addEventListener("click", async () => {

                const mapBox = box.querySelector("[data-map-box]");

                mapBox.hidden = !mapBox.hidden;
                mapBtn.innerHTML = mapBox.hidden ? '<i class="bi bi-map"></i> Show map' : '<i class="bi bi-list"></i> Hide map';

                if (!mapBox.hidden && !mapBox.dataset.ready) {

                    mapBox.dataset.ready = "1";

                    const coords = await ConnectAPI.rows({ collection: "MissionHospital", query: { _id: { $in: list.map(h => h.hospitalId) }, isDeleted: "false" }, projection: { _id: 1, missionHospitalName: 1, hospitalLatitude: 1, hospitalLongitude: 1 } });

                    renderMap(mapBox, coords.map(h => {
                        const info = list.find(l => String(l.hospitalId) === String(h._id)) || {};
                        return { lat: h.hospitalLatitude, lng: h.hospitalLongitude, title: h.missionHospitalName, info: String(html`<strong>${h.missionHospitalName}</strong><br>${info.contactPerson || ""} ${info.contactNumber ? html`· ${info.contactNumber}` : ""}<br><a href="#/hospitals/${encodeURIComponent(h._id)}">View details</a>`) };
                    }));

                }

            });

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }

    async function renderPreMmsVisits(view) {

        const user = me();

        view.innerHTML = String(html`
            ${pageHeader({ title: `Past ${user.department || "department"} Visits`, icon: "bi-person-walking", color: "orange", back: { href: "#/mms", label: "Mandatory Mission Service" } })}
            <section class="card panel"><div class="panel-body" id="preTable">${skeletonList(5)}</div></section>`);

        try {

            const rows = await ConnectAPI.rows({ collection: "MmsApplication", query: { isDeleted: false, department: user.department || " ", visitStatus: "completed" }, options: { sort: { "added.addedDate": -1 } } });

            const box = view.querySelector("#preTable");

            dataTable(box, {
                columns: [
                    { key: "name", title: "Name" },
                    { key: "designation", title: "Designation" },
                    { key: "hospital", title: "Hospital Name", sortValue: r => r.missionHospital?.missionHospitalName || "", render: r => r.missionHospital?.missionHospitalName || "—" },
                    { key: "fromDate2", title: "From Date", render: r => formatDate(r.fromDate2) || "-" },
                    { key: "toDate2", title: "To Date", render: r => formatDate(r.toDate2) || "-" },
                    { key: "details", title: "Details", sortable: false, render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-visit="${r._id}">Details</button>` }
                ],
                rows,
                searchKeys: ["name", "designation", r => r.missionHospital?.missionHospitalName || ""],
                emptyText: "Our records show that you are the first person from your department."
            });

            box.addEventListener("click", event => {
                const button = event.target.closest("[data-visit]");
                if (button) openReport(rows.find(r => String(r._id) === button.dataset.visit));
            });

        } catch (error) {
            view.querySelector("#preTable").innerHTML = String(errorState(error.message));
        }

    }


    // -----------------------------------------------------------------
    // Mission Visits (views/missionVisits.html)
    // -----------------------------------------------------------------

    const STORIES = [
        {
            heading: "Clinical And Nonclinical Support",
            intro: "You can provide direct patient care or develop systems in mission hospitals, filling gaps in specialist services and supporting local teams.",
            image: `${S3}_58faedc1072724e71fc03082b2a0e595_Pictures.jpeg`,
            title: "Sofia Madhavan’s service in the Nuba Mountains",
            modalImage: `${S3}_b6c7fdbca91ebdc732fab4fc134956e4_Pictures.jpeg`,
            body: "Ms. Sofia Madhavan was able to impart theoretical and practical skills to the local staff, Kanadi Ibrahim and Challu Abdalla, in the department of Orthotics. These had just returned from 6-Months of training in Uganda by the long-term Orthopaedic Doctors who annually visit the hospital twice to attend to patients. It was an opportunity for the two local staff to continue gaining hands-on skills and They laboured to establish a unit, the first of its kind in the Nuba Mountains. Whereas a few consumables had been procured in Uganda as startup supplies, Sofia carried with her: 10 pcs Crutch tips. 2 pcs of surfoms,10 pcs long screws and 1 pc drill bat. By the time she left, the two staff could do\n• Scratches from local bamboo sticks\n• Hand splints from PVC\n• Gateer from linen.\nOver the duration of her stay, Sofia, along with our prosthetists were able to serve numerous patients who travelled great distances to receive care at our hospital. It has been such a blessing to our staff to be trained under Sofia and collaborate on innovative ways to provide care with the limited resources at hand. Due to the ongoing security situation, there has been an increase in war-related injuries, with many patients sustaining amputations and living with mobility issues. Additionally, there is a high volume of patients within our population who need orthotic and prosthetic care due to infectious and cancer-related pathologies. In many ways, the assistance through prosthesis and orthotic care is regarded as a second chance for many of our patients who are already living on the margins. We are so grateful for the service and specialty that Sofia brought to our hospital, extending the excellence in health care that CMC Vellore is well known for, here to those who are suffering in Sudan. Given her expertise, she has provided a structural design/layout of a typical Orthopaedic Unit. We are yet to finalize the construction of the block. We shall follow her guidance",
            end: "Robert Nyakaana.\nAdministrator-Mother of Mercy Hospital\nNuba Mountains"
        },
        {
            heading: "Training and Mentorship",
            intro: "Through on-site teaching, case discussions, and skills transfer, faculty help build the clinical and operational capacity of mission hospital staff.",
            image: `${S3}_14a1c14332cf624061c185b0bda9d919_Pictures.webp`,
            title: "An Ode to helping hands",
            modalImage: `${S3}_4076f0a858d5328902fbbcf2edc0e4f0_Pictures.png`,
            body: "Mrs. S, a 70-year-old woman, arrived at the Christian Fellowship Hospital after experiencing giddiness that had led to a fall. Evaluation revealed Complete heart block, and she was advised to undergo permanent pacemaker implantation at a higher centre.\nUnfortunately, the cost of the device was far beyond her means, and the prospect of seeking care elsewhere felt overwhelming.For the next seven months, she continued to visit CFH with a quiet hope, trusting that somehow help might come her way.\nThat hope found an answer when Dr. John offered to visit and coordinate the procedure. Under his guidance and expertise, the cardiology team at CFH successfully implanted a permanent pacemaker. The procedure was carried out free of cost through the government insurance scheme, ensuring that financial limitations would not stand in the way of life-saving care.\nDeeply moved and grateful, Mrs. S expressed her heartfelt thanks to the hospital team and her prayers of gratitude to God for the gift of renewed life. Her journey stands as a testament to perseverance, compassion, and the power of timely medical care.",
            end: "Dr. Augustine"
        },
        {
            heading: "Assessment and Collaboration",
            intro: "Faculty also visit to assess the healthcare needs of mission hospitals and suggest operational improvements, governance models, and training opportunities.",
            image: `${S3}_a267e4e529290491eb146c0f25fc5293_Pictures.jpg`,
            title: "Mission Hospital Requests for Assistance with Buildings",
            modalImage: `${S3}_b3202e04f4e0788d803520365dbf51fa_Pictures.jpg`,
            body: "A comprehensive checklist prepared by Dr.Vijayanand Ismavel with his personal experience and expertise.",
            end: ""
        }
    ];

    async function renderMissionVisits(view) {

        const user = me();

        view.innerHTML = String(html`
            ${pageHeader({ title: "Mission Visits", icon: "bi-geo", color: "green" })}
            ${tabs("mission-visits")}
            <section class="card feature-banner">
                ${img(`${S3}_d1fe56fb804b4009edba0347eaba41e1_Pictures.png`, "Mission visits", "feature-banner-img")}
                <div class="feature-banner-copy">
                    <p>Our mission hospital network comprises approximately 200 hospitals operated by various church missions, spread across the country. These vital healthcare facilities are strategically located in rural areas, serving communities that would otherwise lack access to affordable and reliable medical care.</p>
                    <p><strong>Dear Dr. ${user.name || ""},</strong> If you have visited any mission hospital, please share your experiences here..</p>
                    <button type="button" class="btn btn-primary" data-upload><i class="bi bi-upload"></i> Upload your Visit</button>
                </div>
            </section>
            ${section("How can you help?", html`<div class="story-grid">${STORIES.map((s, i) => html`
                <article class="card story-card">
                    ${img(s.image, s.heading, "story-card-img")}
                    <div class="story-card-body"><h3>${s.heading}</h3><p>${s.intro}</p>
                        <button type="button" class="btn btn-secondary btn-sm" data-story="${i}">Read More</button></div>
                </article>`)}</div>`)}
            ${section("Are you interested?", html`<div id="interestTable">${skeletonList(3)}</div>`, { description: "Some of our mission hospitals have placed their needs for the following personnel.." })}
            ${section("Notes from the journey", html`<div id="journeyNotes">${skeletonCards(3)}</div>`)}`);

        view.querySelector("[data-upload]").addEventListener("click", () => openVisitForm(user));

        view.querySelectorAll("[data-story]").forEach(button => button.addEventListener("click", () => {
            const story = STORIES[Number(button.dataset.story)];
            openDialog({
                title: story.title,
                size: "lg",
                body: html`<div class="report-view">${img(story.modalImage, story.title, "report-view-img")}<div class="prose">${multiline(story.body)}</div>${story.end ? html`<p class="report-signoff">${multiline(story.end)}</p>` : ""}</div>`
            });
        }));

        loadInterest(view.querySelector("#interestTable"), user);
        loadJourney(view.querySelector("#journeyNotes"));

    }

    function openVisitForm(user) {

        Forms.open({
            title: "Mission Visit",
            formKey: "missionVisits",
            hide: ["missionsOfficeUse"],
            submission: { name: user.name || "", employeeNo: user.employeeId || "", designation: user.designation || "", cmcDepartments: user.department || "" },
            successMessage: "Your record have been submitted successfully. Thankyou!",
            onSubmit: async data => {
                const doc = await Forms.uploadFiles({ ...data }, "MsnVisitApp");
                await ConnectAPI.insert("MsnVisitApp", {
                    ...doc,
                    cmcDepartments: { _id: user.departmentId, name: user.department },
                    isDeleted: false,
                    status: "Submitted",
                    added: { userName: user.name || "", userId: user.id || "", addedDate: ConnectAPI.date(Date.now()) }
                });
            }
        });

    }

    async function loadInterest(box, user) {

        try {

            const results = await ConnectAPI.fetchMany([
                { collection: "MissionRequests", query: { missionStatus: { $in: ["Open"] }, isDeleted: "false" }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1, selectedLinkedDepartments: 1, fromMsnHospDate: 1, toMsnHospDate: 1 } },
                { collection: "MissionSpecializations", query: { "linkedDepartments._id": user.departmentId, isDeleted: "false" }, projection: { _id: 1, name: 1 } },
                { collection: "MissionHospital", query: { isDeleted: "false" }, projection: { _id: 1, missionHospitalName: 1 } },
                { collection: "ManPowerInterest", query: { "user._id": user.id, isDeleted: false } }
            ]);

            if (results.MissionRequests.error) throw new Error(results.MissionRequests.error);

            const hosp = new Map(results.MissionHospital.data.map(h => [String(h._id), h.missionHospitalName]));
            const spec = new Map(results.MissionSpecializations.data.map(s => [String(s._id), s.name]));
            const interested = new Set(results.ManPowerInterest.data.map(i => String(i.missionRequestId)));

            const rows = results.MissionRequests.data
                .filter(r => (r.selectedLinkedDepartments || []).some(d => d._id === user.departmentId))
                .map(r => ({ ...r, hospitalName: hosp.get(String(r.missionHospitalId)) || "", specializationName: spec.get(String(r.specializationId)) || "" }));

            if (!rows.length) {
                box.innerHTML = String(emptyState("bi-people", "There are no requests for manpower for your department at the moment."));
                return;
            }

            const button = r => interested.has(String(r._id))
                ? html`<span class="badge badge-success"><i class="bi bi-check2"></i> Interest Registered</span>`
                : html`<button type="button" class="btn btn-primary btn-sm" data-interest="${r._id}">Interested? Click here</button>`;

            const table = dataTable(box, {
                columns: [
                    { key: "hospitalName", title: "Mission Hospital" },
                    { key: "specializationName", title: "Specialization" },
                    { key: "fromMsnHospDate", title: "From Date", render: r => formatDate(r.fromMsnHospDate) || "" },
                    { key: "toMsnHospDate", title: "To Date", render: r => formatDate(r.toMsnHospDate) || "" },
                    { key: "interest", title: "Would you like to go?", sortable: false, render: button }
                ],
                rows,
                searchPlaceholder: "Search hospital or specialization",
                initialSort: { key: "fromMsnHospDate", dir: "desc" }
            });

            box.addEventListener("click", async event => {

                const btn = event.target.closest("[data-interest]");

                if (!btn) return;

                const row = rows.find(r => String(r._id) === btn.dataset.interest);

                const ok = await Forms.confirm({ title: "Register your interest", message: "Please confirm your interest in visiting this hospital.", confirmLabel: "Confirm" });

                if (!ok) return;

                UI.setLoading(btn, true);

                try {

                    await ConnectAPI.insert("ManPowerInterest", {
                        user: { _id: user.id, name: user.name || "", emailId: user.email || "" },
                        missionRequestId: row._id,
                        missionHospital: { _id: row.missionHospitalId, missionHospitalName: row.hospitalName },
                        specialization: { _id: row.specializationId, name: row.specializationName },
                        fromMsnHospDate: row.fromMsnHospDate ? ConnectAPI.date(row.fromMsnHospDate) : null,
                        toMsnHospDate: row.toMsnHospDate ? ConnectAPI.date(row.toMsnHospDate) : null,
                        status: "Submitted",
                        isDeleted: false,
                        added: { userName: user.name || "", userId: user.id || "", addedDate: ConnectAPI.date(Date.now()) }
                    });

                    interested.add(String(row._id));
                    table.setRows(rows);
                    UI.toast("Thank you for your interest! Our Missions Office will contact you shortly.", { type: "success", timeout: 6000 });

                } catch (error) {
                    UI.toast("Failed to submit your interest. Please try again.", { type: "error", message: error.message });
                    UI.setLoading(btn, false);
                }

            });

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }

    async function loadJourney(box) {

        const PAGE = 9;

        try {

            const notes = await ConnectAPI.rows({ collection: "MsnVisitApp", query: { isDeleted: false, status: "Approved" }, options: { sort: { "added.addedDate": -1 } } });

            if (!notes.length) {
                box.innerHTML = String(emptyState("bi-journal-text", "No notes found."));
                return;
            }

            let shown = 0;

            box.innerHTML = String(html`<div class="journey-grid"></div><div class="load-more"><button type="button" class="btn btn-secondary" data-more>Load More</button></div>`);

            const grid = box.querySelector(".journey-grid");
            const more = box.querySelector("[data-more]");

            const next = () => {
                grid.insertAdjacentHTML("beforeend", notes.slice(shown, shown + PAGE).map(n => String(html`
                    <article class="card journey-card">
                        ${img(pictureOf(n), "Journey", "journey-card-img")}
                        <div class="journey-card-body">
                            <strong>Dr. ${n.name || ""}</strong>
                            <span class="text-muted">${n.missionHospital?.missionHospitalName || ""}</span>
                            <span class="text-subtle">${formatDate(n.fromDate)} - ${formatDate(n.toDate)}</span>
                            ${n.highlightedQuote ? html`<blockquote>${n.highlightedQuote}</blockquote>` : ""}
                            <button type="button" class="btn btn-secondary btn-sm" data-note="${n._id}">Read More</button>
                        </div>
                    </article>`)).join(""));
                shown += PAGE;
                more.parentElement.hidden = shown >= notes.length;
            };

            more.addEventListener("click", next);
            grid.addEventListener("click", event => {
                const btn = event.target.closest("[data-note]");
                if (btn) openReport(notes.find(n => String(n._id) === btn.dataset.note));
            });

            next();

        } catch (error) {
            box.innerHTML = String(errorState(error.message));
        }

    }


    const common = { group: "Mission engagement", when: isFaculty };

    App.register({ ...common, id: "engagement", title: "Mission Engagement", icon: "bi-compass", color: "orange", description: "Programs that connect CMC faculty with mission hospitals.", render: renderOverview });
    App.register({ ...common, id: "mms", title: "Mandatory Mission Service", icon: "bi-hospital", color: "orange", description: "Apply for MMS, update your visit and see past visits.", render: renderMms });
    App.register({ ...common, id: "mission-visits", title: "Mission Visits", icon: "bi-geo", color: "green", description: "Share your visit and register interest in hospital needs.", render: renderMissionVisits });

})();
