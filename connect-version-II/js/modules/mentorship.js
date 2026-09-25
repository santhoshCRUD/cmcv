/**
 * Mission Mentors / Mission Mentees
 *
 * Ports of the git code: renderMentorPage / renderMenteePage (app.js),
 * renderFunctions.cardList + avatarCard / avatarcardClickManager
 * (dynamicRender.js), datatablesMyMeetings, loadMeetingForm,
 * formLoadMeeting and mentorMenteeEditForm (formLoad.js).
 *
 * Collections: MissionsInstructions, MentorRole, MenteeRole,
 * MissionsMentorshipMeetings. Forms: mentorDetails, menteeDetails,
 * mentorshipMeeting.
 *
 * Git bugs fixed: loadMeetingForm read userLogInfo.data._id (always
 * empty) for the modified stamp; processImage called the undefined
 * uploadToS3 (images now go through /api/uploads).
 */
(function () {

    const { html, formatDate, emptyState, errorState, skeletonList, skeletonCards, pageHeader, section, dataTable, openDialog, multiline, initials } = Kit;

    const DEFAULT_AVATAR = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";

    const TYPES = { careerCalling: "Career Calling", spiritual: "Spiritual", others: "Others" };

    const me = () => window.currentUser || {};

    const formatTypes = types => Array.isArray(types) && types.length
        ? types.map(type => TYPES[type] || type.charAt(0).toUpperCase() + type.slice(1)).join(" | ")
        : "updating";

    const byStatus = key => (a, b) => (a[key] === "Current" ? 0 : 1) - (b[key] === "Current" ? 0 : 1);

    const avatar = (src, name) => src
        ? html`<img class="person-avatar" src="${src}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_AVATAR}'">`
        : html`<span class="person-avatar person-avatar-initials">${initials(name)}</span>`;


    // -----------------------------------------------------------------
    // Meetings (datatablesMyMeetings)
    // -----------------------------------------------------------------

    function meetingsTable(container, query, nameKey, nameTitle) {

        let table = null;

        async function load() {

            try {

                const rows = await ConnectAPI.rows({
                    collection: "MissionsMentorshipMeetings",
                    query: { isDeleted: false, ...query },
                    projection: { _id: 1, meetingComment: 1, meetingDateTime: 1, [nameKey]: 1 }
                });

                const name = row => nameKey.split(".").reduce((value, key) => value?.[key], row) || "—";

                const columns = [
                    { key: "name", title: nameTitle, sortValue: name, render: name },
                    { key: "meetingDateTime", title: "Meeting Date", render: r => formatDate(r.meetingDateTime, "datetime") || "—" },
                    { key: "meetingComment", title: "Meeting Comment", sortable: false, render: r => r.meetingComment || "-" },
                    {
                        key: "actions", title: "Actions", sortable: false, className: "cell-actions",
                        render: r => html`<button type="button" class="btn btn-secondary btn-icon btn-sm" data-edit="${r._id}" aria-label="Edit" title="Edit"><i class="bi bi-pencil"></i></button>
                            <button type="button" class="btn btn-danger-soft btn-icon btn-sm" data-delete="${r._id}" aria-label="Delete" title="Delete"><i class="bi bi-trash3"></i></button>`
                    }
                ];

                if (table) table.setRows(rows);
                else table = dataTable(container, { columns, rows, pageSize: 8, searchKeys: [name, "meetingComment"], searchPlaceholder: "Search meetings", emptyText: "No meetings logged yet.", initialSort: { key: "meetingDateTime", dir: "desc" } });

            } catch (error) {
                container.innerHTML = String(errorState(error.message));
            }

        }

        container.innerHTML = String(skeletonList(3));

        container.addEventListener("click", async event => {

            const edit = event.target.closest("[data-edit]");
            const del = event.target.closest("[data-delete]");

            if (edit) {

                const id = edit.dataset.edit;

                Forms.open({
                    title: "Edit Meeting",
                    formKey: "mentorshipMeeting",
                    hide: ["meetingComment1"],
                    successMessage: "Meeting updated",
                    onReady: async form => {
                        const [record] = await ConnectAPI.rows({ collection: "MissionsMentorshipMeetings", query: { _id: id } });
                        if (record) form.submission = { data: record };
                    },
                    onSubmit: async data => {
                        await ConnectAPI.update("MissionsMentorshipMeetings", { _id: id }, {
                            $set: { ...data, isDeleted: false, modified: { userName: me().name || "", userId: me().id || "", modifiedDate: ConnectAPI.date(Date.now()) } }
                        });
                        load();
                    }
                });

            }

            if (del) {

                const ok = await Forms.confirm({ title: "Delete this meeting?", message: "Are you sure you want to delete this record?", confirmLabel: "Delete", danger: true });

                if (!ok) return;

                try {
                    await ConnectAPI.update("MissionsMentorshipMeetings", { _id: del.dataset.delete }, { $set: { isDeleted: true } });
                    UI.toast("Meeting deleted", { type: "success" });
                    load();
                } catch (error) {
                    UI.toast(error.message, { type: "error" });
                }

            }

        });

        load();

        return { reload: load };

    }


    // -----------------------------------------------------------------
    // Person card + details dialog (cardList / avatarCard)
    // -----------------------------------------------------------------

    function personCard(person, { name, line1, line2, line3, types }) {

        const former = person.mentorRoleStatus === "Former" || person.menteeRoleStatus === "Former";

        return html`
            <button type="button" class="card mentor-card ${former ? "is-former" : ""}" data-person="${person._key}">
                ${avatar(person.avatar, name)}
                ${types?.length ? html`<span class="type-dots">${types.map(type => html`<span class="type-dot type-${type}" title="${TYPES[type] || type}"></span>`)}</span>` : ""}
                <strong>${name || "—"}</strong>
                ${line1 ? html`<span class="text-muted">${line1}</span>` : ""}
                ${line2 ? html`<span class="text-subtle">${line2}</span>` : ""}
                ${former ? html`<span class="badge">Former</span>` : ""}
            </button>`;

    }

    const typeLegend = html`
        <div class="type-legend">${Object.entries({ careerCalling: "Career", spiritual: "Spiritual", others: "Others" }).map(([key, label]) => html`
            <span><span class="type-dot type-${key}"></span>${label}</span>`)}</div>`;

    function openPerson(person, { isMentee, onMeeting }) {

        const title = isMentee ? person.menteeUserName : person.mentorUserName;
        const info = isMentee
            ? [person.menteeUserEmail, `${person.course || ""} ${person.batch || ""}`.trim(), person.phoneNumber1 ? `Ph : ${person.phoneNumber1}` : ""]
            : [person.mentorUserEmail, `${person.city || ""} ${person.state || ""}`.trim(), person.pincode ? `Pin : ${person.pincode}` : ""];

        const dialog = openDialog({
            title: title || "Details",
            size: "lg",
            body: html`
                <div class="person-detail">
                    ${avatar(person.avatar, title)}
                    <ul class="person-info">${info.filter(Boolean).map(line => html`<li>${line}</li>`)}</ul>
                </div>
                <nav class="subnav" role="tablist">
                    <button type="button" class="is-active" data-tab="about" role="tab">More Details</button>
                    <button type="button" data-tab="meetings" role="tab">My Meetings</button>
                    ${isMentee ? html`<button type="button" data-tab="log" role="tab">Log a Meeting</button>` : ""}
                </nav>
                <div data-pane="about" class="prose">${person.aboutme ? multiline(person.aboutme) : html`<p class="text-muted">No details shared yet.</p>`}</div>
                <div data-pane="meetings" hidden></div>
                ${isMentee ? html`<div data-pane="log" hidden></div>` : ""}`
        });

        const panes = dialog.body;
        let meetings = null;
        let logMounted = false;

        panes.querySelectorAll("[data-tab]").forEach(tab => tab.addEventListener("click", () => {

            panes.querySelectorAll("[data-tab]").forEach(t => t.classList.toggle("is-active", t === tab));
            panes.querySelectorAll("[data-pane]").forEach(p => { p.hidden = p.dataset.pane !== tab.dataset.tab; });

            if (tab.dataset.tab === "meetings" && !meetings) {
                meetings = meetingsTable(panes.querySelector('[data-pane="meetings"]'), { "mentee.menteeId": person.menteeId, "mentor.mentorId": person.mentorId }, "addedBy", "Added By");
            }

            if (tab.dataset.tab === "log" && !logMounted) {

                logMounted = true;

                // formLoadMeeting
                Forms.render(panes.querySelector('[data-pane="log"]'), {
                    formKey: "mentorshipMeeting",
                    successMessage: "Meeting logged",
                    onSubmit: async data => {

                        await ConnectAPI.insert("MissionsMentorshipMeetings", {
                            ...data,
                            Date: ConnectAPI.date(Date.now()),
                            addedBy: me().name || "",
                            addedById: me().id || "",
                            isDeleted: false,
                            mentor: {
                                mentorId: person.mentorId,
                                mentorUserId: person.mentorUserId,
                                mentorUserName: person.mentorUserName,
                                mentorUserEmail: person.mentorUserEmail || "",
                                organization: person.organization || ""
                            },
                            mentee: {
                                menteeId: person.menteeId,
                                menteeUserId: person.menteeUserId,
                                menteeUserName: person.menteeUserName,
                                course: person.course || "",
                                batch: person.batch || "",
                                menteeUserEmail: person.menteeUserEmail || "",
                                college: person.college || ""
                            }
                        });

                        dialog.close();
                        onMeeting?.();

                    }
                });

            }

        }));

    }


    // -----------------------------------------------------------------
    // Profile edit (mentorMenteeEditForm)
    // -----------------------------------------------------------------

    function editProfile(kind, id, onSaved) {

        const isMentee = kind === "mentee";
        const collection = isMentee ? "MenteeRole" : "MentorRole";
        let record = {};

        Forms.open({
            title: `${isMentee ? "Mentee" : "Mentor"} details`,
            formKey: isMentee ? "menteeDetails" : "mentorDetails",
            hide: ["mentorUserId", "menteeUserId"],
            successMessage: "Profile updated",
            onReady: async form => {

                const lock = key => { const comp = form.getComponent(key); if (comp) { comp.component.disabled = true; comp.redraw(); } };

                ["typeOfMentorship", "spiritualMentees", "careerCallingMentees", "othersMentees"].forEach(lock);

                [record = {}] = await ConnectAPI.rows({ collection, query: { isDeleted: false, _id: id } });

                const data = structuredClone(record);

                if (isMentee) {

                    // Mentor choices per type (only current mentors), stored as ids in the form.
                    for (const type of ["spiritual", "careerCalling", "others"]) {

                        const list = await ConnectAPI.rows({
                            collection: "MentorRole",
                            query: { typeOfMentorship: { $in: [type] }, mentorRoleStatus: "Current" },
                            projection: { _id: 1, mentorUserName: 1, mentorUserEmail: 1, mentorRoleStatus: 1, typeOfMentorship: 1 }
                        });

                        const comp = form.getComponent(`${type}Mentors`);

                        if (comp) {
                            comp.component.data = { ...(comp.component.data || {}), values: list };
                            comp.component.valueProperty = "_id";
                        }

                        if (Array.isArray(data[`${type}Mentors`])) {
                            data[`${type}Mentors`] = data[`${type}Mentors`].map(m => m && typeof m === "object" ? m._id : m);
                        }

                    }

                }

                form.submission = { data };

            },
            onSubmit: async submitted => {

                const data = await Forms.uploadFiles(submitted, collection);
                const imageKey = isMentee ? "uploadStudentImage" : "uploadFacultyImage";

                // processImage stored a thumbnail next to the image; the uploaded URL serves both.
                if (Array.isArray(data[imageKey])) {
                    data[imageKey] = data[imageKey].map(image => ({ ...image, thumbnailurl: image.thumbnailurl || image.url }));
                }

                const finalData = {
                    ...record,
                    ...data,
                    modifiedDate: ConnectAPI.date(Date.now()),
                    modifiedBy: me().name || "",
                    modifiedById: me().id || ""
                };

                delete finalData._id;

                if (isMentee) {

                    for (const type of ["spiritual", "careerCalling", "others"]) {

                        const ids = (data[`${type}Mentors`] || []).map(m => m && typeof m === "object" ? m._id : m);

                        finalData[`${type}Mentors`] = ids.length
                            ? await ConnectAPI.rows({ collection: "MentorRole", query: { _id: { $in: ids } }, projection: { _id: 1, mentorUserName: 1, typeOfMentorship: 1 } })
                            : [];

                    }

                }

                await ConnectAPI.update(collection, { _id: id }, { $set: finalData });

                onSaved?.();

            }
        });

    }


    // -----------------------------------------------------------------
    // Pages
    // -----------------------------------------------------------------

    function profileHeader({ avatarUrl, name, subtitle, kind, id }) {

        return html`
            <section class="card profile-banner">
                ${avatar(avatarUrl, name)}
                <div class="profile-banner-text">
                    <h2>${name}</h2>
                    <span class="text-muted">${subtitle}</span>
                </div>
                ${id ? html`<button type="button" class="btn btn-secondary btn-sm" data-edit-profile="${kind}" data-id="${id}"><i class="bi bi-pencil"></i> Edit profile</button>` : ""}
            </section>`;

    }

    async function renderMentor(view) {

        view.innerHTML = String(html`${pageHeader({ title: "Mission mentors", icon: "bi-person-video3", color: "purple" })}${skeletonCards(3)}`);

        const email = me().email;

        const results = await ConnectAPI.fetchMany([
            { collection: "MissionsInstructions", query: { status: "Active" }, projection: { instructionsForMentor: 1 } },
            { collection: "MentorRole", query: { mentorUserEmail: email, mentorRoleStatus: "Current" }, projection: { _id: 1, city: 1, mentorRoleStatus: 1, mentorUserEmail: 1, mentorUserId: 1, mentorUserName: 1, pincode: 1, state: 1, typeOfMentorship: 1, uploadFacultyImage: 1 } }
        ]);

        const mentor = results.MentorRole.data?.[0];

        if (!mentor) {
            view.innerHTML = String(html`${pageHeader({ title: "Mission mentors", icon: "bi-person-video3", color: "purple" })}${results.MentorRole.error ? errorState(results.MentorRole.error) : emptyState("bi-person-video3", "No current mentor role found", "Your mentor profile is not active. Contact the Missions office.")}`);
            return;
        }

        const types = mentor.typeOfMentorship || [];

        const mentees = types.length ? (await ConnectAPI.rows({
            collection: "MenteeRole",
            query: { isDeleted: false, menteeRoleStatus: "Current", $or: types.map(type => ({ [`${type}Mentors.mentorUserName`]: mentor.mentorUserName })) },
            projection: { _id: 1, menteeRoleStatus: 1, menteeUserName: 1, menteeUserId: 1, menteeUserEmail: 1, aboutme: 1, avatar: 1, batch: 1, course: 1, college: 1, phoneNumber1: 1 }
        }).catch(() => [])) : [];

        const people = mentees.sort(byStatus("menteeRoleStatus")).map((mentee, i) => ({
            ...mentor,
            ...mentee,
            _key: String(i),
            menteeId: mentee._id,
            mentorId: mentor._id,
            avatar: mentee.avatar
        }));

        view.innerHTML = String(html`
            ${pageHeader({ title: "Mission mentors", icon: "bi-person-video3", color: "purple" })}
            ${profileHeader({ avatarUrl: mentor.uploadFacultyImage?.[0]?.thumbnailurl, name: mentor.mentorUserName || "updating", subtitle: formatTypes(types), kind: "mentor", id: mentor._id })}
            ${section("Instructions", html`<div class="prose">${multiline(results.MissionsInstructions.data?.[0]?.instructionsForMentor || "No instructions available")}</div>`)}
            ${section("My mentees", people.length
                ? html`<div class="mentor-grid">${people.map(p => personCard(p, { name: p.menteeUserName, line1: p.college, line2: `${p.course || ""} ${p.batch || ""}`.trim() }))}</div>`
                : emptyState("bi-people", "No current mentees", "Mentees allotted to you will appear here."))}
            ${section("All meetings", html`<div id="allMeetings"></div>`)}`);

        const all = meetingsTable(view.querySelector("#allMeetings"), { "mentor.mentorId": mentor._id }, "mentee.menteeUserName", "Meet");

        view.addEventListener("click", event => {

            const card = event.target.closest("[data-person]");

            if (card) {
                openPerson(people[Number(card.dataset.person)], { isMentee: true, onMeeting: all.reload });
                return;
            }

            const edit = event.target.closest("[data-edit-profile]");

            if (edit) editProfile("mentor", edit.dataset.id, () => renderMentor(view));

        });

    }

    async function renderMentee(view) {

        view.innerHTML = String(html`${pageHeader({ title: "Mission mentees", icon: "bi-person-heart", color: "pink" })}${skeletonCards(3)}`);

        const results = await ConnectAPI.fetchMany([
            { collection: "MissionsInstructions", query: { status: "Active" }, projection: { instructionsForMentees: 1 } },
            {
                collection: "MenteeRole",
                query: { isDeleted: false, menteeUserEmail: me().email },
                projection: {
                    _id: 1, menteeRoleStatus: 1, menteeUserName: 1, menteeUserId: 1, menteeUserEmail: 1, course: 1, batch: 1, college: 1, aboutme: 1, uploadStudentImage: 1,
                    "careerCallingMentors._id": 1, "careerCallingMentors.mentorUserName": 1,
                    "othersMentors._id": 1, "othersMentors.mentorUserName": 1,
                    "spiritualMentors._id": 1, "spiritualMentors.mentorUserName": 1
                }
            }
        ]);

        const mentee = results.MenteeRole.data?.[0];

        if (!mentee) {
            view.innerHTML = String(html`${pageHeader({ title: "Mission mentees", icon: "bi-person-heart", color: "pink" })}${results.MenteeRole.error ? errorState(results.MenteeRole.error) : emptyState("bi-person-heart", "No mentee profile found", "Contact the Missions office to be added to the mentorship programme.")}`);
            return;
        }

        // processMentors: one entry per mentor, with every type they mentor you in
        const map = new Map();

        [["careerCalling", mentee.careerCallingMentors], ["others", mentee.othersMentors], ["spiritual", mentee.spiritualMentors]].forEach(([type, list]) => {
            (list || []).forEach(m => {
                if (map.has(m._id)) map.get(m._id).types.push(type);
                else map.set(m._id, { ...m, types: [type] });
            });
        });

        const assigned = [...map.values()];

        const details = assigned.length ? await ConnectAPI.rows({
            collection: "MentorRole",
            query: { isDeleted: false, _id: { $in: assigned.map(m => m._id) } },
            projection: { mentorUserId: 1, city: 1, mentorUserEmail: 1, avatar: 1, mentorUserName: 1, pincode: 1, state: 1, mentorRoleStatus: 1, aboutme: 1 }
        }).catch(() => []) : [];

        const people = assigned.map((m, i) => ({
            ...m,
            ...(details.find(d => d.mentorUserName === m.mentorUserName) || {}),
            _key: String(i),
            mentorId: m._id,
            menteeId: mentee._id,
            menteeUserId: mentee.menteeUserId,
            menteeUserName: mentee.menteeUserName,
            course: mentee.course,
            batch: mentee.batch,
            menteeUserEmail: mentee.menteeUserEmail,
            college: mentee.college
        })).sort(byStatus("mentorRoleStatus"));

        view.innerHTML = String(html`
            ${pageHeader({ title: "Mission mentees", icon: "bi-person-heart", color: "pink" })}
            ${profileHeader({ avatarUrl: mentee.uploadStudentImage?.[0]?.thumbnailurl, name: mentee.menteeUserName || "updating", subtitle: mentee.course || "updating", kind: "mentee", id: mentee._id })}
            ${section("Instructions", html`<div class="prose">${multiline(results.MissionsInstructions.data?.[0]?.instructionsForMentees || "No instructions available")}</div>`)}
            ${section("My mentors", people.length
                ? html`${typeLegend}<div class="mentor-grid">${people.map(p => personCard(p, { name: p.mentorUserName, line1: p.mentorUserEmail, line2: p.state, types: p.types }))}</div>`
                : emptyState("bi-people", "No mentors assigned yet", "Your mentors will appear here once the Missions office allots them."))}
            ${section("All meetings", html`<div id="allMeetings"></div>`)}`);

        meetingsTable(view.querySelector("#allMeetings"), { "mentee.menteeId": mentee._id }, "mentor.mentorUserName", "Meet");

        view.addEventListener("click", event => {

            const card = event.target.closest("[data-person]");

            if (card) {
                openPerson(people[Number(card.dataset.person)], { isMentee: false });
                return;
            }

            const edit = event.target.closest("[data-edit-profile]");

            if (edit) editProfile("mentee", edit.dataset.id, () => renderMentee(view));

        });

    }


    App.register({ id: "mentors", title: "Mission Mentors", icon: "bi-person-video3", color: "purple", group: "Missions", roles: ["Missions Mentor"], description: "Your mentees, meetings and mentor profile.", render: renderMentor });
    App.register({ id: "mentees", title: "Mission Mentees", icon: "bi-person-heart", color: "pink", group: "Missions", roles: ["Missions Mentee"], description: "Your mentors, meetings and mentee profile.", render: renderMentee });

})();
