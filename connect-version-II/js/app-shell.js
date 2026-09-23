/**
 * Module host for home.html.
 *
 * - App.register(module) adds a ported module to the registry
 * - access follows the git code: the user's "audience" is derived
 *   exactly like renderPostHomePage() (userType + roles), and a
 *   module can additionally require roles (e.g. "Council Member")
 * - hash routing: #/            -> dashboard (home view)
 *                 #/explorer    -> version II data explorer
 *                 #/<id>/<...>  -> module view
 *
 * Module shape:
 *   { id, title, icon, color, group, description,
 *     audiences?: ["missions", "student", "guest"],
 *     roles?: ["Council Member"],
 *     nav?: false,                // hide from sidebar / tiles
 *     render(view, params, ctx) } // may return a cleanup function
 *
 * Exposed as window.App.
 */
(function () {

    const modules = [];

    const GROUPS = [
        "Missions",
        "Learning",
        "Research",
        "News & updates",
        "Community",
        "Help"
    ];

    let cleanup = null;


    // -----------------------------------------------------------------
    // Audience, as in renderPostHomePage() (git: app.js)
    //   faculty / postgraduate                 -> missions
    //   student                                -> student
    //   external user + Missions + student     -> student
    //   external user + Missions               -> missions
    //   external user + VConnect Guest         -> guest
    // Anything else got a blank page in the git code; here they get
    // the guest-level view instead.
    // -----------------------------------------------------------------

    function audienceOf(user) {

        const type = String(user?.userType || "").toLowerCase();
        const roles = user?.roles || [];

        if (type === "faculty" || type === "postgraduate") return "missions";
        if (type === "student") return "student";

        if (type === "external user") {
            if (roles.includes("Missions") && roles.includes("student")) return "student";
            if (roles.includes("Missions")) return "missions";
            if (roles.includes("VConnect Guest")) return "guest";
        }

        return "guest";

    }

    const user = () => window.currentUser || {};
    const audience = () => audienceOf(user());
    const hasRole = role => (user().roles || []).includes(role);

    function canAccess(module) {

        if (module.audiences && !module.audiences.includes(audience())) {
            return false;
        }

        if (module.roles && !module.roles.some(hasRole)) {
            return false;
        }

        return true;

    }

    function register(module) {
        modules.push({ color: "blue", icon: "bi-grid", group: "Missions", ...module });
    }

    const accessible = () => modules.filter(m => m.nav !== false && canAccess(m));

    const find = id => modules.find(m => m.id === id);


    // -----------------------------------------------------------------
    // Navigation UI
    // -----------------------------------------------------------------

    function renderNav() {

        const list = document.getElementById("sidebarModules");

        if (!list) return;

        const { html } = Kit;
        const items = accessible();

        list.innerHTML = GROUPS.map(group => {

            const inGroup = items.filter(m => m.group === group);

            if (!inGroup.length) return "";

            return String(html`
                <div class="nav-section-label">${group}</div>
                ${inGroup.map(m => html`
                    <a href="#/${m.id}" class="nav-item" data-route="${m.id}" title="${m.title}">
                        <i class="bi ${m.icon}"></i><span>${m.title}</span>
                    </a>`)}`);

        }).join("");

        list.querySelectorAll("a").forEach(a => a.addEventListener("click", () => window.toggleSidebar && toggleSidebar(false)));

    }

    // Module tiles on the dashboard (filtered by the hero search)
    function renderTiles() {

        const grid = document.getElementById("apiModuleGrid");

        if (!grid) return;

        const { html } = Kit;
        const items = accessible();

        grid.innerHTML = items.map((m, index) => String(html`
            <a href="#/${m.id}" class="api-card" data-name="${m.title.toLowerCase()}" data-description="${(m.description || "").toLowerCase()}"
               style="animation-delay:${Math.min(index, 12) * 30}ms">
                <div class="api-card-top">
                    <div class="api-icon ${m.color}"><i class="bi ${m.icon}"></i></div>
                    <div class="api-arrow"><i class="bi bi-arrow-right"></i></div>
                </div>
                <h3>${m.title}</h3>
                <p>${m.description || ""}</p>
                <div class="api-status"><span class="status-dot"></span>${m.group}</div>
            </a>`)).join("");

        const count = items.length;

        document.getElementById("statModules").textContent = count;
        document.getElementById("moduleCount").textContent = `${count} modules`;

    }

    function setActiveNav(route) {

        document.querySelectorAll(".sidebar .nav-item[data-route]").forEach(a => {

            const active = a.dataset.route === route;

            a.classList.toggle("active", active);

            if (active) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");

        });

    }

    function setTitle(title) {

        const crumb = document.getElementById("breadcrumbTitle");

        if (crumb) crumb.textContent = title;

        document.title = `CMC VConnect | ${title}`;

    }


    // -----------------------------------------------------------------
    // Router
    // -----------------------------------------------------------------

    function parseHash() {

        const path = (location.hash || "").replace(/^#\/?/, "");

        const [id = "", ...params] = path.split("/").map(decodeURIComponent);

        return { id, params };

    }

    function showView(name) {

        document.querySelectorAll("[data-view]").forEach(section => {
            section.hidden = section.dataset.view !== name;
        });

    }

    async function route() {

        if (typeof cleanup === "function") {
            try { cleanup(); } catch (error) { console.error(error); }
        }

        cleanup = null;

        const { id, params } = parseHash();

        window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

        if (!id || id === "home" || id === "modules") {

            showView("home");
            setActiveNav(id === "modules" ? "modules" : "home");
            setTitle("Dashboard");

            const home = find("home");

            if (home) {
                cleanup = await home.render(document.getElementById("homeWidgets"), params, context());
            }

            if (id === "modules") {
                document.getElementById("modules").scrollIntoView({ behavior: "smooth", block: "start" });
            }

            return;

        }

        if (id === "explorer") {

            showView("explorer");
            setActiveNav("explorer");
            setTitle("Data explorer");

            return;

        }

        const module = find(id);
        const view = document.getElementById("moduleView");

        showView("module");
        setActiveNav(id);

        if (!module) {

            setTitle("Not found");
            view.innerHTML = String(Kit.emptyState("bi-signpost-split", "Page not found", "This module does not exist. Use the menu to pick another one."));

            return;

        }

        setTitle(module.title);

        if (!canAccess(module)) {

            view.innerHTML = String(Kit.emptyState("bi-shield-lock", "You don't have access to this module", "It is only available to specific CMC V Connect roles. Contact the Missions office if you think this is a mistake."));

            return;

        }

        view.innerHTML = "";

        try {
            cleanup = await module.render(view, params, context());
        } catch (error) {
            console.error(`Module ${id} failed:`, error);
            view.innerHTML = String(Kit.errorState(error.message));
        }

    }

    function context() {
        return { user: user(), audience: audience(), hasRole, navigate };
    }

    function navigate(path) {

        const target = `#/${path}`;

        if (location.hash === target) {
            route();
        } else {
            location.hash = target;
        }

    }

    function start() {

        renderNav();
        renderTiles();

        window.addEventListener("hashchange", route);

        route();

    }


    window.App = {
        register,
        start,
        navigate,
        canAccess,
        audienceOf,
        audience,
        hasRole,
        find,
        modules: () => modules.slice()
    };

})();
