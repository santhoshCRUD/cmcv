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
 * The map (js/map-kit.js, Leaflet) replaces the git Google Map: list and
 * map side by side, clustered pins (network hospitals solid), a Map /
 * Satellite switch, popups with the key facts and directions, distance
 * from CMC Vellore, and "Near me" sorting.
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

    const isGuest = user => (user.roles || []).includes("VConnect Guest");

    const hasCoords = h => h.hospitalLatitude && h.hospitalLongitude &&
        !isNaN(parseFloat(h.hospitalLatitude)) && !isNaN(parseFloat(h.hospitalLongitude));

    const isNetwork = h => h.hospitalCredentialed === true && h.mnwHospital === true;

    function stateOf(hospital) {

        const pincode = parseInt(hospital.hospitalPincode, 10);

        // Ranges overlap (e.g. Uttarakhand lies inside Uttar Pradesh's):
        // narrowest range first, so it names the state best.
        return Object.keys(STATE_PINCODES).filter(state => {
            const [min, max] = STATE_PINCODES[state];
            return pincode >= min && pincode <= max;
        }).sort((a, b) => (STATE_PINCODES[a][1] - STATE_PINCODES[a][0]) - (STATE_PINCODES[b][1] - STATE_PINCODES[b][0]));

    }


    // -----------------------------------------------------------------
    // List + map explorer
    // -----------------------------------------------------------------

    const LAYOUT_KEY = "cmcv.hospitals.layout";

    function savedLayout() {
        try { return localStorage.getItem(LAYOUT_KEY) || "map"; } catch (error) { return "map"; }
    }

    function saveLayout(value) {
        try { localStorage.setItem(LAYOUT_KEY, value); } catch (error) { /* private mode */ }
    }

    const stateLabel = h => (h.hospitalState && String(h.hospitalState).trim()) || stateOf(h)[0] || "";

    async function renderList(view, { user }) {

        const guest = isGuest(user);
        let layout = savedLayout();

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "Missions",
                title: "Mission Hospitals",
                icon: "bi-hospital",
                color: "purple",
                description: "CMC’s mission hospital network comprises around 200 hospitals across the country, primarily serving rural and underserved regions. In many of these areas, these hospitals are the only source of accessible, affordable and dependable healthcare."
            })}
            <div class="hx-stats" id="hxStats">${[1, 2, 3, 4].map(() => html`<div class="hx-stat skeleton"></div>`)}</div>
            <div class="toolbar hx-toolbar">
                <div class="input-group toolbar-search-wide">
                    <i class="bi bi-search"></i>
                    <input type="search" class="input" id="hospitalSearch" placeholder="Search by hospital or state…" aria-label="Search hospitals">
                </div>
                <div class="hx-quick" role="group" aria-label="Quick filters">
                    <button type="button" class="status-chip" data-quick="network" aria-pressed="false"><i class="bi bi-patch-check"></i> Network</button>
                    ${!guest ? html`<button type="button" class="status-chip" data-quick="needs" aria-pressed="false"><i class="bi bi-person-plus"></i> Needs staff</button>` : ""}
                </div>
                <div class="dropdown" id="hospitalFilters">
                    <button type="button" class="btn btn-secondary" aria-haspopup="true" aria-expanded="false" id="hospitalFilterBtn">
                        <i class="bi bi-sliders"></i> Filters <span class="badge badge-accent hidden" id="filterCount"></span>
                    </button>
                    <div class="dropdown-menu filter-menu" id="filterMenu"></div>
                </div>
                <div class="segmented-toggle" role="group" aria-label="Layout">
                    <button type="button" class="${layout === "map" ? "is-active" : ""}" data-layout="map"><i class="bi bi-map"></i> Map</button>
                    <button type="button" class="${layout === "grid" ? "is-active" : ""}" data-layout="grid"><i class="bi bi-grid"></i> Tiles</button>
                </div>
            </div>
            <p class="hx-count text-muted" id="hxCount" aria-live="polite"></p>
            <div id="hospitalExplorer" class="hx ${layout === "map" ? "" : "hidden"}">
                <aside class="hx-list card" aria-label="Hospitals">
                    <div class="hx-list-head">
                        <strong>Hospitals</strong>
                        <span class="hx-list-actions">
                            <button type="button" class="btn btn-ghost btn-sm" id="hxNearMe"><i class="bi bi-crosshair"></i> Near me</button>
                            <button type="button" class="btn btn-ghost btn-sm" id="hxFit" title="Show all hospitals on the map"><i class="bi bi-fullscreen"></i> Show all</button>
                        </span>
                    </div>
                    <ul class="hx-rows" id="hxRows">${[1, 2, 3, 4, 5, 6].map(() => html`<li class="hx-row"><span class="hx-thumb skeleton"></span><span class="skeleton skeleton-text"></span></li>`)}</ul>
                </aside>
                <div class="hx-map card">
                    <div id="hospitalMap" class="hx-canvas"><div class="map-loading"><span class="spinner"></span> Loading map…</div></div>
                    <div class="hx-legend">
                        <span><span class="mapkit-dot mapkit-dot-solid"></span> Network hospital</span>
                        <span><span class="mapkit-dot mapkit-dot-outline"></span> Other mission hospital</span>
                        <span><span class="mapkit-dot mapkit-dot-hub"></span> CMC Vellore</span>
                    </div>
                </div>
            </div>
            <div id="hospitalCards" class="${layout === "grid" ? "" : "hidden"}">${skeletonCards(8)}</div>`);

        // loadHospitalIdsAndMap -> loadMap('contactMap', ids)
        const idRows = await ConnectAPI.rows({
            collection: "MissionHospital",
            query: { isDeleted: "false" },
            options: { projection: { _id: 1, missionHospitalName: 1 } }
        }).catch(() => []);

        const hospIds = idRows.map(h => h._id);

        const results = await ConnectAPI.fetchMany([
            { collection: "MissionHospital", query: { _id: { $in: hospIds }, isDeleted: "false" }, projection: HOSPITAL_PROJECTION },
            { collection: "MissionDepartments", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } },
            { collection: "MissionRequests", query: { isDeleted: "false", missionStatus: { $in: ["Open", "InProgress"] } }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1 } },
            { collection: "MissionSpecializations", query: { isDeleted: "false" }, projection: { _id: 1, name: 1 } }
        ]);

        if (results.MissionHospital.error) {
            view.querySelector("#hxStats").innerHTML = "";
            view.querySelector("#hospitalExplorer").classList.add("hidden");
            view.querySelector("#hospitalCards").classList.remove("hidden");
            view.querySelector("#hospitalCards").innerHTML = String(errorState(results.MissionHospital.error));
            return;
        }

        const hospitals = (results.MissionHospital.data || []).filter(hasCoords);
        const requests = results.MissionRequests.data || [];
        const specializations = results.MissionSpecializations.data || [];

        const openNeeds = new Map();
        requests.forEach(r => openNeeds.set(r.missionHospitalId, (openNeeds.get(r.missionHospitalId) || 0) + 1));
        const needsOf = h => openNeeds.get(h._id) || 0;

        const filters = { states: new Set(), departments: new Set(), manpower: new Set(), text: "", network: false, needs: false };
        let origin = null;          // "Near me" position
        let selectedId = null;

        // ---- stats

        const states = new Set(hospitals.map(stateLabel).filter(Boolean));
        const beds = hospitals.reduce((sum, h) => sum + (parseInt(h.hospitalBedStrength, 10) || 0), 0);

        const stat = (icon, value, label) => html`<div class="hx-stat"><i class="bi ${icon}"></i><div><strong>${value}</strong><span>${label}</span></div></div>`;

        view.querySelector("#hxStats").innerHTML = hospitals.length ? String(html`
            ${stat("bi-hospital", hospitals.length, "Mission hospitals")}
            ${stat("bi-patch-check", hospitals.filter(isNetwork).length, "In the CMC network")}
            ${stat("bi-geo", states.size, states.size === 1 ? "State" : "States")}
            ${!guest && requests.length ? stat("bi-person-plus", requests.length, "Open staff requests") : beds ? stat("bi-hospital", beds.toLocaleString("en-IN"), "Beds") : ""}`) : "";

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

        // ---- tiles

        const cardsEl = view.querySelector("#hospitalCards");

        cardsEl.innerHTML = hospitals.length
            ? String(html`<div class="media-grid" id="hospitalGrid">${hospitals.map(h => hospitalCard(h, guest))}</div>
                <div id="hospitalEmpty" class="hidden">${emptyState("bi-funnel", "No hospitals match these filters", "Clear a filter to see more hospitals.")}</div>`)
            : String(emptyState("bi-hospital", "No hospitals found", "Hospital locations will appear here once they are available."));

        // ---- list rows

        const rowsEl = view.querySelector("#hxRows");

        const rowHtml = h => {
            const image = (h.hospitalImages || [])[0]?.url;
            const needs = needsOf(h);
            const km = origin ? MapKit.distanceKm(origin, { lat: +h.hospitalLatitude, lng: +h.hospitalLongitude }) : null;
            return html`
                <li class="hx-row" data-row="${h._id}" tabindex="0" role="button" aria-label="${h.missionHospitalName}">
                    <span class="hx-thumb"><i class="bi bi-hospital"></i>${image ? html`<img src="${image}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>
                    <span class="hx-row-body">
                        <strong>${h.missionHospitalName || "Hospital"}</strong>
                        <span class="hx-row-meta">${[stateLabel(h), km !== null ? `${MapKit.formatKm(km)} away` : "", !guest && h.hospitalBedStrength ? `${h.hospitalBedStrength} beds` : ""].filter(Boolean).join(" · ")}</span>
                        <span class="hx-row-tags">
                            ${isNetwork(h) ? html`<span class="hx-tag hx-tag-network"><i class="bi bi-patch-check-fill"></i> Network</span>` : ""}
                            ${!guest && needs ? html`<span class="hx-tag hx-tag-needs"><i class="bi bi-person-plus"></i> ${needs} open ${needs === 1 ? "need" : "needs"}</span>` : ""}
                        </span>
                    </span>
                    <i class="bi bi-chevron-right hx-row-go"></i>
                </li>`;
        };

        function renderRows(list) {
            rowsEl.innerHTML = list.length
                ? String(html`${list.map(rowHtml)}`)
                : String(html`<li class="hx-empty">${emptyState(hospitals.length ? "bi-funnel" : "bi-hospital", hospitals.length ? "No hospitals match" : "No hospitals found", hospitals.length ? "Clear a filter to see more." : "")}</li>`);
            if (selectedId) rowsEl.querySelector(`[data-row="${CSS.escape(String(selectedId))}"]`)?.classList.add("is-selected");
        }

        // ---- filtering

        function matches(h) {

            if (filters.text) {
                const hay = `${h.missionHospitalName || ""} ${stateLabel(h)} ${h.hospitalPincode || ""}`.toLowerCase();
                if (!hay.includes(filters.text)) return false;
            }

            if (filters.network && !isNetwork(h)) return false;
            if (filters.needs && !needsOf(h)) return false;

            if (filters.states.size && !stateOf(h).some(s => filters.states.has(s)) && !filters.states.has(stateLabel(h))) return false;

            if (filters.departments.size && !(h.hospitalDepartments || []).some(d => filters.departments.has(String(d.missionDepartmentDocId)))) return false;

            if (filters.manpower.size && !requests.some(r => r.missionHospitalId === h._id && filters.manpower.has(String(r.specializationId)))) return false;

            return true;

        }

        let mapState = null;

        function visibleList() {
            const list = hospitals.filter(matches);
            if (origin) {
                const d = h => MapKit.distanceKm(origin, { lat: +h.hospitalLatitude, lng: +h.hospitalLongitude });
                list.sort((a, b) => d(a) - d(b));
            }
            return list;
        }

        function apply({ fit = false } = {}) {

            const list = visibleList();
            const shown = new Set(list.map(h => h._id));

            hospitals.forEach(h => {
                const card = cardsEl.querySelector(`[data-hospital="${CSS.escape(String(h._id))}"]`);
                if (card) card.hidden = !shown.has(h._id);
            });

            view.querySelector("#hospitalEmpty")?.classList.toggle("hidden", list.length > 0 || !hospitals.length);

            renderRows(list);

            if (mapState) {
                mapState.cluster.clearLayers();
                mapState.cluster.addLayers(list.map(h => mapState.markers.get(h._id)).filter(Boolean));
                if (fit) fitTo(list);
            }

            const active = filters.states.size + filters.departments.size + filters.manpower.size;
            const badge = view.querySelector("#filterCount");

            badge.textContent = active;
            badge.classList.toggle("hidden", !active);

            view.querySelector("#hxCount").textContent = hospitals.length
                ? (list.length === hospitals.length ? `Showing all ${hospitals.length} hospitals` : `Showing ${list.length} of ${hospitals.length} hospitals`)
                : "";

        }

        // ---- map

        function popupHtml(h) {
            const image = (h.hospitalImages || [])[0]?.url;
            const lat = +h.hospitalLatitude, lng = +h.hospitalLongitude;
            const fromCmc = MapKit.distanceKm(MapKit.CMC, { lat, lng });
            const needs = needsOf(h);
            const website = safeUrl(h.hospitalWebsite);
            return String(html`
                <div class="hx-pop">
                    ${image ? html`<div class="hx-pop-img"><img src="${image}" alt="${h.missionHospitalName || ""}" onerror="this.parentElement.remove()"></div>` : ""}
                    <div class="hx-pop-body">
                        ${isNetwork(h) ? html`<span class="hx-tag hx-tag-network"><i class="bi bi-patch-check-fill"></i> Network hospital</span>` : ""}
                        <h4>${h.missionHospitalName || "Hospital"}</h4>
                        <p class="hx-pop-meta">${[stateLabel(h), `${MapKit.formatKm(fromCmc)} from CMC Vellore`].filter(Boolean).join(" · ")}</p>
                        ${!guest ? html`
                            <ul class="hx-pop-facts">
                                ${h.hospitalBedStrength ? html`<li><i class="bi bi-hospital"></i> ${h.hospitalBedStrength} beds</li>` : ""}
                                ${(h.hospitalDepartments || []).length ? html`<li><i class="bi bi-diagram-3"></i> ${h.hospitalDepartments.length} departments</li>` : ""}
                                ${needs ? html`<li class="is-needs"><i class="bi bi-person-plus"></i> ${needs} open staff ${needs === 1 ? "request" : "requests"}</li>` : ""}
                                ${h.hospitalPhone ? html`<li><i class="bi bi-telephone"></i> <a href="tel:${h.hospitalPhone}">${h.hospitalPhone}</a></li>` : ""}
                            </ul>` : ""}
                        <div class="hx-pop-actions">
                            ${!guest ? html`<a class="btn btn-primary btn-sm" href="#/hospitals/${encodeURIComponent(h._id)}">View details</a>` : ""}
                            <a class="btn btn-secondary btn-sm" href="${MapKit.directionsUrl(lat, lng)}" target="_blank" rel="noopener"><i class="bi bi-sign-turn-right"></i> Directions</a>
                            ${website ? html`<a class="btn btn-ghost btn-sm btn-icon" href="${website}" target="_blank" rel="noopener" aria-label="Website"><i class="bi bi-globe"></i></a>` : ""}
                        </div>
                    </div>
                </div>`);
        }

        function fitTo(list) {
            if (!mapState) return;
            const points = list.map(h => [+h.hospitalLatitude, +h.hospitalLongitude]);
            if (!points.length) return;
            if (points.length === 1) mapState.map.flyTo(points[0], 10, { duration: 0.8 });
            else mapState.map.flyToBounds(points, { paddingTopLeft: [40, 80], paddingBottomRight: [40, 40], maxZoom: 9, duration: 0.8 });
        }

        async function ensureMap() {

            if (mapState || !hospitals.length) {
                if (!hospitals.length) view.querySelector("#hospitalMap").innerHTML = String(emptyState("bi-map", "No hospital locations yet", "Hospitals with map coordinates will appear here."));
                return;
            }

            try {

                const L = await MapKit.load();
                const map = await MapKit.create(view.querySelector("#hospitalMap"));
                const cluster = MapKit.clusterGroup(L);
                const markers = new Map();

                hospitals.forEach(h => {

                    const marker = L.marker([+h.hospitalLatitude, +h.hospitalLongitude], {
                        icon: MapKit.pin(L, { variant: isNetwork(h) ? "solid" : "outline", label: h.missionHospitalName || "" }),
                        title: h.missionHospitalName || "",
                        riseOnHover: true
                    });

                    marker.bindPopup(() => popupHtml(h), { className: "mapkit-popup", maxWidth: 300, minWidth: 260, autoPanPadding: [40, 40] });
                    marker.on("click", () => select(h._id, { fly: false }));

                    markers.set(h._id, marker);

                });

                // CMC Vellore hub, and a line to the selected hospital.
                L.marker([MapKit.CMC.lat, MapKit.CMC.lng], { icon: MapKit.hubIcon(L), zIndexOffset: 1000, title: MapKit.CMC.name })
                    .bindPopup(String(html`<div class="hx-pop"><div class="hx-pop-body"><h4>CMC Vellore</h4><p class="hx-pop-meta">Christian Medical College, Vellore - the hub of the mission hospital network.</p></div></div>`), { className: "mapkit-popup" })
                    .addTo(map);

                const link = L.polyline([], { className: "hx-link", weight: 2, dashArray: "6 8", interactive: false }).addTo(map);

                map.addLayer(cluster);

                mapState = { L, map, cluster, markers, link };

                apply();
                fitTo(hospitals);

            } catch (error) {
                console.warn("Map failed to load:", error);
                view.querySelector("#hospitalMap").innerHTML = String(emptyState("bi-map", "Map unavailable", "The map could not be loaded. Please check your connection - the list and tiles still work."));
            }

        }

        function select(id, { fly = true } = {}) {

            selectedId = id;

            rowsEl.querySelectorAll(".is-selected").forEach(r => r.classList.remove("is-selected"));
            const row = rowsEl.querySelector(`[data-row="${CSS.escape(String(id))}"]`);
            row?.classList.add("is-selected");
            row?.scrollIntoView({ block: "nearest", behavior: "smooth" });

            if (!mapState) return;

            const h = hospitals.find(x => x._id === id);
            const marker = mapState.markers.get(id);

            if (!h || !marker) return;

            const target = [+h.hospitalLatitude, +h.hospitalLongitude];

            mapState.link.setLatLngs([[MapKit.CMC.lat, MapKit.CMC.lng], target]);

            if (fly) {
                mapState.cluster.zoomToShowLayer(marker, () => {
                    mapState.map.flyTo(target, Math.max(mapState.map.getZoom(), 10), { duration: 0.8 });
                    mapState.map.once("moveend", () => marker.openPopup());
                });
            }

        }

        function highlight(id, on) {
            const el = mapState?.markers.get(id)?.getElement();
            el?.classList.toggle("is-hover", on);
        }

        // ---- events

        rowsEl.addEventListener("click", event => {
            const row = event.target.closest("[data-row]");
            if (row) select(row.dataset.row);
        });

        rowsEl.addEventListener("keydown", event => {
            const row = event.target.closest("[data-row]");
            if (row && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                select(row.dataset.row);
            }
        });

        rowsEl.addEventListener("mouseover", event => {
            const row = event.target.closest("[data-row]");
            if (row) highlight(row.dataset.row, true);
        });

        rowsEl.addEventListener("mouseout", event => {
            const row = event.target.closest("[data-row]");
            if (row) highlight(row.dataset.row, false);
        });

        let searchTimer = null;

        view.querySelector("#hospitalSearch").addEventListener("input", event => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                filters.text = event.target.value.trim().toLowerCase();
                apply({ fit: true });
            }, 150);
        });

        view.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => {
            const key = button.dataset.quick;
            filters[key] = !filters[key];
            button.setAttribute("aria-pressed", String(filters[key]));
            apply({ fit: true });
        }));

        view.querySelector("#filterMenu").addEventListener("change", event => {

            const box = event.target.closest("[data-filter]");

            if (!box) return;

            const set = filters[box.dataset.filter];

            if (box.checked) set.add(box.value); else set.delete(box.value);

            apply({ fit: true });

        });

        view.querySelector("#clearFilters").addEventListener("click", () => {
            view.querySelectorAll("[data-filter]").forEach(box => { box.checked = false; });
            filters.states.clear(); filters.departments.clear(); filters.manpower.clear();
            apply({ fit: true });
        });

        view.querySelector("#hospitalFilterBtn").addEventListener("click", () => UI.toggleDropdown("hospitalFilters"));

        view.querySelector("#hxFit").addEventListener("click", () => fitTo(visibleList()));

        view.querySelector("#hxNearMe").addEventListener("click", event => {

            const button = event.currentTarget;

            if (!navigator.geolocation) {
                UI.toast("Location isn’t available in this browser", { type: "warning" });
                return;
            }

            UI.setLoading?.(button, true);

            navigator.geolocation.getCurrentPosition(position => {

                UI.setLoading?.(button, false);

                origin = { lat: position.coords.latitude, lng: position.coords.longitude };

                if (mapState) {
                    mapState.you?.remove();
                    mapState.you = mapState.L.circleMarker([origin.lat, origin.lng], { radius: 8, className: "hx-you", weight: 3 })
                        .bindTooltip("You are here", { direction: "top" }).addTo(mapState.map);
                }

                apply();

                const nearest = visibleList()[0];
                if (nearest) select(nearest._id);

                UI.toast("Sorted by distance from you", { type: "success" });

            }, () => {
                UI.setLoading?.(button, false);
                UI.toast("Couldn’t get your location", { type: "warning", message: "Allow location access in your browser to sort hospitals by distance." });
            }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });

        });

        // ---- map / tiles layout

        view.querySelectorAll("[data-layout]").forEach(button => button.addEventListener("click", () => {

            layout = button.dataset.layout;
            saveLayout(layout);

            view.querySelectorAll("[data-layout]").forEach(b => b.classList.toggle("is-active", b === button));
            view.querySelector("#hospitalExplorer").classList.toggle("hidden", layout !== "map");
            cardsEl.classList.toggle("hidden", layout !== "grid");

            if (layout === "map") ensureMap();

        }));

        apply();

        if (layout === "map") ensureMap();

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

        const lat = MapKit.toNumber(h.hospitalLatitude), lng = MapKit.toNumber(h.hospitalLongitude);
        const located = MapKit.validPoint(lat, lng);
        const location = html`
            <div class="hx-location">
                <p class="text-muted map-caption">${[h.hospitalPincode ? `Pincode ${h.hospitalPincode}` : "", located ? `${MapKit.formatKm(MapKit.distanceKm(MapKit.CMC, { lat, lng }))} from CMC Vellore` : ""].filter(Boolean).join(" · ")}</p>
                ${located ? html`<a class="btn btn-secondary btn-sm" href="${MapKit.directionsUrl(lat, lng)}" target="_blank" rel="noopener"><i class="bi bi-sign-turn-right"></i> Directions</a>` : ""}
            </div>`;

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
                    ${section("Location", html`<div id="hospitalDetailMap" class="map-canvas map-small"></div>${location}`)}
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

        renderMap(view.querySelector("#hospitalDetailMap"), [{ lat: h.hospitalLatitude, lng: h.hospitalLongitude, title: name }], { zoom: 15, satellite: true });

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
