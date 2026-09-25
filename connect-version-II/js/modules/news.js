/**
 * Weekly Manna, News and Newsletter.
 *
 * Weekly Manna - loadWeeklyMannaTable (formLoad.js): WeeklyManna, isDeleted:false
 * News         - loadAllNews / fetchNews (dynamicRender.js): approved MSN news for
 *                the user's news type, newest first, 20 then "load more"; keyword
 *                search (>= 3 chars) on title / subtitle
 * Newsletter   - loadNewsletterCards (app.js): ConnectNewsletter sorted by stDate
 *                desc, opens the flipbook
 */
(function () {

    const { html, img, fileUrl, formatDate, toDate, safeUrl, emptyState, errorState, skeletonCards, skeletonList, pageHeader, dataTable, openDialog } = Kit;


    // -----------------------------------------------------------------
    // Weekly Manna
    // -----------------------------------------------------------------

    async function renderManna(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Devotional", title: "Weekly Manna", icon: "bi-book-half", color: "orange", description: "Weekly devotionals with a key verse and prayer points." })}
            <div class="card panel"><div class="panel-body" id="mannaTable">${skeletonList(6)}</div></div>
            <p class="page-note">Please write to us: <a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a> or call +91 416 228 6117</p>`);

        let rows;

        try {
            rows = await ConnectAPI.rows({ collection: "WeeklyManna", query: { isDeleted: false } });
        } catch (error) {
            view.querySelector("#mannaTable").innerHTML = String(errorState(error.message));
            return;
        }

        dataTable(view.querySelector("#mannaTable"), {
            rows,
            searchPlaceholder: "Search devotionals…",
            initialSort: { key: "devotionalDate", dir: "desc" },
            columns: [
                { key: "devotionalDate", title: "Date", sortValue: r => toDate(r.devotionalDate)?.getTime() || 0, render: r => formatDate(r.devotionalDate) },
                { key: "devotionalTitle", title: "Devotional title" },
                { key: "devotionalKeyVerse", title: "Key verse" },
                { key: "details", title: "", sortable: false, className: "cell-action", render: r => html`<button type="button" class="btn btn-secondary btn-sm" data-manna="${r._id}">Details</button>` }
            ]
        });

        view.querySelector("#mannaTable").addEventListener("click", event => {
            const button = event.target.closest("[data-manna]");
            if (button) HomeWidgets.openManna(rows.find(r => String(r._id) === button.dataset.manna));
        });

    }


    // -----------------------------------------------------------------
    // News
    // -----------------------------------------------------------------

    const INITIAL = 20;
    const MORE = 12;

    // searchQuery built in loadAllNews() from the user's type and roles
    function newsTypeFilter(user, audience) {

        const type = String(user.userType || "").toLowerCase();
        const roles = user.roles || [];

        if (audience === "missions") {
            if (type === "faculty") return { "newsUserType.newsUserTypeName": "faculty" };
            if (type === "external user" && roles.includes("Missions")) return { "newsUserType.newsUserTypeName": { $in: ["external user", "faculty"] } };
            return {};
        }

        if (audience === "student") {
            if (type === "student") return { "newsUserType.newsUserTypeName": "student" };
            if (type === "external user" && roles.includes("student")) return { "newsUserType.newsUserTypeName": { $in: ["external user", "student"] } };
            return {};
        }

        return { "newsUserType.newsUserTypeName": { $all: ["external user", "other"] } };

    }

    function fetchNews(query, limit, skip) {

        return ConnectAPI.rows({
            collection: "NewsData",
            query: { ...query, newsEditorStatus: "approved", "newsTags.newsTagId": "MSN", isDeleted: "false" },
            projection: { _id: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1, newsDate: 1 },
            options: { limit, skip, sort: { newsDate: -1 } }
        });

    }

    function newsTile(item, featured) {

        return html`
            <button type="button" class="card news-card ${featured ? "news-card-featured" : ""}" data-news="${item._id}">
                ${img(item.newsImage, "", "news-card-img")}
                <span class="news-card-body">
                    <span class="badge">${formatDate(item.newsDate)}</span>
                    <span class="news-card-title">${item.newsTitle}</span>
                    <span class="text-muted">${item.newsSubTitle || ""}</span>
                </span>
            </button>`;

    }

    async function renderNews(view, params, { user, audience }) {

        const typeFilter = newsTypeFilter(user, audience);

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Missions", title: "News", icon: "bi-megaphone", color: "pink", description: "Approved news from the Missions office." })}
            <div class="toolbar">
                <div class="input-group toolbar-search-wide">
                    <i class="bi bi-search"></i>
                    <input type="search" class="input" id="newsSearch" placeholder="Search news (3+ characters)…" aria-label="Search news">
                </div>
            </div>
            <div id="newsGrid">${skeletonCards(8, "news-grid")}</div>
            <div class="load-more"><button type="button" class="btn btn-secondary hidden" id="newsMore">Load more</button></div>`);

        const grid = view.querySelector("#newsGrid");
        const more = view.querySelector("#newsMore");

        let items = [];
        let searching = false;

        const draw = (list, emptyTitle) => {

            grid.innerHTML = list.length
                ? String(html`<div class="news-grid">${list.map((item, i) => newsTile(item, !searching && i === 0))}</div>`)
                : String(emptyState("bi-newspaper", emptyTitle));

        };

        grid.addEventListener("click", event => {
            const button = event.target.closest("[data-news]");
            if (button) HomeWidgets.openNews(button.dataset.news, items.find(n => String(n._id) === button.dataset.news));
        });

        try {
            items = await fetchNews(typeFilter, INITIAL, 0);
        } catch (error) {
            grid.innerHTML = String(errorState(error.message));
            return;
        }

        draw(items, "No news yet");
        more.classList.toggle("hidden", items.length < INITIAL);

        more.addEventListener("click", async () => {

            UI.setLoading(more, true);

            try {

                const next = await fetchNews(typeFilter, MORE, items.length);

                items = items.concat(next);
                draw(items, "No news yet");
                more.classList.toggle("hidden", next.length < MORE);

            } catch (error) {
                UI.toast("Couldn't load more news", { type: "error", message: error.message });
            } finally {
                UI.setLoading(more, false);
            }

        });

        let timer;
        let base = items;

        view.querySelector("#newsSearch").addEventListener("input", event => {

            clearTimeout(timer);

            const keyword = event.target.value.trim().toLowerCase();

            timer = setTimeout(async () => {

                if (keyword.length < 3) {
                    searching = false;
                    items = base;
                    draw(items, "No news yet");
                    more.classList.toggle("hidden", items.length < INITIAL);
                    return;
                }

                if (!searching) base = items;

                searching = true;
                more.classList.add("hidden");
                grid.innerHTML = String(skeletonCards(4, "news-grid"));

                const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                try {
                    items = await fetchNews({
                        ...typeFilter,
                        $or: [
                            { newsTitle: { $regex: escaped, $options: "i" } },
                            { newsSubTitle: { $regex: escaped, $options: "i" } }
                        ]
                    }, 50, 0);
                    draw(items, "No news matches your search");
                } catch (error) {
                    grid.innerHTML = String(errorState(error.message));
                }

            }, 300);

        });

    }


    // -----------------------------------------------------------------
    // Newsletter
    // -----------------------------------------------------------------

    function openFlipbook(item) {

        const url = safeUrl(item.flipbookUrl);

        if (!url) {
            UI.toast("This issue has no online version yet", { type: "warning" });
            return;
        }

        openDialog({
            title: item.title || "Mission Connect",
            size: "xl",
            body: html`<div class="flipbook-frame"><iframe src="${url}" title="${item.title || "Newsletter"}" allowfullscreen></iframe></div>`,
            footer: html`<a class="btn btn-secondary" href="${url}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> Open in new tab</a>`
        });

    }

    async function renderNewsletter(view, params) {

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Missions Connect",
                title: "Newsletter",
                icon: "bi-journal-richtext",
                color: "pink",
                description: "Do you have a story to share? We would love to hear from you.",
                actions: html`<a class="btn btn-secondary" href="mailto:missionconnect@cmcvellore.ac.in"><i class="bi bi-envelope"></i> Share a story</a>`
            })}
            <div id="issues">${skeletonCards(6, "cover-grid")}</div>`);

        let rows;

        try {
            rows = await ConnectAPI.rows({ collection: "ConnectNewsletter", query: { isDeleted: false } });
        } catch (error) {
            view.querySelector("#issues").innerHTML = String(errorState(error.message));
            return;
        }

        const sorted = [...rows].sort((a, b) => (toDate(b.stDate) || 0) - (toDate(a.stDate) || 0));

        view.querySelector("#issues").innerHTML = sorted.length
            ? String(html`<div class="cover-grid">${sorted.map((item, i) => html`
                <button type="button" class="cover-card" data-issue="${i}">
                    ${img(fileUrl(item.coverImg), item.title || "Mission Connect", "cover-img")}
                    <span class="cover-title">${item.title || "Mission Connect"}</span>
                    <span class="text-muted">${formatDate(item.stDate, "long")}</span>
                </button>`)}</div>`)
            : String(emptyState("bi-journal-x", "No newsletters available yet."));

        view.querySelectorAll("[data-issue]").forEach(button => button.addEventListener("click", () => openFlipbook(sorted[Number(button.dataset.issue)])));

        // #/newsletter/latest (from the dashboard card) opens the newest issue
        if (params[0] === "latest" && sorted[0]) {
            openFlipbook(sorted[0]);
        }

    }


    App.register({
        id: "weekly-manna",
        title: "Weekly Manna",
        icon: "bi-book-half",
        color: "orange",
        group: "Community",
        audiences: ["missions", "student"],
        description: "Weekly devotionals with key verses and prayer points.",
        render: renderManna
    });

    App.register({
        id: "news",
        title: "News",
        icon: "bi-megaphone",
        color: "pink",
        group: "News & updates",
        description: "Approved news from the Missions office, with search.",
        render: renderNews
    });

    App.register({
        id: "newsletter",
        title: "Newsletter",
        icon: "bi-journal-richtext",
        color: "pink",
        group: "News & updates",
        audiences: ["missions", "student"],
        description: "Missions Connect newsletter issues as flipbooks.",
        render: renderNewsletter
    });

})();
