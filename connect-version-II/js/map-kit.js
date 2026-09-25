/**
 * MapKit - maps for every module, on Leaflet (vendor/leaflet).
 *
 * Replaces the Google Maps script of the git code: its browser key only
 * works on the production domain, so maps never loaded anywhere else.
 * Leaflet needs no key; the base maps are free tile services:
 *   Map        CARTO Voyager (OpenStreetMap data)
 *   Satellite  Esri World Imagery, with CARTO place labels on top
 *
 * Exposed as window.MapKit. Kit.renderMap (ui-kit.js) is built on it.
 */
(function () {

    const BASE = "vendor/leaflet/";

    // CMC Vellore, the hub every mission hospital connects back to.
    const CMC = { lat: 12.9249, lng: 79.1353, name: "CMC Vellore" };

    const INDIA = { center: [22.5, 80], zoom: 5 };

    let loading = null;

    function addCss(href) {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function addScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Couldn't load ${src}`));
            document.head.appendChild(script);
        });
    }

    // Leaflet + clustering, once per page.
    function load() {

        if (window.L?.markerClusterGroup) return Promise.resolve(window.L);

        if (!loading) {

            addCss(`${BASE}leaflet.css`);
            addCss(`${BASE}MarkerCluster.css`);

            loading = addScript(`${BASE}leaflet.js`)
                .then(() => addScript(`${BASE}leaflet.markercluster.js`))
                .then(() => window.L)
                .catch(error => { loading = null; throw error; });

        }

        return loading;

    }

    function baseLayers(L) {

        const osm = "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a>";
        const carto = "&copy; <a href=\"https://carto.com/attributions\" target=\"_blank\" rel=\"noopener\">CARTO</a>";

        const map = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            subdomains: "abcd", maxZoom: 19, attribution: `${osm} ${carto}`
        });

        const satellite = L.layerGroup([
            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19, attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
            }),
            L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png", {
                subdomains: "abcd", maxZoom: 19, attribution: carto, pane: "overlayPane"
            })
        ]);

        return { map, satellite };

    }

    /**
     * A map in element with a Map / Satellite switch.
     * options: { center, zoom, satellite: bool, scrollWheelZoom }
     */
    async function create(element, options = {}) {

        const L = await load();

        element.innerHTML = "";
        element.classList.add("mapkit");

        const map = L.map(element, {
            center: options.center || INDIA.center,
            zoom: options.zoom || INDIA.zoom,
            zoomControl: false,
            scrollWheelZoom: options.scrollWheelZoom ?? true,
            worldCopyJump: true
        });

        L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

        const layers = baseLayers(L);
        let current = options.satellite ? "satellite" : "map";

        layers[current].addTo(map);

        // Minimal segmented switch instead of Leaflet's layer box.
        const Switch = L.Control.extend({
            options: { position: "topright" },
            onAdd() {
                const box = L.DomUtil.create("div", "mapkit-switch");
                box.innerHTML = `
                    <button type="button" data-layer="map" class="${current === "map" ? "is-active" : ""}"><i class="bi bi-map"></i> Map</button>
                    <button type="button" data-layer="satellite" class="${current === "satellite" ? "is-active" : ""}"><i class="bi bi-globe-asia-australia"></i> Satellite</button>`;
                L.DomEvent.disableClickPropagation(box);
                box.addEventListener("click", event => {
                    const button = event.target.closest("[data-layer]");
                    if (!button || button.dataset.layer === current) return;
                    map.removeLayer(layers[current]);
                    current = button.dataset.layer;
                    layers[current].addTo(map);
                    box.querySelectorAll("[data-layer]").forEach(b => b.classList.toggle("is-active", b === button));
                });
                return box;
            }
        });

        new Switch().addTo(map);

        // Top right, under the switch: clear of the floating guide button.
        L.control.zoom({ position: "topright" }).addTo(map);

        // Keep tiles right when the container changes size (sidebar, layout toggles).
        if (window.ResizeObserver) {
            const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
            observer.observe(element);
            map.on("unload", () => observer.disconnect());
        }

        return map;

    }

    // Map pin: network hospitals solid, others outlined; tone = module colour.
    function pin(L, { variant = "solid", icon = "bi-hospital", label = "" } = {}) {
        return L.divIcon({
            className: "mapkit-pin-wrap",
            html: `<span class="mapkit-pin mapkit-pin-${variant}" ${label ? `aria-label="${label.replace(/"/g, "&quot;")}"` : ""}><i class="bi ${icon}"></i></span>`,
            iconSize: [34, 42],
            iconAnchor: [17, 40],
            popupAnchor: [0, -36]
        });
    }

    function hubIcon(L) {
        return L.divIcon({
            className: "mapkit-pin-wrap",
            html: `<span class="mapkit-hub"><img src="./images/cmc-logo-white-transparent.png" alt=""></span>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -18]
        });
    }

    function clusterGroup(L) {
        return L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            maxClusterRadius: 48,
            iconCreateFunction(cluster) {
                const count = cluster.getChildCount();
                const size = count < 10 ? 36 : count < 50 ? 44 : 54;
                return L.divIcon({
                    className: "mapkit-cluster-wrap",
                    html: `<span class="mapkit-cluster" style="--size:${size}px">${count}</span>`,
                    iconSize: [size, size]
                });
            }
        });
    }

    const toNumber = value => {
        const n = parseFloat(value);
        return Number.isFinite(n) ? n : null;
    };

    function validPoint(lat, lng) {
        const a = toNumber(lat), b = toNumber(lng);
        return a !== null && b !== null && Math.abs(a) <= 90 && Math.abs(b) <= 180 && !(a === 0 && b === 0);
    }

    // Great-circle distance in km.
    function distanceKm(a, b) {
        const rad = d => d * Math.PI / 180;
        const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.asin(Math.sqrt(h));
    }

    const formatKm = km => km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km).toLocaleString("en-IN")} km`;

    const directionsUrl = (lat, lng) =>
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;


    window.MapKit = { load, create, pin, hubIcon, clusterGroup, validPoint, toNumber, distanceKm, formatKm, directionsUrl, CMC, INDIA };

})();
