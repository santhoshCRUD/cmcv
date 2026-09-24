/**
 * UI kit for the ported CMC V Connect modules.
 *
 * Small, dependency-free helpers that render version II design-system
 * markup (styles/design-system.css + styles/modules.css). Every value
 * coming from the database goes through esc() / the html`` template,
 * so module code never builds raw HTML from data.
 *
 * Exposed as window.Kit.
 */
(function () {

    const FALLBACK_IMAGE =
        "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";



    // -----------------------------------------------------------------
    // Escaping + templating
    // -----------------------------------------------------------------

    function esc(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

    class Raw {
        constructor(value) { this.value = value; }
        toString() { return this.value; }
    }

    const raw = value => new Raw(value === undefined || value === null ? "" : String(value));

    function interpolate(value) {

        if (value instanceof Raw) {
            return value.value;
        }

        if (Array.isArray(value)) {
            return value.map(interpolate).join("");
        }

        if (value === false || value === null || value === undefined) {
            return "";
        }

        return esc(value);

    }

    // html`<p>${userText}</p>` escapes; nested html`` results and raw() pass through.
    function html(strings, ...values) {

        let out = strings[0];

        values.forEach((value, i) => {
            out += interpolate(value) + strings[i + 1];
        });

        return raw(out);

    }

    function toNode(markup) {

        const template = document.createElement("template");

        template.innerHTML = String(markup).trim();

        return template.content.childElementCount === 1
            ? template.content.firstElementChild
            : template.content;

    }

    // Keeps line breaks from multi-line DB text (the git code uses white-space: pre-line).
    function multiline(text) {
        return raw(esc(text || "").replace(/\n/g, "<br>"));
    }

    // Only http(s)/mailto links are rendered as links.
    function safeUrl(url) {

        const value = String(url || "").trim();

        return /^(https?:|mailto:)/i.test(value) ? value : "";

    }


    // -----------------------------------------------------------------
    // Data helpers (legacy document shapes)
    // -----------------------------------------------------------------

    // File fields in the legacy collections come in several shapes:
    // [{ data: { url } }], [{ url }], { url }, or a plain string.
    function fileUrl(field) {

        const first = Array.isArray(field) ? field[0] : field;

        if (!first) {
            return "";
        }

        if (typeof first === "string") {
            return first;
        }

        return first.data?.url || first.url || "";

    }

    function toDate(value) {

        if (!value) {
            return null;
        }

        const date = new Date(value.$date || value);

        return isNaN(date) ? null : date;

    }

    function formatDate(value, style = "medium") {

        const date = toDate(value);

        if (!date) {
            return "";
        }

        const options = {
            short: { day: "numeric", month: "short" },
            medium: { day: "numeric", month: "short", year: "numeric" },
            long: { day: "numeric", month: "long", year: "numeric" },
            datetime: { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }
        }[style] || {};

        return date.toLocaleDateString("en-IN", options);

    }

    function startOfToday() {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return today;

    }

    // Same test the git code uses for "ongoing" Grand Rounds.
    function isOngoing(endDate) {

        const end = toDate(endDate);

        if (!end) {
            return false;
        }

        end.setHours(0, 0, 0, 0);

        return end >= startOfToday();

    }

    function initials(name) {

        return String(name || "?")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0].toUpperCase())
            .join("");

    }

    // convertToEmbedURL() from the git code (YouTube only).
    function videoEmbed(url) {

        const match = String(url || "").match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/)|youtu\.be\/)([\w-]+)/);

        return match
            ? { type: "iframe", content: `https://www.youtube.com/embed/${match[1]}` }
            : { type: "unsupported", content: url };

    }


    // -----------------------------------------------------------------
    // Building blocks
    // -----------------------------------------------------------------

    function img(src, alt = "", className = "") {

        return html`<img src="${src || FALLBACK_IMAGE}" alt="${alt}" class="${className}" loading="lazy"
            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'">`;

    }

    function pageHeader({ eyebrow, title, description, actions = "", icon, color = "blue", back }) {

        return html`
            <header class="page-header">
                ${back ? html`<a class="btn btn-ghost btn-sm page-back" href="${back.href}"><i class="bi bi-arrow-left"></i> ${back.label || "Back"}</a>` : ""}
                <div class="page-header-main">
                    ${icon ? html`<div class="api-icon ${color} page-header-icon"><i class="bi ${icon}"></i></div>` : ""}
                    <div class="page-header-text">
                        ${eyebrow ? html`<div class="eyebrow">${eyebrow}</div>` : ""}
                        <h1>${title}</h1>
                        ${description ? html`<p>${description}</p>` : ""}
                    </div>
                    ${actions ? html`<div class="page-header-actions">${actions}</div>` : ""}
                </div>
            </header>`;

    }

    function emptyState(icon, title, message = "") {

        return html`
            <div class="empty-state">
                <i class="bi ${icon}"></i>
                <strong>${title}</strong>
                ${message ? html`<span>${message}</span>` : ""}
            </div>`;

    }

    function errorState(message = "Please try again in a moment.") {

        return html`
            <div class="empty-state response-state error">
                <i class="bi bi-exclamation-octagon"></i>
                <strong>Couldn't load this section</strong>
                <span>${message}</span>
            </div>`;

    }

    function skeletonCards(count = 6, className = "media-grid") {

        return raw(`<div class="${className}" aria-hidden="true">${Array.from({ length: count }, () => `
            <div class="card media-card is-skeleton">
                <span class="skeleton media-card-img"></span>
                <div class="media-card-body">
                    <span class="skeleton skeleton-text" style="width:70%"></span>
                    <span class="skeleton skeleton-text" style="width:45%"></span>
                </div>
            </div>`).join("")}</div>`);

    }

    function skeletonList(count = 5) {

        return raw(`<div class="list-skeleton" aria-hidden="true">${Array.from({ length: count }, () => `
            <div class="list-skeleton-row">
                <span class="skeleton" style="width:44px;height:44px;border-radius:10px"></span>
                <div style="flex:1">
                    <span class="skeleton skeleton-text" style="width:60%"></span>
                    <span class="skeleton skeleton-text" style="width:35%"></span>
                </div>
            </div>`).join("")}</div>`);

    }

    function section(title, body, { actions = "", id = "", description = "" } = {}) {

        return html`
            <section class="card panel" ${id ? raw(`id="${esc(id)}"`) : ""}>
                <div class="panel-header">
                    <div>
                        <h2>${title}</h2>
                        ${description ? html`<p>${description}</p>` : ""}
                    </div>
                    ${actions}
                </div>
                <div class="panel-body">${body}</div>
            </section>`;

    }


    // -----------------------------------------------------------------
    // Dialog (reuses the design-system .modal + UI.openModal)
    // -----------------------------------------------------------------

    let dialogCount = 0;

    function openDialog({ title, body, size = "md", footer = "", onClose }) {

        const id = `kitDialog${++dialogCount}`;

        const backdrop = toNode(html`
            <div class="modal-backdrop" id="${id}" hidden>
                <div class="modal kit-dialog kit-dialog-${size}" role="dialog" aria-modal="true" aria-labelledby="${id}Title">
                    <div class="modal-header">
                        <h2 class="modal-title" id="${id}Title">${title}</h2>
                        <button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Close" data-close-modal>
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="modal-body kit-dialog-body"></div>
                    ${footer ? html`<div class="modal-footer">${footer}</div>` : ""}
                </div>
            </div>`);

        const bodyEl = backdrop.querySelector(".kit-dialog-body");

        if (body instanceof Node) {
            bodyEl.appendChild(body);
        } else {
            bodyEl.innerHTML = String(body || "");
        }

        document.body.appendChild(backdrop);

        // Remove from the DOM once closed (backdrop click, Esc, close button).
        const observer = new MutationObserver(() => {

            if (backdrop.hidden) {
                observer.disconnect();
                backdrop.remove();
                if (onClose) onClose();
            }

        });

        observer.observe(backdrop, { attributes: true, attributeFilter: ["hidden"] });

        UI.openModal(id);

        return {
            element: backdrop,
            body: bodyEl,
            close: () => UI.closeModal(id)
        };

    }

    function openVideo(title, url) {

        const embed = videoEmbed(url);

        if (embed.type !== "iframe") {

            const link = safeUrl(url);

            if (link) {
                window.open(link, "_blank", "noopener");
            } else {
                UI.toast("This resource has no playable link", { type: "warning" });
            }

            return;

        }

        openDialog({
            title,
            size: "lg",
            body: html`<div class="video-frame"><iframe src="${embed.content}" title="${title}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`
        });

    }


    // -----------------------------------------------------------------
    // Data table: search, sort, pagination
    //
    // columns: [{ key, title, render(row) -> html, sortValue(row), className }]
    // -----------------------------------------------------------------

    function dataTable(container, { columns, rows, pageSize = 10, searchKeys, searchPlaceholder = "Search...", emptyText = "No records found.", initialSort }) {

        const state = {
            query: "",
            page: 0,
            sortKey: initialSort?.key || null,
            sortDir: initialSort?.dir || "asc"
        };

        container.innerHTML = String(html`
            <div class="kit-table">
                <div class="kit-table-toolbar">
                    <div class="input-group kit-table-search">
                        <i class="bi bi-search"></i>
                        <input type="search" class="input" placeholder="${searchPlaceholder}" aria-label="${searchPlaceholder}">
                    </div>
                    <span class="kit-table-count text-muted"></span>
                </div>
                <div class="kit-table-scroll"><table class="data-table"><thead></thead><tbody></tbody></table></div>
                <div class="kit-table-footer">
                    <span class="kit-table-range text-muted"></span>
                    <div class="kit-table-pager">
                        <button type="button" class="btn btn-secondary btn-sm" data-page="prev" aria-label="Previous page"><i class="bi bi-chevron-left"></i></button>
                        <button type="button" class="btn btn-secondary btn-sm" data-page="next" aria-label="Next page"><i class="bi bi-chevron-right"></i></button>
                    </div>
                </div>
            </div>`);

        const thead = container.querySelector("thead");
        const tbody = container.querySelector("tbody");
        const search = container.querySelector("input");

        const sortValue = (row, column) =>
            column.sortValue ? column.sortValue(row) : row[column.key];

        const textOf = row => (searchKeys || columns.map(c => c.key))
            .map(key => typeof key === "function" ? key(row) : row[key])
            .join(" ")
            .toLowerCase();

        function draw() {

            let list = rows;

            if (state.query) {
                list = list.filter(row => textOf(row).includes(state.query));
            }

            if (state.sortKey) {

                const column = columns.find(c => c.key === state.sortKey);

                list = [...list].sort((a, b) => {

                    const va = sortValue(a, column);
                    const vb = sortValue(b, column);

                    if (va === vb) return 0;
                    if (va === undefined || va === null || va === "") return 1;
                    if (vb === undefined || vb === null || vb === "") return -1;

                    const result = va > vb ? 1 : -1;

                    return state.sortDir === "asc" ? result : -result;

                });

            }

            const pages = Math.max(1, Math.ceil(list.length / pageSize));

            state.page = Math.min(state.page, pages - 1);

            const start = state.page * pageSize;
            const visible = list.slice(start, start + pageSize);

            thead.innerHTML = String(html`<tr>${columns.map(c => html`
                <th class="${c.className || ""}" ${c.sortable === false ? "" : raw(`data-sort="${esc(c.key)}" aria-sort="${state.sortKey === c.key ? (state.sortDir === "asc" ? "ascending" : "descending") : "none"}"`)}>
                    ${c.title}${c.sortable === false ? "" : html` <i class="bi ${state.sortKey === c.key ? (state.sortDir === "asc" ? "bi-caret-up-fill" : "bi-caret-down-fill") : "bi-chevron-expand"}"></i>`}
                </th>`)}</tr>`);

            tbody.innerHTML = visible.length
                ? visible.map(row => String(html`<tr>${columns.map(c => html`<td class="${c.className || ""}">${c.render ? c.render(row) : (row[c.key] ?? "")}</td>`)}</tr>`)).join("")
                : `<tr><td class="kit-table-empty" colspan="${columns.length}">${esc(emptyText)}</td></tr>`;

            container.querySelector(".kit-table-count").textContent =
                `${list.length} record${list.length === 1 ? "" : "s"}`;

            container.querySelector(".kit-table-range").textContent = list.length
                ? `Showing ${start + 1}–${start + visible.length} of ${list.length}`
                : "";

            container.querySelector('[data-page="prev"]').disabled = state.page === 0;
            container.querySelector('[data-page="next"]').disabled = state.page >= pages - 1;

        }

        search.addEventListener("input", () => {
            state.query = search.value.trim().toLowerCase();
            state.page = 0;
            draw();
        });

        thead.addEventListener("click", event => {

            const th = event.target.closest("[data-sort]");

            if (!th) return;

            const key = th.dataset.sort;

            state.sortDir = state.sortKey === key && state.sortDir === "asc" ? "desc" : "asc";
            state.sortKey = key;

            draw();

        });

        container.querySelector('[data-page="prev"]').addEventListener("click", () => { state.page--; draw(); });
        container.querySelector('[data-page="next"]').addEventListener("click", () => { state.page++; draw(); });

        draw();

        return {
            setRows(next) { rows = next; state.page = 0; draw(); }
        };

    }


    // -----------------------------------------------------------------
    // Maps (js/map-kit.js, Leaflet). The git code used Google Maps with
    // a key restricted to the production domain.
    // -----------------------------------------------------------------

    // points: [{ id, lat, lng, title, info (html string) }]
    // -> { map, markers: [{ point, marker }] } or null
    async function renderMap(element, points, { zoom = 6, satellite = false } = {}) {

        const valid = points.filter(p => MapKit.validPoint(p.lat, p.lng));

        if (!valid.length) {
            element.innerHTML = String(emptyState("bi-geo-alt", "No locations to show", "None of these records have map coordinates."));
            return null;
        }

        element.innerHTML = String(html`<div class="map-loading"><span class="spinner"></span> Loading map…</div>`);

        try {

            const L = await MapKit.load();
            const map = await MapKit.create(element, { satellite, scrollWheelZoom: false });
            const group = valid.length > 12 ? MapKit.clusterGroup(L) : L.featureGroup();

            const markers = valid.map(point => {

                const marker = L.marker([MapKit.toNumber(point.lat), MapKit.toNumber(point.lng)], {
                    icon: MapKit.pin(L, { label: point.title || "" }),
                    title: point.title || "",
                    riseOnHover: true
                });

                if (point.info) marker.bindPopup(String(point.info), { className: "mapkit-popup", maxWidth: 300 });

                group.addLayer(marker);

                return { point, marker };

            });

            group.addTo(map);

            if (valid.length === 1) {
                map.setView(markers[0].marker.getLatLng(), zoom > 6 ? zoom : 12);
            } else {
                map.fitBounds(L.featureGroup(markers.map(m => m.marker)).getBounds(), { padding: [32, 32], maxZoom: 12 });
            }

            return { map, markers };

        } catch (error) {

            console.warn("Map failed to load:", error);
            element.innerHTML = String(emptyState("bi-map", "Map unavailable", "The map could not be loaded. Please check your connection."));

            return null;

        }

    }


    window.Kit = {
        FALLBACK_IMAGE,
        esc,
        raw,
        html,
        toNode,
        multiline,
        safeUrl,
        fileUrl,
        toDate,
        formatDate,
        startOfToday,
        isOngoing,
        initials,
        videoEmbed,
        img,
        pageHeader,
        emptyState,
        errorState,
        skeletonCards,
        skeletonList,
        section,
        openDialog,
        openVideo,
        dataTable,
        renderMap
    };

})();
