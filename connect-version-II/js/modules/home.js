/**
 * Dashboard widgets (rendered into #homeWidgets on the home view).
 *
 * Port of renderMissionsPage / renderStudentHomePage / renderGuestHomePage
 * (git: app.js) and the card definitions in precompile-script.js. The
 * queries are unchanged; only the presentation is version II.
 */
(function () {

    const { html, raw, esc, img, fileUrl, formatDate, isOngoing, multiline, safeUrl, emptyState, skeletonList, openDialog } = Kit;


    // CardBuilder keys shown per audience (precompile-script.js)
    const MISSION_CARDS = ["connectNewsletter", "learningResources", "manpowerRequest", "dls", "nabhEntryLevel", "legalHelp", "missionHospitalVisits", "equipment", "missionDesk", "libraryAccess", "research", "shiloh"];
    const STUDENT_CARDS = ["learningResources", "doddLibrary", "manpowerRequest", "dls", "missionHospitalVisits", "trainingOrObservership", "research", "shiloh"];

    // loadSubcard() routing (git: app.js) mapped to version II routes.
    const CARD_ROUTES = {
        learningResources: "learning-resources",
        research: "research",
        shiloh: "shiloh",
        connectNewsletter: "newsletter"
    };

    const DLS_PDF = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_16b948137046166a5897731aa4ad2497_Pictures.pdf";

    const CARD_ICONS = {
        learningResources: "bi-book",
        research: "bi-clipboard2-pulse",
        shiloh: "bi-heart",
        connectNewsletter: "bi-newspaper",
        doddLibrary: "bi-bookshelf",
        eqas: "bi-clipboard-check",
        dls: "bi-file-earmark-pdf",
        manpowerRequest: "bi-people",
        legalHelp: "bi-bank",
        equipment: "bi-tools",
        libraryAccess: "bi-key",
        missionHospitalVisits: "bi-geo-alt",
        nabhEntryLevel: "bi-award",
        missionDesk: "bi-headset",
        trainingOrObservership: "bi-mortarboard"
    };


    // -----------------------------------------------------------------
    // Queries (verbatim from the git code)
    // -----------------------------------------------------------------

    function todayRange() {

        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;
        const today = new Date(now - (now % oneDay));
        const tomorrow = new Date(today.valueOf() + oneDay);

        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);

        return { today, tomorrow };

    }

    const newsProjection = { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 };

    function newsQuery(user, audience) {

        const base = {
            newsDate: { $gt: { $date: new Date().toISOString() } },
            newsEditorStatus: "approved",
            "newsTags.newsTagId": "MSN",
            isDeleted: "false"
        };

        const type = String(user.userType || "").toLowerCase();
        const roles = user.roles || [];

        let userTypes = null;

        if (audience === "missions") {
            if (type === "faculty" || type === "postgraduate") userTypes = "faculty";
            else if (type === "external user" && roles.includes("Missions")) userTypes = { $in: ["external user", "faculty"] };
        } else if (audience === "student") {
            if (type === "student") userTypes = "student";
            else if (type === "external user" && roles.includes("student")) userTypes = { $in: ["external user", "student"] };
        } else {
            userTypes = { $all: ["external user", "other"] };
        }

        if (!userTypes) return null;

        return {
            collection: "NewsData",
            query: { ...base, "newsUserType.newsUserTypeName": userTypes },
            projection: newsProjection,
            options: { sort: { newsDate: 1 } }
        };

    }

    function collectionsFor(user, audience) {

        const { today, tomorrow } = todayRange();

        const defs = [
            { collection: "Thought", query: { tdate: { $gte: { $date: today.toISOString() }, $lt: { $date: tomorrow.toISOString() } }, isDeleted: "false" }, sort: { tdate: -1 } }
        ];

        if (audience === "missions" || audience === "student") {

            defs.push(
                { collection: "WeeklyManna", query: { isDeleted: false }, options: { sort: { devotionalDate: -1 }, limit: 1 } },
                { collection: "GrandRounds", query: { isDeleted: false }, options: { sort: { startDate: -1 } } },
                { collection: "ConnectNewsletter", query: { isDeleted: false }, options: { sort: { stDate: -1 } }, projection: { title: 1, flipbookUrl: 1, coverImg: 1, stDate: 1 } },
                { collection: "CardBuilder", query: { cardKeyName: { $in: audience === "missions" ? MISSION_CARDS : STUDENT_CARDS } } }
            );

        }

        if (audience === "missions") {

            defs.push(
                { collection: "HospitalAdmins", query: { userDocId: user.id, isDeleted: "false" } },
                { collection: "WhatsNew", query: { isDeleted: false, showOnCarousel: "yes", "showOn.Missions": true }, options: { sort: { "added.addedDate": -1 } } }
            );

        }

        if (audience === "guest") {
            defs.push({ collection: "WhatsNew", query: { isDeleted: false, showOnCarousel: "yes", "showOn.Guest": true }, options: { sort: { "added.addedDate": -1 } } });
        }

        const news = newsQuery(user, audience);

        if (news) defs.push(news);

        return defs;

    }


    // -----------------------------------------------------------------
    // Widgets
    // -----------------------------------------------------------------

    const DEFAULT_THOUGHT = "“Whenever GOD determines to do a great work, HE first sets HIS people to pray.” - Charles Spurgeon";

    function thoughtCard(thought) {

        return html`
            <article class="card widget widget-thought">
                <div class="widget-head"><span class="widget-icon"><i class="bi bi-feather"></i></span><h2>Thought for the day</h2></div>
                <blockquote>${multiline(thought || DEFAULT_THOUGHT)}</blockquote>
            </article>`;

    }

    function mannaCard(manna) {

        if (!manna) {
            return html`<article class="card widget">${widgetHead("bi-book-half", "Weekly Manna", "#/weekly-manna")}${emptyState("bi-book", "No devotional yet")}</article>`;
        }

        return html`
            <article class="card widget">
                ${widgetHead("bi-book-half", "Weekly Manna", "#/weekly-manna")}
                <button type="button" class="manna-preview" data-manna>
                    ${img(fileUrl(manna.uploadImage), "Weekly Manna", "manna-img")}
                    <div>
                        <h3>${manna.devotionalTitle || "Details Awaited"}</h3>
                        <p class="text-muted">${formatDate(manna.devotionalDate, "long")}</p>
                        ${manna.devotionalKeyVerse ? html`<p class="manna-verse">${manna.devotionalKeyVerse}</p>` : ""}
                    </div>
                </button>
            </article>`;

    }

    function grandRoundsCard(list) {

        const ongoing = (list || []).filter(item => isOngoing(item.endDate));

        return html`
            <article class="card widget">
                ${widgetHead("bi-camera-video", "Grand Rounds", "#/grand-rounds")}
                ${ongoing.length
                    ? html`<ul class="widget-list">${ongoing.map(item => html`
                        <li><a href="#/grand-rounds">
                            <span class="widget-list-title">${item.grandRoundsTitle}</span>
                            <span class="text-muted">${item.speakerName || ""}${item.startDate ? html` · ${formatDate(item.startDate, "short")}` : ""}</span>
                        </a></li>`)}</ul>`
                    : emptyState("bi-calendar-x", (list || []).length ? "No ongoing Grand Rounds" : "No Grand Rounds available")}
            </article>`;

    }

    function newsCard(news) {

        return html`
            <article class="card widget widget-wide">
                ${widgetHead("bi-megaphone", "News", "#/news")}
                ${news.length
                    ? html`<ul class="news-list">${news.map(item => html`
                        <li><button type="button" class="news-item" data-news="${item._id}">
                            ${img(item.newsImage, "", "news-thumb")}
                            <span class="news-text">
                                <span class="news-title">${item.newsTitle}</span>
                                <span class="text-muted">${item.newsSubTitle || ""}</span>
                            </span>
                            <i class="bi bi-chevron-right"></i>
                        </button></li>`)}</ul>`
                    : emptyState("bi-newspaper", "No upcoming news")}
            </article>`;

    }

    function hospitalsCard(admins) {

        const hospitals = admins?.[0]?.allottedMissionHospitals || [];

        if (!hospitals.length) return "";

        return html`
            <article class="card widget">
                ${widgetHead("bi-hospital", "Your hospitals", "#/hospitals")}
                <ul class="widget-list">${hospitals.map(h => html`
                    <li><a href="${h.hospitalDocId ? `#/my-hospital/${encodeURIComponent(h.hospitalDocId)}` : "#/hospitals"}">
                        <span class="widget-list-title">${h.hospitalName || h.missionHospitalName || "Hospital"}</span>
                        <span class="text-muted">${[h.infoLabel, h.hospitalDetail].filter(Boolean).join(" ")}</span>
                    </a></li>`)}</ul>
            </article>`;

    }

    function newsletterCard(latest) {

        return html`
            <article class="card widget widget-newsletter">
                ${widgetHead("bi-journal-richtext", "Missions Connect Newsletter", "#/newsletter")}
                <p>Do you have a story to share? We would love to hear from you at
                    <a href="mailto:missionconnect@cmcvellore.ac.in">missionconnect@cmcvellore.ac.in</a>.</p>
                <a class="btn btn-primary btn-sm" href="#/newsletter${latest ? "/latest" : ""}">
                    <i class="bi bi-book"></i> ${latest ? `Read ${latest.title || "the latest issue"}` : "Browse issues"}
                </a>
            </article>`;

    }

    function whatsNewCarousel(items) {

        if (!items.length) return "";

        return html`
            <section class="whats-new card" aria-roledescription="carousel" aria-label="What's new">
                <div class="whats-new-track">
                    ${items.map((item, index) => html`
                        <button type="button" class="whats-new-slide ${index === 0 ? "is-active" : ""}" data-whatsnew="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
                            ${img(fileUrl(item.uploadImage), item.title || "", "whats-new-img")}
                            <div class="whats-new-copy">
                                <span class="eyebrow">What's new</span>
                                <h2>${item.title || "Details Awaited"}</h2>
                                <p>${item.description || ""}</p>
                            </div>
                        </button>`)}
                </div>
                ${items.length > 1 ? html`<div class="whats-new-dots">${items.map((_, i) => html`<button type="button" aria-label="Slide ${i + 1}" data-dot="${i}" class="${i === 0 ? "is-active" : ""}"></button>`)}</div>` : ""}
            </section>`;

    }

    function quickLinks(cards) {

        if (!cards.length) return "";

        return html`
            <section class="quick-links">
                <div class="section-heading"><div><h2>Quick links</h2><p>Shortcuts configured by the Missions office.</p></div></div>
                <div class="quick-link-grid">
                    ${cards.map(card => html`
                        <button type="button" class="quick-link" data-card="${card.cardKeyName}" data-url="${card.pathUrl || ""}">
                            <span class="quick-link-icon" style="${card.bgColor ? `--tile:${card.bgColor}` : ""}"><i class="bi ${CARD_ICONS[card.cardKeyName] || "bi-grid"}"></i></span>
                            <span>${card.cardName}</span>
                        </button>`)}
                </div>
            </section>`;

    }

    function widgetHead(icon, title, href) {

        return html`
            <div class="widget-head">
                <span class="widget-icon"><i class="bi ${icon}"></i></span>
                <h2>${title}</h2>
                ${href ? html`<a class="widget-more" href="${href}">View all <i class="bi bi-arrow-right"></i></a>` : ""}
            </div>`;

    }


    // -----------------------------------------------------------------
    // Dialogs
    // -----------------------------------------------------------------

    function openManna(manna) {

        openDialog({
            title: "Weekly Manna",
            size: "lg",
            body: html`
                <div class="detail-media">
                    ${img(fileUrl(manna.uploadImage), "Weekly Manna", "detail-img")}
                    <div>
                        <p class="text-muted">${formatDate(manna.devotionalDate, "long")}</p>
                        <h3 class="detail-title">${manna.devotionalTitle || ""}</h3>
                        ${manna.devotionalKeyVerse ? html`<p><strong>Key verse:</strong> ${manna.devotionalKeyVerse}</p>` : ""}
                    </div>
                </div>
                ${manna.devotionalDescription ? html`<h4 class="detail-subhead">Description</h4><p>${multiline(manna.devotionalDescription)}</p>` : ""}
                ${manna.prayerpoints ? html`<h4 class="detail-subhead">Prayer points</h4><p>${multiline(manna.prayerpoints)}</p>` : ""}`
        });

    }

    // openModal('News', id) in the git code (modal.js) - same query.
    async function openNews(id, fallback) {

        const dialog = openDialog({ title: "News", size: "lg", body: String(skeletonList(3)) });

        try {

            const rows = await ConnectAPI.rows({
                collection: "NewsData",
                query: { _id: id, "newsUserType.newsUserTypeName": "external user", isDeleted: "false" }
            });

            const news = rows[0] || fallback || {};

            dialog.body.innerHTML = String(html`
                ${news.newsImage ? img(news.newsImage, "", "detail-hero") : ""}
                <h3 class="detail-title">${news.newsTitle || ""}</h3>
                ${news.newsSubTitle ? html`<p class="text-muted">${news.newsSubTitle}</p>` : ""}
                ${news.newsDate ? html`<p class="badge badge-accent">${formatDate(news.newsDate, "long")}</p>` : ""}
                ${news.newsDescription ? html`<div class="news-body">${raw(sanitize(news.newsDescription))}</div>` : html`<p class="text-muted">Full details are not available for this item.</p>`}`);

        } catch (error) {

            dialog.body.innerHTML = String(Kit.errorState(error.message));

        }

    }

    function openWhatsNew(item) {

        const link = safeUrl(item.link);

        openDialog({
            title: "What's new",
            size: "lg",
            body: html`
                ${img(fileUrl(item.uploadImage), item.title || "", "detail-hero")}
                <h3 class="detail-title">${item.title || ""}</h3>
                <p>${multiline(item.description)}</p>
                ${link ? html`<a class="btn btn-primary" href="${link}" target="_blank" rel="noopener">Learn more <i class="bi bi-box-arrow-up-right"></i></a>` : ""}`
        });

    }

    // News descriptions are rich text from the CMS editor: keep basic
    // formatting, drop scripts, handlers and non-http links.
    function sanitize(markup) {

        const doc = new DOMParser().parseFromString(String(markup || ""), "text/html");

        doc.querySelectorAll("script, style, iframe, object, embed, link, meta").forEach(el => el.remove());

        doc.querySelectorAll("*").forEach(el => {

            [...el.attributes].forEach(attr => {

                const name = attr.name.toLowerCase();

                if (name.startsWith("on")) el.removeAttribute(attr.name);

                if ((name === "href" || name === "src") && !/^(https?:|mailto:|data:image\/)/i.test(attr.value.trim())) {
                    el.removeAttribute(attr.name);
                }

            });

        });

        return doc.body.innerHTML;

    }


    // -----------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------

    async function render(view, params, { user, audience }) {

        view.innerHTML = String(html`<div class="widget-grid">${skeletonList(3)}${skeletonList(3)}${skeletonList(3)}</div>`);

        const results = await ConnectAPI.fetchMany(collectionsFor(user, audience));

        const data = name => results[name]?.data || [];

        const manna = data("WeeklyManna")[0];
        const whatsNew = data("WhatsNew");
        const news = data("NewsData");
        const latestNewsletter = data("ConnectNewsletter")[0];

        view.innerHTML = String(html`
            ${whatsNewCarousel(whatsNew)}
            <div class="widget-grid">
                ${thoughtCard(data("Thought")[0]?.thoughts)}
                ${audience !== "guest" ? mannaCard(manna) : ""}
                ${audience !== "guest" ? grandRoundsCard(data("GrandRounds")) : ""}
                ${audience === "missions" ? hospitalsCard(data("HospitalAdmins")) : ""}
                ${audience !== "guest" ? newsletterCard(latestNewsletter) : ""}
                ${newsCard(news)}
            </div>
            ${quickLinks(data("CardBuilder"))}`);

        // Interactions
        view.querySelector("[data-manna]")?.addEventListener("click", () => openManna(manna));

        view.querySelectorAll("[data-news]").forEach(button => button.addEventListener("click", () =>
            openNews(button.dataset.news, news.find(n => n._id === button.dataset.news))));

        view.querySelectorAll("[data-whatsnew]").forEach(button => button.addEventListener("click", () =>
            openWhatsNew(whatsNew[Number(button.dataset.whatsnew)])));

        view.querySelectorAll("[data-card]").forEach(button => button.addEventListener("click", () =>
            openCard(button.dataset.card, button.dataset.url)));

        return startCarousel(view);

    }

    function openCard(key, url) {

        if (CARD_ROUTES[key]) {
            App.navigate(CARD_ROUTES[key]);
            return;
        }

        if (key === "dls") {
            window.open(DLS_PDF, "_blank", "noopener");
            return;
        }

        const link = safeUrl(url);

        if ((key === "doddLibrary" || key === "eqas") && link) {
            window.open(link, "_blank", "noopener");
            return;
        }

        UI.toast("Coming in the next update", { type: "info", message: "This module is being moved to the new CMC V Connect in Phase 2." });

    }

    // Auto-advancing What's New carousel (3s, pauses on hover like the git carousel)
    function startCarousel(view) {

        const slides = [...view.querySelectorAll(".whats-new-slide")];
        const dots = [...view.querySelectorAll("[data-dot]")];

        if (slides.length < 2) return null;

        let index = 0;
        let paused = false;

        const show = next => {

            index = (next + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle("is-active", i === index);
                slide.setAttribute("aria-hidden", i === index ? "false" : "true");
            });

            dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));

        };

        dots.forEach(dot => dot.addEventListener("click", () => show(Number(dot.dataset.dot))));

        const carousel = view.querySelector(".whats-new");

        carousel.addEventListener("mouseenter", () => { paused = true; });
        carousel.addEventListener("mouseleave", () => { paused = false; });

        const timer = setInterval(() => { if (!paused) show(index + 1); }, 3000);

        return () => clearInterval(timer);

    }


    App.register({
        id: "home",
        title: "Dashboard",
        nav: false,
        render
    });

    // Shared with other modules
    window.HomeWidgets = { openManna, openNews, sanitize, newsQuery };

})();
