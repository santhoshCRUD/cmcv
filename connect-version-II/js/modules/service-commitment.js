/**
 * Service Commitment (students)
 *
 * Port of loadServiceCommitPage / loadSponsoringBodyCard /
 * initFeedbackForm (git app.js) and views/serviceCommitment.html.
 *
 * The student record comes from "students" by the signed-in user's
 * admissionNo (the server only ever returns the caller's own record).
 * Journey feedback is pushed to missionHospital.studentFeedback, as in
 * the git code.
 */
(function () {

    const { html, img, formatDate, emptyState, errorState, skeletonCards, pageHeader, section, multiline, initials } = Kit;

    const me = () => window.currentUser || {};

    const date = value => formatDate(value, "medium") || "—";

    async function render(view) {

        view.innerHTML = String(html`${pageHeader({ title: "Service Commitment", icon: "bi-signpost-2", color: "teal" })}${skeletonCards(2)}`);

        let student;

        try {
            [student] = await ConnectAPI.rows({ collection: "students", query: { admissionNo: me().admissionNo || "" } }, "fetchCollectionDataFromDB");
        } catch (error) {
            view.innerHTML = String(html`${pageHeader({ title: "Service Commitment", icon: "bi-signpost-2", color: "teal" })}${errorState(error.message)}`);
            return;
        }

        if (!student || !student.sponsoringBody?._id) {
            view.innerHTML = String(html`${pageHeader({ title: "Service Commitment", icon: "bi-signpost-2", color: "teal" })}${emptyState("bi-signpost-2", "No sponsoring details found.", "Your service commitment details will appear here once the college records your sponsorship.")}`);
            return;
        }

        const visited = student.listOfHsptlVisited || [];
        const allotted = visited[visited.length - 1]?.hsptlPosted?.missionHospitalName || "Hospital not allotted yet";
        const name = `${student.firstName || ""} ${student.lastName || ""}`.trim();

        view.innerHTML = String(html`
            ${pageHeader({ title: "Service Commitment", icon: "bi-signpost-2", color: "teal" })}
            <section class="card profile-banner">
                <span class="person-avatar person-avatar-initials">${initials(name)}</span>
                <div class="profile-banner-text">
                    <h2>${name}</h2>
                    <span class="text-muted">${student.course_name || ""} - Batch of ${student.batch || ""}</span>
                    <ul class="meta-list">
                        <li><i class="bi bi-person-vcard"></i> Admission No: ${student.admissionNo || "—"}</li>
                        ${student.phoneNumber1 ? html`<li><i class="bi bi-telephone"></i> ${student.phoneNumber1}</li>` : ""}
                        ${student.email ? html`<li><i class="bi bi-envelope"></i> ${student.email}</li>` : ""}
                        ${student.address1 ? html`<li><i class="bi bi-geo-alt"></i> ${student.address1}</li>` : ""}
                        ${student.dob ? html`<li><i class="bi bi-calendar"></i> Date of Birth: ${date(student.dob)}</li>` : ""}
                    </ul>
                </div>
            </section>
            ${student.aboutme ? section("A Bit About Me", html`<div class="prose">${multiline(student.aboutme)}</div>`) : ""}
            <div class="two-col">
                ${section("Course Details", html`
                    <dl class="detail-grid">
                        <div class="detail-grid-item"><dt>Quota Name</dt><dd>${student.quotaName?.quotaName || "—"}</dd></div>
                        <div class="detail-grid-item"><dt>Quota Category</dt><dd>${student.quotaCategory?.quotaCategory || "—"}</dd></div>
                        <div class="detail-grid-item"><dt>Course joining date</dt><dd>${date(student.doj)}</dd></div>
                        <div class="detail-grid-item"><dt>Expected date of completion</dt><dd>${date(student.expectedDateOfCompletion)}</dd></div>
                    </dl>`)}
                ${section("Sponsorship Details", html`
                    <dl class="detail-grid">
                        <div class="detail-grid-item"><dt>Number of years of service</dt><dd>${student.serviceDuration || "—"}</dd></div>
                        <div class="detail-grid-item"><dt>Sponsoring Body name</dt><dd>${student.sponsoringBody?.sponsoringBodyName || "—"}</dd></div>
                        <div class="detail-grid-item detail-grid-wide"><dt>Allotted Hospital</dt><dd>${allotted}</dd></div>
                    </dl>`)}
            </div>
            ${section(`Hospital Associated with the ${student.sponsoringBody?.sponsoringBodyName || "sponsoring body"}`, html`<div id="sponsorHospitals">${skeletonCards(3)}</div>`)}
            ${section("Share your journey", html`
                <p class="text-muted">Please share your journey with us. It would be very helpful for others wanting to go in the same direction to read about your experiences.</p>
                ${visited.length ? html`
                    <form id="journeyForm" class="stack-form" novalidate>
                        <label class="field">
                            <span class="field-label">Hospital</span>
                            <select class="input" name="hospital" required>
                                <option value="">Select Hospital</option>
                                ${visited.filter(v => v?.hsptlPosted?._id).map(v => html`<option value="${v.hsptlPosted._id}">${v.hsptlPosted.missionHospitalName}</option>`)}
                            </select>
                            <span class="field-error" data-error="hospital" aria-live="polite"></span>
                        </label>
                        <label class="field">
                            <span class="field-label">Your experience</span>
                            <textarea class="input textarea" name="feedback" rows="6" maxlength="5000" required></textarea>
                            <span class="field-error" data-error="feedback" aria-live="polite"></span>
                        </label>
                        <div><button type="submit" class="btn btn-primary"><i class="bi bi-send"></i> Click here to share</button></div>
                    </form>` : emptyState("bi-hospital", "No hospital postings yet", "You can share your journey once you have been posted to a hospital.")}`)}`);

        loadSponsorHospitals(view.querySelector("#sponsorHospitals"), student.sponsoringBody._id, visited.map(v => v?.hsptlPosted?._id).filter(Boolean));

        const form = view.querySelector("#journeyForm");

        if (form) bindJourney(form, student);

    }

    async function loadSponsorHospitals(container, sponsorId, allottedIds) {

        try {

            const hospitals = await ConnectAPI.rows({ collection: "MissionHospital", query: { sponsoringBodyId: sponsorId } });

            container.innerHTML = hospitals.length
                ? String(html`<div class="media-grid">${hospitals.map(h => {
                    const assigned = allottedIds.includes(h._id);
                    return html`
                        <a class="card media-card ${assigned ? "is-highlighted" : ""}" href="#/hospitals/${encodeURIComponent(h._id)}">
                            ${img(h.hospitalImages?.[0]?.url, h.missionHospitalName, "media-card-img")}
                            <div class="media-card-body">
                                ${assigned ? html`<span class="badge badge-accent">Assigned</span>` : ""}
                                <strong>${h.missionHospitalName}</strong>
                                <span class="text-muted">${h.hospitalState || ""}</span>
                            </div>
                        </a>`;
                })}</div>`)
                : String(emptyState("bi-hospital", "No hospitals listed for this sponsoring body"));

        } catch (error) {
            container.innerHTML = String(errorState(error.message));
        }

    }

    function bindJourney(form, student) {

        const button = form.querySelector('button[type="submit"]');

        const setError = (name, message) => {
            form.querySelector(`[data-error="${name}"]`).textContent = message;
            form.elements[name].classList.toggle("is-invalid", Boolean(message));
        };

        form.addEventListener("input", event => setError(event.target.name, ""));

        form.addEventListener("submit", async event => {

            event.preventDefault();

            const hospital = form.elements.hospital.value;
            const feedback = form.elements.feedback.value.trim();

            setError("hospital", hospital ? "" : "Please select a hospital.");
            setError("feedback", feedback ? "" : "Please write about your experience.");

            if (!hospital || !feedback) return;

            UI.setLoading(button, true);

            try {

                await ConnectAPI.update("missionHospital", { _id: hospital }, {
                    $push: {
                        studentFeedback: {
                            studentName: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
                            admissionNo: student.admissionNo,
                            feedback,
                            feedbackDate: ConnectAPI.date(Date.now())
                        }
                    }
                }, true);

                UI.toast("Thank you! Your feedback has been shared successfully.", { type: "success" });
                form.reset();

            } catch (error) {
                UI.toast("Error saving feedback. Please try again.", { type: "error", message: error.message });
            } finally {
                UI.setLoading(button, false);
            }

        });

    }

    App.register({
        id: "service-commitment",
        title: "Service Commitment",
        icon: "bi-signpost-2",
        color: "teal",
        group: "Missions",
        // git: shown when profile.userType includes "student"
        when: user => String(user.userType || "").toLowerCase().includes("student"),
        description: "Your sponsorship, allotted hospital and journey.",
        render
    });

})();
