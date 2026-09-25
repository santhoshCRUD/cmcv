/**
 * Grand Rounds
 *
 * Port of views/Research/grandRounds.html + loadGrandRoundsTable (formLoad.js),
 * renderOngoingGrandRounds and loadGrandRoundsVideos (dynamicRender.js).
 *   - schedule: GrandRounds, isDeleted:false, sorted by added.addedDate desc
 *   - ongoing:  endDate >= today (Register link only while ongoing)
 *   - videos:   LearningResources with subType "Grand Rounds", newest first
 *
 * Routes: #/grand-rounds, #/grand-rounds/videos
 */
(function () {

    const { html, img, fileUrl, formatDate, isOngoing, safeUrl, multiline, emptyState, errorState, skeletonCards, pageHeader, section, dataTable, openDialog, openVideo, toDate } = Kit;

    const VIDEO_PROJECTION = { Date: 1, stream: 1, resourceLink: 1, resourcePerson: 1, type: 1, typeId: 1, subType: 1, metaTags: 1, title: 1 };

    const tagsText = tags => Array.isArray(tags) ? tags.join(", ") : (tags || "");

    function videoCard(item) {

        return html`
            <button type="button" class="card resource-card" data-video="${item._id}">
                <span class="resource-type"><i class="bi ${/video|youtube/i.test(item.type || "") || /youtu/.test(item.resourceLink || "") ? "bi-play-circle-fill" : "bi-link-45deg"}"></i> ${item.type || "Resource"}${item.subType ? ` · ${item.subType}` : ""}</span>
                <h3>${item.title || "Untitled"}</h3>
                ${item.resourcePerson ? html`<p>${item.resourcePerson}</p>` : ""}
                ${tagsText(item.metaTags) ? html`<span class="resource-tags">${tagsText(item.metaTags)}</span>` : ""}
            </button>`;

    }

    function bindVideos(root, list) {

        root.querySelectorAll("[data-video]").forEach(button => button.addEventListener("click", () => {
            const item = list.find(v => String(v._id) === button.dataset.video);
            if (item) openVideo(item.title || "Grand Rounds", item.resourceLink || item.url);
        }));

    }

    async function fetchVideos(limit) {

        const def = {
            collection: "LearningResources",
            query: { subType: "Grand Rounds", isDeleted: false },
            projection: VIDEO_PROJECTION,
            options: { sort: { Date: -1 } }
        };

        if (limit) def.options.limit = limit;

        return ConnectAPI.rows(def);

    }


    async function renderOverview(view) {

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Research",
                title: "Grand Rounds",
                icon: "bi-camera-video",
                color: "teal",
                description: "A webinar series by senior clinicians, addressing key clinical topics relevant to practitioners in peripheral hospital settings.",
                actions: html`<a class="btn btn-secondary" href="#/grand-rounds/videos"><i class="bi bi-collection-play"></i> All videos</a>`
            })}
            <div class="detail-grid">
                <div class="detail-main">
                    ${section("Ongoing Grand Rounds", html`<div id="ongoing">${skeletonCards(2, "poster-grid")}</div>`)}
                    ${section("Schedule", html`<div id="schedule">${Kit.skeletonList(5)}</div>`)}
                </div>
                <div class="detail-side">
                    ${section("Recent videos", html`<div id="recentVideos" class="stack">${Kit.skeletonList(4)}</div>`, { actions: html`<a class="btn btn-ghost btn-sm" href="#/grand-rounds/videos">View all</a>` })}
                </div>
            </div>`);

        const [schedule, videos] = await Promise.allSettled([
            ConnectAPI.rows({ collection: "GrandRounds", query: { isDeleted: false }, options: { sort: { "added.addedDate": -1 } } }),
            fetchVideos(10)
        ]);

        // Ongoing + schedule
        if (schedule.status === "rejected") {

            view.querySelector("#ongoing").innerHTML = String(errorState(schedule.reason.message));
            view.querySelector("#schedule").innerHTML = "";

        } else {

            const rows = schedule.value;
            const ongoing = rows.filter(r => isOngoing(r.endDate));

            view.querySelector("#ongoing").innerHTML = ongoing.length
                ? String(html`<div class="poster-grid">${ongoing.map(r => html`
                    <button type="button" class="poster-card" data-poster="${r._id}">
                        ${img(fileUrl(r.posterCard) || fileUrl(r.poster), `${r.grandRoundsTitle} poster`)}
                        <span class="poster-caption"><strong>${r.grandRoundsTitle}</strong><span>${r.speakerName || ""}</span></span>
                    </button>`)}</div>`)
                : String(emptyState("bi-calendar-x", "No ongoing grand rounds"));

            view.querySelectorAll("[data-poster]").forEach(button => button.addEventListener("click", () =>
                openPoster(rows.find(r => String(r._id) === button.dataset.poster))));

            dataTable(view.querySelector("#schedule"), {
                rows,
                pageSize: 8,
                searchPlaceholder: "Search grand rounds…",
                initialSort: { key: "startDate", dir: "desc" },
                columns: [
                    { key: "grandRoundsTitle", title: "Grand Rounds" },
                    { key: "speakerName", title: "Speaker" },
                    {
                        key: "startDate", title: "Schedule",
                        sortValue: r => toDate(r.startDate)?.getTime() || 0,
                        render: r => html`<span class="text-muted">Started ${formatDate(r.startDate)}</span><br>
                            <button type="button" class="link-btn" data-schedule="${r._id}">View schedule</button>`
                    },
                    {
                        key: "register", title: "Register", sortable: false,
                        render: r => isOngoing(r.endDate) && safeUrl(r.zoomLink)
                            ? html`<a class="btn btn-primary btn-sm" href="${safeUrl(r.zoomLink)}" target="_blank" rel="noopener">Register</a>`
                            : html`<span class="badge">Closed</span>`
                    }
                ]
            });

            view.querySelector("#schedule").addEventListener("click", event => {

                const button = event.target.closest("[data-schedule]");

                if (!button) return;

                const r = rows.find(x => String(x._id) === button.dataset.schedule);

                openDialog({ title: "Grand Rounds schedule", body: html`<h3 class="detail-title">${r.grandRoundsTitle}</h3><p>${multiline(r.dateTime || "Schedule to be announced.")}</p>` });

            });

        }

        // Recent videos
        const recent = view.querySelector("#recentVideos");

        if (videos.status === "rejected") {
            recent.innerHTML = String(errorState(videos.reason.message));
        } else if (!videos.value.length) {
            recent.innerHTML = String(emptyState("bi-camera-video-off", "No videos found."));
        } else {
            recent.innerHTML = String(html`${videos.value.map(videoCard)}`);
            bindVideos(recent, videos.value);
        }

    }

    function openPoster(r) {

        const zoom = safeUrl(r.zoomLink);

        openDialog({
            title: r.grandRoundsTitle || "Grand Rounds",
            size: "lg",
            body: html`
                ${img(fileUrl(r.poster) || fileUrl(r.posterCard), "Poster", "detail-hero")}
                <p><strong>${r.speakerName || ""}</strong></p>
                ${r.dateTime ? html`<p>${multiline(r.dateTime)}</p>` : ""}`,
            footer: zoom && isOngoing(r.endDate) ? html`<a class="btn btn-primary" href="${zoom}" target="_blank" rel="noopener">Register</a>` : ""
        });

    }


    async function renderVideos(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Grand Rounds", title: "All videos", icon: "bi-collection-play", color: "teal", back: { href: "#/grand-rounds", label: "Grand Rounds" } })}
            <div class="toolbar">
                <div class="input-group toolbar-search-wide">
                    <i class="bi bi-search"></i>
                    <input type="search" class="input" id="videoSearch" placeholder="Search by title, speaker or tag…" aria-label="Search videos">
                </div>
                <span class="text-muted" id="videoCount"></span>
            </div>
            <div id="videoGrid">${skeletonCards(6, "resource-grid")}</div>`);

        let all;

        try {
            all = await fetchVideos();
        } catch (error) {
            view.querySelector("#videoGrid").innerHTML = String(errorState(error.message));
            return;
        }

        const grid = view.querySelector("#videoGrid");

        const draw = list => {

            view.querySelector("#videoCount").textContent = `${list.length} video${list.length === 1 ? "" : "s"}`;

            grid.innerHTML = list.length
                ? String(html`<div class="resource-grid">${list.map(videoCard)}</div>`)
                : String(emptyState("bi-search", "No videos match your search"));

            bindVideos(grid, list);

        };

        // Same fields as the git search: title, resourcePerson, metaTags
        view.querySelector("#videoSearch").addEventListener("input", event => {

            const q = event.target.value.toLowerCase();

            draw(all.filter(item =>
                (item.title || "").toLowerCase().includes(q) ||
                (item.resourcePerson || "").toLowerCase().includes(q) ||
                tagsText(item.metaTags).toLowerCase().includes(q)));

        });

        draw(all);

    }


    App.register({
        id: "grand-rounds",
        title: "Grand Rounds",
        icon: "bi-camera-video",
        color: "teal",
        group: "Learning",
        description: "Webinar series by senior clinicians: ongoing sessions, schedule and recordings.",
        render(view, params) {
            return params[0] === "videos" ? renderVideos(view) : renderOverview(view);
        }
    });

    window.GrandRoundsViews = { videoCard, bindVideos };

})();
