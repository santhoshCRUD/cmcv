/**
 * Learning Resources, Clinical Snippets and Council.
 *
 * Learning Resources - renderLoadResources / detailResources / resourceFetch
 *   (app.js): MissionsStream -> LearningResources for a stream
 *   (stream: { $elemMatch: { _id } }), newest first, 40 then "load more";
 *   keyword search (>= 3 chars) on title / metaTags.
 * Clinical Snippets  - loadClinicalSnip / checkAnswer (dynamicRender.js):
 *   ClinicalSnip quiz cards, 5 at a time, answer marked by option.answer === "yes".
 * Council            - renderCouncilPage (app.js): only for "Council Member".
 */
(function () {

    const { html, raw, img, fileUrl, safeUrl, multiline, emptyState, errorState, skeletonCards, skeletonList, pageHeader, section, openDialog, openVideo } = Kit;


    // -----------------------------------------------------------------
    // Learning Resources
    // -----------------------------------------------------------------

    const RESOURCE_PROJECTION = { Date: 1, stream: 1, resourceLink: 1, resourcePerson: 1, type: 1, typeId: 1, subType: 1, metaTags: 1, title: 1 };
    const FIRST_PAGE = 40;
    const NEXT_PAGE = 20;

    const STREAM_ICONS = ["bi-heart-pulse", "bi-capsule", "bi-lungs", "bi-bandaid", "bi-eye", "bi-activity", "bi-droplet", "bi-clipboard2-pulse"];

    function resourceFetch(streamId, limit, skip = 0, searchKey) {

        const query = { isDeleted: false };

        if (streamId) {
            query.stream = { $elemMatch: { _id: streamId } };
        }

        if (searchKey) {

            const escaped = searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.$or = [
                { title: { $regex: escaped, $options: "i" } },
                { metaTags: { $regex: escaped, $options: "i" } }
            ];

        }

        return ConnectAPI.rows({
            collection: "LearningResources",
            query,
            projection: RESOURCE_PROJECTION,
            options: { limit, skip, sort: { Date: -1 } }
        });

    }

    const resourceGrid = list => html`<div class="resource-grid">${list.map(GrandRoundsViews.videoCard)}</div>`;

    function bindResources(root, getList) {

        root.addEventListener("click", event => {

            const button = event.target.closest("[data-video]");

            if (!button) return;

            const item = getList().find(r => String(r._id) === button.dataset.video);

            if (item) openVideo(item.title || "Learning resource", item.resourceLink || item.url);

        });

    }

    function searchBox(id, placeholder) {

        return html`
            <div class="toolbar">
                <div class="input-group toolbar-search-wide">
                    <i class="bi bi-search"></i>
                    <input type="search" class="input" id="${id}" placeholder="${placeholder}" aria-label="${placeholder}">
                </div>
            </div>`;

    }

    // Shared search behaviour: >= 3 characters swaps the main content for results.
    function wireSearch(view, input, main, results, streamId, state) {

        let timer;

        input.addEventListener("input", () => {

            clearTimeout(timer);

            const keyword = input.value.trim().toLowerCase();

            timer = setTimeout(async () => {

                if (keyword.length < 3) {
                    results.hidden = true;
                    main.hidden = false;
                    return;
                }

                main.hidden = true;
                results.hidden = false;
                results.innerHTML = String(skeletonCards(3, "resource-grid"));

                try {

                    state.search = await resourceFetch(streamId, 0, 0, keyword);

                    results.innerHTML = state.search.length
                        ? String(html`<p class="text-muted">${state.search.length} result${state.search.length === 1 ? "" : "s"} for “${keyword}”</p>${resourceGrid(state.search)}`)
                        : String(emptyState("bi-search", "No resources match your search"));

                } catch (error) {
                    results.innerHTML = String(errorState(error.message));
                }

            }, 300);

        });

        bindResources(results, () => state.search || []);

    }

    async function renderStreams(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Learning", title: "Learning Resources", icon: "bi-book", color: "orange", description: "Talks, lectures and teaching material organised by stream." })}
            ${searchBox("resourceSearch", "Search all resources (3+ characters)…")}
            <div id="searchResults" hidden></div>
            <div id="streams">${skeletonCards(8, "stream-grid")}</div>`);

        const state = {};

        wireSearch(view, view.querySelector("#resourceSearch"), view.querySelector("#streams"), view.querySelector("#searchResults"), null, state);

        let streams;

        try {
            streams = await ConnectAPI.rows({ collection: "MissionsStream", query: { isDeleted: "false" }, projection: { _id: 1, code: 1, name: 1 } });
        } catch (error) {
            view.querySelector("#streams").innerHTML = String(errorState(error.message));
            return;
        }

        view.querySelector("#streams").innerHTML = streams.length
            ? String(html`<div class="stream-grid">${streams.map((s, i) => html`
                <a class="card stream-card" href="#/learning-resources/${encodeURIComponent(s._id)}">
                    <span class="stream-icon"><i class="bi ${STREAM_ICONS[i % STREAM_ICONS.length]}"></i></span>
                    <strong>${s.name}</strong>
                    ${s.code ? html`<span class="badge">${s.code}</span>` : ""}
                </a>`)}</div>`)
            : String(emptyState("bi-collection", "No streams yet"));

    }

    async function renderStream(view, streamId) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Learning Resources", title: "Loading stream…", icon: "bi-book", color: "orange", back: { href: "#/learning-resources", label: "All streams" } })}
            ${searchBox("streamSearch", "Search this stream (3+ characters)…")}
            <div id="searchResults" hidden></div>
            <div id="streamMain">${skeletonCards(6, "resource-grid")}</div>
            <div class="load-more"><button type="button" class="btn btn-secondary hidden" id="moreResources">Load more</button></div>`);

        const state = {};

        const [streamRows, first] = await Promise.all([
            ConnectAPI.rows({ collection: "MissionsStream", query: { _id: streamId }, projection: { _id: 1, code: 1, name: 1 } }).catch(() => []),
            resourceFetch(streamId, FIRST_PAGE, 0).catch(error => error)
        ]);

        view.querySelector(".page-header h1").textContent = streamRows[0]?.name || "Stream";

        const main = view.querySelector("#streamMain");
        const more = view.querySelector("#moreResources");

        if (first instanceof Error) {
            main.innerHTML = String(errorState(first.message));
            return;
        }

        let items = first;

        const draw = () => {
            main.innerHTML = items.length ? String(resourceGrid(items)) : String(emptyState("bi-collection", "No resources in this stream yet"));
        };

        draw();
        bindResources(main, () => items);

        more.classList.toggle("hidden", items.length < FIRST_PAGE);

        more.addEventListener("click", async () => {

            UI.setLoading(more, true);

            try {
                const next = await resourceFetch(streamId, NEXT_PAGE, items.length);
                items = items.concat(next);
                draw();
                more.classList.toggle("hidden", next.length < NEXT_PAGE);
            } catch (error) {
                UI.toast("Couldn't load more resources", { type: "error", message: error.message });
            } finally {
                UI.setLoading(more, false);
            }

        });

        wireSearch(view, view.querySelector("#streamSearch"), main, view.querySelector("#searchResults"), streamId, state);

    }


    // -----------------------------------------------------------------
    // Clinical Snippets
    // -----------------------------------------------------------------

    const SNIP_BATCH = 5;
    const SNIP_CACHE = "clinicalSnips";

    function snipCard(item) {

        const image = fileUrl(item.uploadImage);

        return html`
            <article class="card quiz-card" data-snip="${item._id}">
                <header>
                    <span class="badge badge-accent">${item.topics || "General"}</span>
                    <h3>${item.question}</h3>
                </header>
                ${image ? html`<button type="button" class="quiz-image" data-zoom="${image}">${img(image, item.title || "Clinical image")}</button>` : ""}
                <div class="quiz-options" role="group" aria-label="Answer options">
                    ${(item.options || []).map((opt, i) => html`
                        <button type="button" class="quiz-option" data-option="${i}">
                            <span class="quiz-letter">${String.fromCharCode(65 + i)}</span>
                            <span class="quiz-text">${opt.option}</span>
                            <i class="bi quiz-status" aria-hidden="true"></i>
                        </button>`)}
                </div>
                <div class="quiz-explain" hidden>
                    <strong class="quiz-verdict"></strong>
                    <p></p>
                </div>
            </article>`;

    }

    async function renderClinical(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Learning", title: "Clinical Snippets", icon: "bi-patch-question", color: "green", description: "Take a quiz! Pick an answer to see whether you're right and read the explanation." })}
            <div id="snips" class="quiz-list">${skeletonCards(2, "quiz-list")}</div>
            <div class="load-more"><button type="button" class="btn btn-secondary hidden" id="moreSnips">Load more</button></div>`);

        let list = null;

        try {
            const cached = sessionStorage.getItem(SNIP_CACHE);
            if (cached) list = JSON.parse(cached);
        } catch (error) { list = null; }

        if (!list) {

            try {
                list = await ConnectAPI.rows({ collection: "ClinicalSnip", query: { isDeleted: false }, options: { sort: { "added.addedDate": -1 } } });
                try { sessionStorage.setItem(SNIP_CACHE, JSON.stringify(list)); } catch (error) { /* storage full */ }
            } catch (error) {
                view.querySelector("#snips").innerHTML = String(errorState(error.message));
                return;
            }

        }

        const container = view.querySelector("#snips");
        const more = view.querySelector("#moreSnips");
        let shown = 0;

        container.innerHTML = list.length ? "" : String(emptyState("bi-patch-question", "No clinical snippets yet"));

        const next = () => {
            container.insertAdjacentHTML("beforeend", list.slice(shown, shown + SNIP_BATCH).map(item => String(snipCard(item))).join(""));
            shown += SNIP_BATCH;
            more.classList.toggle("hidden", shown >= list.length);
        };

        if (list.length) next();

        more.addEventListener("click", next);

        // checkAnswer(): mark the chosen option, show its explanation.
        container.addEventListener("click", event => {

            const zoom = event.target.closest("[data-zoom]");

            if (zoom) {
                openDialog({ title: "Clinical image", size: "lg", body: html`<img src="${zoom.dataset.zoom}" alt="" class="detail-hero">` });
                return;
            }

            const button = event.target.closest("[data-option]");

            if (!button) return;

            const card = button.closest("[data-snip]");
            const item = list.find(s => String(s._id) === card.dataset.snip);
            const option = item.options[Number(button.dataset.option)];
            const correct = option.answer === "yes";

            card.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("is-correct", "is-wrong"));
            button.classList.add(correct ? "is-correct" : "is-wrong");
            button.querySelector(".quiz-status").className = `bi quiz-status ${correct ? "bi-check-circle-fill" : "bi-x-circle-fill"}`;

            const explain = card.querySelector(".quiz-explain");

            explain.hidden = false;
            explain.classList.toggle("is-correct", correct);
            explain.querySelector(".quiz-verdict").textContent = correct ? "Correct!" : "Not quite.";
            explain.querySelector("p").innerHTML = String(multiline(option.explanation || ""));

        });

    }


    // -----------------------------------------------------------------
    // Council (renderCouncilPage)
    // -----------------------------------------------------------------

    const COUNCIL_DOCS_URL = "https://cmcv.sharepoint.com/sites/TheCMCVelloreAssociation";
    const CONSULTATION_URL = "https://cmcv.sharepoint.com/sites/CMCConsultations";

    async function renderCouncil(view, params, { user }) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Confidential", title: "Council", icon: "bi-people", color: "purple" })}
            ${skeletonCards(4, "person-grid")}`);

        const first = await ConnectAPI.fetchMany([
            { collection: "CardBuilder", query: { cardName: "Council Documents" } },
            { collection: "CouncilMembers", query: { "councilMemberUserInfo.councilMemberUserId": user.id, isDeleted: "false" }, projection: { _id: 1, salutation: 1, councilMemberDesignation: 1, councilMemberUserInfo: 1, councilMemberOrganization: 1 } }
        ]);

        const me = first.CouncilMembers.data?.[0];
        const orgId = me?.councilMemberOrganization?.councilMemberOrganizationId;

        let head = null, hospitals = [], members = [];

        if (orgId) {

            const org = await ConnectAPI.fetchMany([
                { collection: "HeadOfOrganization", query: { councilMemberOrganizationId: orgId, isDeleted: "false", headOfOrganizationStatus: "Current" } },
                { collection: "MissionHospital", query: { councilMemberOrganizationId: orgId, isDeleted: "false" }, projection: { _id: 1, missionHospitalName: 1 } },
                { collection: "CouncilMembers", query: { "councilMemberOrganization.councilMemberOrganizationId": orgId, isDeleted: "false" }, projection: { _id: 1, councilMemberUserInfo: 1, councilMemberDesignation: 1, councilMemberImage: 1, salutation: 1, councilMemberCategory: 1 } }
            ]);

            head = org.HeadOfOrganization.data?.[0] || null;
            hospitals = org.MissionHospital.data || [];
            members = org.CouncilMembers.data || [];

        }

        const headAvatar = head ? `https://s3.amazonaws.com/img.studenthub.in/sbHeadofOrganizationUser/${head._id}_user.png` : "";

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Confidential", title: "Council", icon: "bi-people", color: "purple", description: "Welcome to the Council Member's Section of CMC V Connect. This section is accessible only to Council members of the CMC Vellore Association." })}
            <div class="notice card">
                <i class="bi bi-info-circle"></i>
                <div>Data on this page is from the records in the Council Office. If there are any discrepancies, please contact
                    <a href="mailto:councilsecretary@cmcvellore.ac.in">councilsecretary@cmcvellore.ac.in</a>.</div>
            </div>
            ${!me ? emptyState("bi-person-badge", "No council membership found", "We couldn't find a council member record linked to your account.") : html`
            <div class="council-top">
                <div class="card person-card person-card-lg">
                    ${img(headAvatar, head?.headOfOrganizationName || "")}
                    <strong>${head?.headOfOrganizationName || "Head of organization not added"}</strong>
                    <span class="text-muted">Head of Organization</span>
                </div>
                <div class="card org-card">
                    <span class="stat-label">Organization</span>
                    <strong>${head?.councilMemberOrganizationName || me.councilMemberOrganization?.councilMemberOrganizationName || "Organization not added"}</strong>
                    ${hospitals.length ? html`<span class="stat-label">Hospitals</span><ol class="plain-list">${hospitals.map(h => html`<li>${h.missionHospitalName}</li>`)}</ol>` : ""}
                </div>
                <a class="card doc-card" href="${COUNCIL_DOCS_URL}" target="_blank" rel="noopener">
                    <i class="bi bi-folder2-open"></i>
                    <strong>${first.CardBuilder.data?.[0]?.cardName || "Council Documents"}</strong>
                    <span class="text-muted">Agenda and minutes of the Council meetings</span>
                </a>
                <a class="card doc-card" href="${CONSULTATION_URL}" target="_blank" rel="noopener">
                    <i class="bi bi-chat-square-text"></i>
                    <strong>Consultation 2025</strong>
                    <span class="text-muted">Open on SharePoint</span>
                </a>
            </div>
            ${section("Organization members", members.length
                ? html`<div class="person-grid">${members.map(m => html`
                    <div class="card person-card">
                        ${img(m.councilMemberImage, "")}
                        <strong>${[m.salutation, m.councilMemberUserInfo?.councilMemberUserName].filter(Boolean).join(" ")}</strong>
                        <span class="text-muted">${m.councilMemberCategory?.councilMemberCategoryName || ""}</span>
                        <span class="badge">${m.councilMemberDesignation || ""}</span>
                    </div>`)}</div>`
                : emptyState("bi-people", "No members listed"))}`}`);

    }


    App.register({
        id: "learning-resources",
        title: "Learning Resources",
        icon: "bi-book",
        color: "orange",
        group: "Learning",
        audiences: ["missions", "student"],
        description: "Talks and teaching material by stream, with search.",
        render(view, params) {
            return params[0] ? renderStream(view, params[0]) : renderStreams(view);
        }
    });

    App.register({
        id: "clinical-snippets",
        title: "Clinical Snippets",
        icon: "bi-patch-question",
        color: "green",
        group: "Learning",
        audiences: ["missions", "student"],
        description: "Take a quiz! Case-based questions with explanations.",
        render: renderClinical
    });

    App.register({
        id: "council",
        title: "Council",
        icon: "bi-people",
        color: "purple",
        group: "Missions",
        roles: ["Council Member"],
        description: "Confidential section for Council members of the CMC Vellore Association.",
        render: renderCouncil
    });

})();
