/**
 * Mission Hospitals
 *
 * Port of the "contact" page (git: loadHospitalIdsAndMap / loadMap /
 * generateHospitalCards in dynamicRender.js) and renderHospitalDetails
 * (app.js). Same collections, projections and filter rules:
 *   - only hospitals with coordinates are listed (hospitalsWithCoord)
 *   - state filter uses the git pincode ranges
 *   - department filter: hospital.hospitalDepartments[].missionDepartmentDocId
 *   - manpower filter: open / in-progress MissionRequests by specialization
 *   - VConnect Guest users see the list without contact details / Read more
 *
 * Routes: #/hospitals            list + map
 *         #/hospitals/<id>       hospital details
 */
(function () {

    const { html, raw, esc, img, fileUrl, safeUrl, emptyState, errorState, skeletonCards, pageHeader, section, renderMap, openDialog } = Kit;


    const STATE_PINCODES = {
        "Andhra Pradesh": [500001, 534999],
        "Assam": [781001, 788999],
        "Bihar": [800001, 854999],
        "Chhattisgarh": [490001, 497999],
        "Delhi": [110000, 110099],
        "Gujarat": [360001, 396999],
        "Haryana": [121001, 136999],
        "Himachal Pradesh": [171001, 177999],
        "Jharkhand": [815001, 834999],
        "Karnataka": [560001, 591999],
        "Kerala": [670001, 695999],
        "Madhya Pradesh": [450001, 488999],
        "Maharashtra": [400001, 444999],
        "Meghalaya": [793001, 794999],
        "Mizoram": [796001, 796999],
        "Nagaland": [797001, 798999],
        "Odisha": [751001, 770017],
        "Punjab": [140001, 160999],
        "Tamil Nadu": [600001, 643999],
        "Telangana": [500001, 509999],
        "Uttar Pradesh": [200001, 285999],
        "Uttarakhand": [244001, 263999],
        "West Bengal": [700001, 743999]
    };

    const HOSPITAL_PROJECTION = {
        _id: 1, missionHospitalName: 1, hospitalWebsite: 1, hospitalPincode: 1, hospitalDepartments: 1, mnwHospital: 1, hospitalCredentialed: 1,
        hospitalPhone: 1, hospitalEmail: 1, hospitalBedStrength: 1, hospitalLatitude: 1, hospitalLongitude: 1, hospitalState: 1,
        hospitalImages: { $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } } }
    };

    const HOSPITAL_ICON = "./images/cmc-logo-white-transparent.png";

    const isGuest = user => (user.roles || []).includes("VConnect Guest");

    const hasCoords = h => h.hospitalLatitude && h.hospitalLongitude &&
        !isNaN(parseFloat(h.hospitalLatitude)) && !isNaN(parseFloat(h.hospitalLongitude));

    const isNetwork = h => h.hospitalCredentialed === true && h.mnwHospital === true;

    function stateOf(hospital) {

        const pincode = parseInt(hospital.hospitalPincode, 10);

        return Object.keys(STATE_PINCODES).filter(state => {
            const [min, max] = STATE_PINCODES[state];
            return pincode >= min && pincode <= max;
        });

    }


    // -----------------------------------------------------------------
    // List
    // -----------------------------------------------------------------

    async function renderList(view, { user }) {

        const guest = isGuest(user);

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Missions",
                title: "Mission Hospitals",
                icon: "bi-hospital",
                color: "purple",
                description: "CMC’s mission hospital network comprises around 200 hospitals across the country, primarily serving rural and underserved regions. In many of these areas, these hospitals are the only source of accessible, affordable and dependable healthcare."
            })}
            <div class="toolbar">
                <div class="input-group toolbar-search-wide">
                    <i class="bi bi-search"></i>
                    <input type="search" class="input" id="hospitalSearch" placeholder="Search hospitals…" aria-label="Search hospitals">
                </div>
                <div class="dropdown" id="hospitalFilters">
                    <button type="button" class="btn btn-secondary" aria-haspopup="true" aria-expanded="false" id="hospitalFilterBtn">
                        <i class="bi bi-funnel"></i> Filters <span class="badge badge-accent hidden" id="filterCount"></span>
                    </button>
                    <div class="dropdown-menu filter-menu" id="filterMenu"></div>
                </div>
                <div class="segmented-toggle" role="group" aria-label="Layout">
                    <button type="button" class="is-active" data-layout="grid"><i class="bi bi-grid"></i> Tiles</button>
                    <button type="button" data-layout="map"><i class="bi bi-map"></i> Map</button>
                </div>
            </div>
            <div class="hospital-layout" id="hospitalLayout">
                <div class="hospital-map card hidden" id="hospitalMapWrap">
                    <div id="hospitalMap" class="map-canvas"></div>
                    <div class="map-legend">
                        <span><i class="bi bi-geo-alt-fill legend-network"></i> Network hospitals</span>
                        <span><i class="bi bi-geo-alt legend-other"></i> Non network hospitals</span>
                    </div>
                </div>
                <div id="hospitalCards">${skeletonCards(8)}</div>
            </div>`);

        // loadHospitalIdsAndMap -> loadMap('contactMap', ids)
        const idRows = await ConnectAPI.rows({
            collection: "MissionHospital",
            query: { isDeleted: "false" },
            options: { projection: { _id: 1, missionHospitalName: 1 } }
        });

        const hospIds = idRows.map(h => h._id);

        const results = await ConnectAPI.fetchMany([
            { collection: "MissionHospital", query: { _id: { $in: hospIds }, isDeleted: "false" }, projection: HOSPITAL_PROJECTION },
            { collection: "MissionDepartments", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } },
            { collection: "MissionRequests", query: { isDeleted: "false", missionStatus: { $in: ["Open", "InProgress"] } }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1 } },
            { collection: "MissionSpecializations", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } }
        ]);

        if (results.MissionHospital.error) {
            view.querySelector("#hospitalCards").innerHTML = String(errorState(results.MissionHospital.error));
            return;
        }

        const hospitals = (results.MissionHospital.data || []).filter(hasCoords);
        const requests = results.MissionRequests.data || [];
        const specializations = results.MissionSpecializations.data || [];

        const filters = { states: new Set(), departments: new Set(), manpower: new Set(), text: "" };

        // ---- filter options (same sources as populate*Filter in the git code)

        const departmentOptions = new Map();

        hospitals.forEach(h => (h.hospitalDepartments || []).forEach(d => {
            const id = String(d.missionDepartmentDocId || d._id || "");
            if (id) departmentOptions.set(id, d.missionDepartmentName || d.name || id);
        }));

        const manpowerCount = new Map();

        requests.forEach(r => {
            const id = String(r.specializationId || "").trim();
            if (id) manpowerCount.set(id, (manpowerCount.get(id) || 0) + 1);
        });

        const manpowerOptions = specializations
            .filter(s => manpowerCount.has(String(s._id)))
            .map(s => ({ id: String(s._id), label: `${s.name} (${manpowerCount.get(String(s._id))})` }));

        const filterGroup = (key, title, options) => options.length ? html`
            <details class="filter-group" ${key === "states" ? raw("open") : ""}>
                <summary>${title}</summary>
                <div class="filter-options">${options.map(o => html`
                    <label class="check"><input type="checkbox" data-filter="${key}" value="${o.id}"> <span>${o.label}</span></label>`)}</div>
            </details>` : "";

        view.querySelector("#filterMenu").innerHTML = String(html`
            ${filterGroup("states", "State", Object.keys(STATE_PINCODES).sort().map(s => ({ id: s, label: s })))}
            ${!guest ? filterGroup("departments", "Department", [...departmentOptions].sort((a, b) => a[1].localeCompare(b[1])).map(([id, label]) => ({ id, label }))) : ""}
            ${!guest ? filterGroup("manpower", "Manpower needs", manpowerOptions) : ""}
            <div class="filter-actions"><button type="button" class="btn btn-ghost btn-sm" id="clearFilters">Clear all</button></div>`);

        // ---- cards

        const cardsEl = view.querySelector("#hospitalCards");

        cardsEl.innerHTML = hospitals.length
            ? String(html`<div class="media-grid" id="hospitalGrid">${hospitals.map(h => hospitalCard(h, guest))}</div>
                <div id="hospitalEmpty" class="hidden">${emptyState("bi-funnel", "No hospitals match these filters", "Clear a filter to see more hospitals.")}</div>`)
            : String(emptyState("bi-hospital", "No hospitals found"));

        let mapState = null;

        function matches(h) {

            if (filters.text && !(h.missionHospitalName || "").toLowerCase().includes(filters.text)) return false;

            if (filters.states.size && !stateOf(h).some(s => filters.states.has(s))) return false;

            if (filters.departments.size && !(h.hospitalDepartments || []).some(d => filters.departments.has(String(d.missionDepartmentDocId)))) return false;

            if (filters.manpower.size && !requests.some(r => r.missionHospitalId === h._id && filters.manpower.has(String(r.specializationId)))) return false;

            return true;

        }

        function apply() {

            let visible = 0;

            hospitals.forEach(h => {

                const show = matches(h);
                const card = cardsEl.querySelector(`[data-hospital="${CSS.escape(String(h._id))}"]`);

                if (card) card.hidden = !show;
                if (show) visible++;

                const marker = mapState?.markers.find(m => m.point.id === h._id);
                if (marker) marker.marker.setMap(show ? mapState.map : null);

            });

            view.querySelector("#hospitalEmpty")?.classList.toggle("hidden", visible > 0);

            const active = filters.states.size + filters.departments.size + filters.manpower.size;
            const badge = view.querySelector("#filterCount");

            badge.textContent = active;
            badge.classList.toggle("hidden", !active);

        }

        view.querySelector("#hospitalSearch").addEventListener("input", event => {
            filters.text = event.target.value.trim().toLowerCase();
            apply();
        });

        view.querySelector("#filterMenu").addEventListener("change", event => {

            const box = event.target.closest("[data-filter]");

            if (!box) return;

            const set = filters[box.dataset.filter];

            if (box.checked) set.add(box.value); else set.delete(box.value);

            apply();

        });

        view.querySelector("#clearFilters").addEventListener("click", () => {
            view.querySelectorAll("[data-filter]").forEach(box => { box.checked = false; });
            filters.states.clear(); filters.departments.clear(); filters.manpower.clear();
            apply();
        });

        view.querySelector("#hospitalFilterBtn").addEventListener("click", () => UI.toggleDropdown("hospitalFilters"));

        // ---- tiles / map layout

        view.querySelectorAll("[data-layout]").forEach(button => button.addEventListener("click", async () => {

            const mapMode = button.dataset.layout === "map";

            view.querySelectorAll("[data-layout]").forEach(b => b.classList.toggle("is-active", b === button));
            view.querySelector("#hospitalLayout").classList.toggle("with-map", mapMode);
            view.querySelector("#hospitalMapWrap").classList.toggle("hidden", !mapMode);

            if (mapMode && !mapState) {

                mapState = await renderMap(view.querySelector("#hospitalMap"), hospitals.map(h => ({
                    id: h._id,
                    lat: h.hospitalLatitude,
                    lng: h.hospitalLongitude,
                    title: h.missionHospitalName,
                    info: String(html`<strong>${h.missionHospitalName}</strong><br>${isNetwork(h) ? "Network hospital" : "Non network hospital"}`)
                })));

                if (mapState) {

                    mapState.markers.forEach(({ point, marker }) => {

                        const h = hospitals.find(x => x._id === point.id);

                        if (!isNetwork(h)) {
                            marker.setOpacity(0.6);
                        }

                        marker.addListener("click", () => {
                            const card = cardsEl.querySelector(`[data-hospital="${CSS.escape(String(point.id))}"]`);
                            card?.scrollIntoView({ behavior: "smooth", block: "center" });
                            cardsEl.querySelectorAll(".is-highlighted").forEach(c => c.classList.remove("is-highlighted"));
                            card?.classList.add("is-highlighted");
                        });

                    });

                    apply();

                }

            }

        }));

    }

    function hospitalCard(h, guest) {

        const images = h.hospitalImages || [];
        const website = safeUrl(h.hospitalWebsite);

        return html`
            <article class="card media-card hospital-card" data-hospital="${h._id}">
                ${img(images[0]?.url, h.missionHospitalName, "media-card-img")}
                ${isNetwork(h) ? html`<span class="media-card-flag"><i class="bi bi-patch-check-fill"></i> Network</span>` : ""}
                <div class="media-card-body">
                    <h3>${h.missionHospitalName || "Hospital"}</h3>
                    ${!guest ? html`
                        <dl class="meta-list">
                            ${h.hospitalBedStrength ? html`<div><dt><i class="bi bi-hospital"></i> Beds</dt><dd>${h.hospitalBedStrength}</dd></div>` : ""}
                            ${h.hospitalPincode ? html`<div><dt><i class="bi bi-geo-alt"></i> Pincode</dt><dd>${h.hospitalPincode}</dd></div>` : ""}
                            ${h.hospitalEmail ? html`<div><dt><i class="bi bi-envelope"></i> Email</dt><dd><a href="mailto:${h.hospitalEmail}">${h.hospitalEmail}</a></dd></div>` : ""}
                        </dl>` : ""}
                </div>
                <div class="media-card-footer">
                    ${website ? html`<a class="btn btn-ghost btn-sm" href="${website}" target="_blank" rel="noopener"><i class="bi bi-globe"></i> Website</a>` : raw("<span></span>")}
                    ${!guest ? html`<a class="btn btn-secondary btn-sm" href="#/hospitals/${encodeURIComponent(h._id)}">Read more <i class="bi bi-arrow-right"></i></a>` : ""}
                </div>
            </article>`;

    }


    // -----------------------------------------------------------------
    // Details (renderHospitalDetails, "contactMap" / "conclaveHsptlMap")
    // -----------------------------------------------------------------

    async function renderDetails(view, id, { source = "mission", back = { href: "#/hospitals", label: "All hospitals" } } = {}) {

        view.innerHTML = String(html`${pageHeader({ title: "Loading hospital…", back })}${skeletonCards(3)}`);

        const collections = source === "conclave"
            ? [{ collection: "ConclaveHsptl", query: { _id: id, isDeleted: false } }]
            : [
                { collection: "MissionHospital", query: { _id: id, isDeleted: "false" } },
                { collection: "MissionRequests", query: { missionHospitalId: id, isDeleted: "false" }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1, missionStatus: 1, requestStatus: 1, requestType: 1, fromMsnHospDate: 1, toMsnHospDate: 1, misnExtupdateComments: 1 } },
                { collection: "MissionSpecializations", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } }
            ];

        const results = await ConnectAPI.fetchMany(collections);

        const missionData = results.MissionHospital?.data?.[0];
        const h = missionData || results.ConclaveHsptl?.data?.[0];

        if (!h) {
            view.innerHTML = String(html`${pageHeader({ title: "Hospital not found", back })}${emptyState("bi-hospital", "This hospital could not be found", "It may have been removed from the network.")}`);
            return;
        }

        const name = h.missionHospitalName || h.hospitalName || "Hospital";
        const images = (h.hospitalImages || []).map(i => i.url || i.data?.url).filter(Boolean);
        const departments = h.hospitalDepartments || [];
        const website = safeUrl(h.hospitalWebsite);
        const status = missionData ? (missionData.hospitalFunctional ? "Functional" : "Not functional") : "Functional";

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: source === "conclave" ? "Medical Colleges Conclave" : "Mission hospital", title: name, back, icon: "bi-hospital", color: "purple" })}
            <div class="stat-row-inline">
                <div class="card stat-card"><div class="stat-icon"><i class="bi bi-hospital"></i></div><div><div class="stat-label">Bed strength</div><div class="stat-value">${h.hospitalBedStrength || "Data not available"}</div></div></div>
                <div class="card stat-card"><div class="stat-icon"><i class="bi bi-activity"></i></div><div><div class="stat-label">Status</div><div class="stat-value">${status}</div></div></div>
                <div class="card stat-card"><div class="stat-icon"><i class="bi bi-diagram-3"></i></div><div><div class="stat-label">Departments</div><div class="stat-value">${departments.length || "—"}</div></div></div>
            </div>
            <div class="detail-grid">
                <div class="detail-main">
                    ${section(`About ${name}`, html`<p class="prose">${Kit.multiline(h.aboutHospital || "Details Awaited")}</p>`)}
                    ${section(`${name} departments`, departments.length
                        ? html`<ol class="plain-list">${departments.map(d => html`<li>${d.missionDepartmentName || d.name || "Name not available"}</li>`)}</ol>`
                        : emptyState("bi-diagram-3", "Details awaited"))}
                    ${section("Gallery", images.length
                        ? html`<div class="gallery">${images.map((url, i) => html`<button type="button" class="gallery-item" data-gallery="${i}">${img(url, `${name} photo ${i + 1}`)}</button>`)}</div>`
                        : emptyState("bi-images", "No photos yet"))}
                </div>
                <div class="detail-side">
                    ${section("Location", html`<div id="hospitalDetailMap" class="map-canvas map-small"></div>${h.hospitalPincode ? html`<p class="text-muted map-caption">Pincode ${h.hospitalPincode}</p>` : ""}`)}
                    ${section("Contact", html`
                        <ul class="contact-list">
                            <li><i class="bi bi-geo-alt"></i><span>${h.hospitalAddress || "Details Awaited"}</span></li>
                            <li><i class="bi bi-envelope"></i>${h.hospitalEmail ? html`<a href="mailto:${h.hospitalEmail}">${h.hospitalEmail}</a>` : html`<span>Details Awaited</span>`}</li>
                            ${h.hospitalPhone ? html`<li><i class="bi bi-telephone"></i><a href="tel:${h.hospitalPhone}">${h.hospitalPhone}</a></li>` : ""}
                            <li><i class="bi bi-globe"></i>${website ? html`<a href="${website}" target="_blank" rel="noopener">${h.hospitalWebsite}</a>` : html`<span>Website not available</span>`}</li>
                        </ul>`)}
                </div>
            </div>`);

        view.querySelectorAll("[data-gallery]").forEach(button => button.addEventListener("click", () => openGallery(name, images, Number(button.dataset.gallery))));

        renderMap(view.querySelector("#hospitalDetailMap"), [{ lat: h.hospitalLatitude, lng: h.hospitalLongitude, title: name }], { zoom: 16 });

    }

    function openGallery(name, images, start) {

        let index = start;

        const dialog = openDialog({
            title: name,
            size: "lg",
            body: html`
                <div class="lightbox">
                    <img alt="" class="lightbox-img">
                    ${images.length > 1 ? html`
                        <button type="button" class="btn btn-secondary btn-icon lightbox-prev" aria-label="Previous photo"><i class="bi bi-chevron-left"></i></button>
                        <button type="button" class="btn btn-secondary btn-icon lightbox-next" aria-label="Next photo"><i class="bi bi-chevron-right"></i></button>` : ""}
                    <p class="text-muted lightbox-count"></p>
                </div>`
        });

        const show = () => {
            dialog.body.querySelector(".lightbox-img").src = images[index];
            dialog.body.querySelector(".lightbox-count").textContent = `${index + 1} of ${images.length}`;
        };

        dialog.body.querySelector(".lightbox-prev")?.addEventListener("click", () => { index = (index - 1 + images.length) % images.length; show(); });
        dialog.body.querySelector(".lightbox-next")?.addEventListener("click", () => { index = (index + 1) % images.length; show(); });

        show();

    }


    App.register({
        id: "hospitals",
        title: "Mission Hospitals",
        icon: "bi-hospital",
        color: "purple",
        group: "Missions",
        description: "Explore ~200 mission hospitals on a map, filtered by state, department and manpower needs.",
        render(view, params, ctx) {
            return params[0]
                ? renderDetails(view, params[0])
                : renderList(view, ctx);
        }
    });

    window.HospitalViews = { renderDetails, hospitalCard, hasCoords };

})();
