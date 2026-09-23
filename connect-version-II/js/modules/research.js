/**
 * Research
 *
 * Port of views/research.html + loadResearchCards, the Grants page
 * (loadGrantsAwardee / applyFilters / loadGrantsListTable) and the
 * Publications map (loadPublicationsMap). Queries unchanged.
 *
 * The Research Request form (FormIO "researchRequest" -> ResearchRequest,
 * loadResearchRequest in the git code) opens via HelpForms.researchRequest.
 *
 * Routes: #/research, #/research/grants, #/research/publications
 */
(function () {

    const { html, img, fileUrl, safeUrl, multiline, emptyState, errorState, skeletonCards, skeletonList, pageHeader, section, dataTable, openDialog, renderMap } = Kit;

    const tabs = active => html`
        <nav class="subnav" aria-label="Research sections">
            ${[["", "Overview"], ["grants", "Grants"], ["publications", "Publications"]].map(([id, label]) => html`
                <a href="#/research${id ? `/${id}` : ""}" class="${active === id ? "is-active" : ""}" ${active === id ? Kit.raw('aria-current="page"') : ""}>${label}</a>`)}
            <a href="#/grand-rounds">Grand Rounds <i class="bi bi-arrow-up-right"></i></a>
        </nav>`;

    const header = (active) => html`
        ${pageHeader({
            eyebrow: "“It is He who reveals the profound and hidden things.” — Daniel 2:22",
            title: "Research",
            icon: "bi-clipboard2-pulse",
            color: "blue",
            actions: html`<a class="btn btn-secondary" href="mailto:missions.research@cmcvellore.ac.in"><i class="bi bi-envelope"></i> missions.research@cmcvellore.ac.in</a>`
        })}
        ${tabs(active)}`;


    // -----------------------------------------------------------------
    // Overview
    // -----------------------------------------------------------------

    async function renderOverview(view) {

        view.innerHTML = String(html`
            ${header("")}
            <div class="notice card">
                <i class="bi bi-ui-checks"></i>
                <div><strong>Research Request Form</strong><br><span class="text-muted">Further Queries: Email - missions.research@cmcvellore.ac.in</span></div>
                <button type="button" class="btn btn-primary btn-sm notice-action" id="researchRequestBtn"><i class="bi bi-pencil-square"></i> Click Here</button>
            </div>
            <div class="two-col">
                ${section("Recent interesting publications", html`<div id="publications">${skeletonList(3)}</div>`, { description: "Curated by the Missions Office from around the world" })}
                ${section("Latest public health news", html`<div id="researchNews">${skeletonList(3)}</div>`, { description: "Curated by the Missions Office from around the world" })}
            </div>
            ${section("Research legacies", html`<div id="legacies">${skeletonCards(4, "timeline")}</div>`)}`);

        view.querySelector("#researchRequestBtn").addEventListener("click", () => HelpForms.researchRequest());

        const results = await ConnectAPI.fetchMany([
            { collection: "ResearchNews", query: { isDeleted: false, showOnCarousel: "yes" }, options: { sort: { newsDate: -1 } }, projection: { uploadImage: 1, newsTitle: 1, content: 1, link: 1, newsBody: 1 } },
            { collection: "ResearchPublications", query: { isDeleted: false, showOnCarousel: "yes" }, options: { sort: { date: -1 } }, projection: { uploadImage: 1, title: 1, authors: 1, abstractKeyFindings: 1, link: 1, publishedDate: 1 } },
            { collection: "ResearchLegacies", query: { isDeleted: false, showOnCarousel: "yes" }, options: { sort: { year: 1 } } }
        ]);

        const news = results.ResearchNews.data || [];
        const pubs = results.ResearchPublications.data || [];
        const legacies = results.ResearchLegacies.data || [];

        view.querySelector("#publications").innerHTML = results.ResearchPublications.error
            ? String(errorState(results.ResearchPublications.error))
            : pubs.length
                ? String(html`<div class="stack">${pubs.map(p => html`
                    <article class="pub-card">
                        ${img(fileUrl(p.uploadImage), p.title || "", "pub-img")}
                        <div>
                            <h3>${p.title || "Untitled"}</h3>
                            ${p.authors ? html`<p class="text-muted">${p.authors}</p>` : ""}
                            ${p.publishedDate ? html`<span class="badge">${p.publishedDate}</span>` : ""}
                            ${p.abstractKeyFindings ? html`<details><summary>Key findings</summary><p>${multiline(p.abstractKeyFindings)}</p></details>` : ""}
                            ${safeUrl(p.link) ? html`<a class="btn btn-ghost btn-sm" href="${safeUrl(p.link)}" target="_blank" rel="noopener">Read more <i class="bi bi-box-arrow-up-right"></i></a>` : ""}
                        </div>
                    </article>`)}</div>`)
                : String(emptyState("bi-journal", "No items found."));

        view.querySelector("#researchNews").innerHTML = results.ResearchNews.error
            ? String(errorState(results.ResearchNews.error))
            : news.length
                ? String(html`<div class="stack">${news.map((n, i) => html`
                    <button type="button" class="pub-card pub-card-button" data-rnews="${i}">
                        ${img(fileUrl(n.uploadImage), n.newsTitle || "", "pub-img")}
                        <div>
                            <h3>${n.newsTitle || "Untitled"}</h3>
                            ${n.content ? html`<p class="text-muted">${n.content}</p>` : ""}
                        </div>
                    </button>`)}</div>`)
                : String(emptyState("bi-newspaper", "No items found."));

        view.querySelectorAll("[data-rnews]").forEach(button => button.addEventListener("click", () => {

            const n = news[Number(button.dataset.rnews)];
            const link = safeUrl(n.link);

            openDialog({
                title: "Public health news",
                size: "lg",
                body: html`${img(fileUrl(n.uploadImage), "", "detail-hero")}<h3 class="detail-title">${n.newsTitle}</h3><p>${multiline(n.newsBody)}</p>`,
                footer: link ? html`<a class="btn btn-primary" href="${link}" target="_blank" rel="noopener">Visit site</a>` : ""
            });

        }));

        view.querySelector("#legacies").innerHTML = legacies.length
            ? String(html`<ol class="timeline">${legacies.map((l, i) => html`
                <li><button type="button" class="timeline-item" data-legacy="${i}">
                    <span class="timeline-year">${l.year || ""}</span>
                    ${img(fileUrl(l.uploadIcon), l.title || "", "timeline-img")}
                    <span class="timeline-title">${l.title || ""}</span>
                </button></li>`)}</ol>`)
            : String(emptyState("bi-hourglass", "No legacies yet"));

        view.querySelectorAll("[data-legacy]").forEach(button => button.addEventListener("click", () => {

            const l = legacies[Number(button.dataset.legacy)];
            const pictures = (l.modalPicture || []).map(p => p.data?.url || p.url).filter(Boolean);

            openDialog({
                title: `${l.year || ""} ${l.title || ""}`.trim(),
                size: "lg",
                body: html`
                    ${pictures.length ? html`<div class="gallery">${pictures.map(url => img(url, l.pictureCaption || ""))}</div>` : ""}
                    ${l.pictureCaption ? html`<p class="text-muted"><em>${l.pictureCaption}</em></p>` : ""}
                    <p>${multiline(l.summary)}</p>
                    ${l.listOfPublicationsFurtherReading ? html`<h4 class="detail-subhead">Further reading</h4><p>${multiline(l.listOfPublicationsFurtherReading)}</p>` : ""}`
            });

        }));

    }


    // -----------------------------------------------------------------
    // Grants
    // -----------------------------------------------------------------

    async function renderGrants(view) {

        view.innerHTML = String(html`
            ${header("grants")}
            <div class="two-col two-col-wide-left">
                ${section("Awardees", html`
                    <div class="toolbar">
                        <div class="input-group toolbar-search-wide">
                            <i class="bi bi-search"></i>
                            <input type="search" class="input" id="awardeeSearch" placeholder="Search by name, department, project…" aria-label="Search awardees">
                        </div>
                        <select class="input select" id="awardeeYear" aria-label="Year awarded"><option value="">All years</option></select>
                    </div>
                    <div id="awardees">${skeletonCards(4, "person-grid")}</div>`)}
                ${section("Grants list", html`<div id="grantsList">${skeletonList(4)}</div>`)}
            </div>`);

        const results = await ConnectAPI.fetchMany([
            { collection: "GrantsAwardee", query: { isDeleted: false }, options: { limit: 50 } },
            { collection: "GrantsList", query: { isDeleted: false } }
        ]);

        const awardees = results.GrantsAwardee.data || [];
        const grants = results.GrantsList.data || [];

        // Year filter (buildYearOptions)
        const years = [...new Set(awardees.map(a => a.yearAwarded).filter(Boolean))].sort((a, b) => b - a);
        const yearSelect = view.querySelector("#awardeeYear");

        yearSelect.insertAdjacentHTML("beforeend", String(html`${years.map(y => html`<option value="${y}">${y}</option>`)}`));

        const list = view.querySelector("#awardees");

        const draw = () => {

            const q = view.querySelector("#awardeeSearch").value.toLowerCase();
            const year = yearSelect.value;

            // applyFilters(): name, department, designation, project + year
            const filtered = awardees.filter(a => {
                const text = [a.facultyName?.profile?.name, a.department, a.facultyName?.profile?.designation, a.titleOfResearchProject].join(" ").toLowerCase();
                return text.includes(q) && (!year || String(a.yearAwarded) === year);
            });

            list.innerHTML = results.GrantsAwardee.error
                ? String(errorState(results.GrantsAwardee.error))
                : filtered.length
                    ? String(html`<div class="person-grid">${filtered.map(a => html`
                        <button type="button" class="card person-card" data-awardee="${awardees.indexOf(a)}">
                            ${img(fileUrl(a.awardeePhoto), a.facultyName?.profile?.name || "Awardee", "person-img")}
                            <strong>${a.facultyName?.profile?.name || "Unknown"}</strong>
                            <span class="text-muted">${a.profile?.designation || a.facultyName?.profile?.designation || ""}</span>
                            <span class="badge">${a.facultyName?.profile?.department || a.department || "N/A"}${a.yearAwarded ? ` · ${a.yearAwarded}` : ""}</span>
                        </button>`)}</div>`)
                    : String(emptyState("bi-person-x", "No awardees match"));

        };

        view.querySelector("#awardeeSearch").addEventListener("input", draw);
        yearSelect.addEventListener("change", draw);

        list.addEventListener("click", event => {

            const button = event.target.closest("[data-awardee]");

            if (!button) return;

            const a = awardees[Number(button.dataset.awardee)];

            openDialog({
                title: "Grant awardee",
                size: "lg",
                body: html`
                    <div class="detail-media">
                        ${img(fileUrl(a.awardeePhoto), "Awardee", "detail-img")}
                        <div>
                            <p class="badge badge-accent">Year awarded: ${a.yearAwarded || "—"}</p>
                            <h3 class="detail-title">${a.titleOfResearchProject || ""}</h3>
                            <p><em>— ${a.facultyName?.profile?.name || "Awardee"}</em></p>
                        </div>
                    </div>
                    <p>${multiline(a.summaryOfResearchProposal)}</p>`
            });

        });

        draw();

        if (results.GrantsList.error) {
            view.querySelector("#grantsList").innerHTML = String(errorState(results.GrantsList.error));
        } else {
            dataTable(view.querySelector("#grantsList"), {
                rows: grants,
                pageSize: 8,
                searchPlaceholder: "Search grants…",
                columns: [
                    { key: "grantName", title: "Grant name" },
                    { key: "yearOfIntroduction", title: "Introduced" },
                    { key: "dateTime", title: "Date" }
                ]
            });
        }

    }


    // -----------------------------------------------------------------
    // Publications map (loadPublicationsMap)
    // -----------------------------------------------------------------

    async function renderPublications(view) {

        view.innerHTML = String(html`
            ${header("publications")}
            <div class="two-col two-col-wide-left">
                <div class="card panel"><div id="publicationsMap" class="map-canvas"></div></div>
                ${section("Publications from mission hospitals", html`<div id="pubList">${skeletonList(5)}</div>`)}
            </div>`);

        let pubs;

        try {
            pubs = await ConnectAPI.rows({ collection: "MsnPublications", query: { isDeleted: false } });
        } catch (error) {
            view.querySelector("#pubList").innerHTML = String(errorState(error.message));
            view.querySelector("#publicationsMap").innerHTML = "";
            return;
        }

        view.querySelector("#pubList").innerHTML = pubs.length
            ? String(html`<div class="stack">${pubs.map(p => html`
                <article class="pub-card pub-card-compact">
                    <div>
                        <h3>${p.title || "Untitled"}</h3>
                        <p class="text-muted"><i class="bi bi-hospital"></i> ${p.missionHospitals?.missionHospitalName || "—"}</p>
                        ${p.authors ? html`<p><strong>Authors:</strong> ${p.authors}</p>` : ""}
                        ${p.abstractKeyFindings ? html`<details><summary>Abstract</summary><p>${multiline(p.abstractKeyFindings)}</p></details>` : ""}
                        ${safeUrl(p.link) ? html`<a class="btn btn-ghost btn-sm" href="${safeUrl(p.link)}" target="_blank" rel="noopener">View publication <i class="bi bi-box-arrow-up-right"></i></a>` : ""}
                    </div>
                </article>`)}</div>`)
            : String(emptyState("bi-journal", "No publications yet"));

        const hospitalIds = [...new Set(pubs.map(p => p.missionHospitals?._id).filter(Boolean))];

        if (!hospitalIds.length) {
            view.querySelector("#publicationsMap").innerHTML = String(emptyState("bi-geo-alt", "No hospital locations to plot"));
            return;
        }

        const hospitals = await ConnectAPI.rows({
            collection: "MissionHospital",
            query: { isDeleted: "false", _id: { $in: hospitalIds } },
            projection: { _id: 1, missionHospitalName: 1, hospitalLatitude: 1, hospitalLongitude: 1 }
        }).catch(() => []);

        renderMap(view.querySelector("#publicationsMap"), hospitals.map(h => ({
            lat: h.hospitalLatitude,
            lng: h.hospitalLongitude,
            title: h.missionHospitalName,
            info: String(html`<div class="map-info">${pubs.filter(p => p.missionHospitals?._id === h._id).map(p => html`
                <h4>${p.title}</h4>
                <p><b>Hospital:</b> ${p.missionHospitals.missionHospitalName}</p>
                <p><b>Authors:</b> ${p.authors || ""}</p>
                ${safeUrl(p.link) ? html`<p><a href="${safeUrl(p.link)}" target="_blank" rel="noopener">View publication</a></p>` : ""}<hr>`)}</div>`)
        })));

    }


    App.register({
        id: "research",
        title: "Research",
        icon: "bi-clipboard2-pulse",
        color: "blue",
        group: "Research",
        audiences: ["missions", "student"],
        description: "Publications, public health news, grants and research legacies.",
        render(view, params) {
            if (params[0] === "grants") return renderGrants(view);
            if (params[0] === "publications") return renderPublications(view);
            return renderOverview(view);
        }
    });

})();
