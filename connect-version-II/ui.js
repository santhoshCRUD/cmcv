/**
 * Presentation-only helpers shared by login.html and home.html.
 *
 * Nothing in here talks to the API or touches sessionStorage;
 * it only provides UI feedback (toasts, modals, dropdowns,
 * button loading states, offline banner) around the existing
 * page logic in login.js / guard.js / home.html.
 *
 * Exposed as window.UI.
 */
(function () {

    // -----------------------------------------------------------------
    // Toasts
    // -----------------------------------------------------------------

    const TOAST_ICONS = {
        success: "bi-check-circle-fill",
        error: "bi-x-circle-fill",
        warning: "bi-exclamation-triangle-fill",
        info: "bi-info-circle-fill"
    };

    function toastRegion() {

        let region = document.getElementById("toastRegion");

        if (!region) {

            region = document.createElement("div");
            region.id = "toastRegion";
            region.className = "toast-region";
            region.setAttribute("role", "status");
            region.setAttribute("aria-live", "polite");
            document.body.appendChild(region);

        }

        return region;

    }

    function dismissToast(toast) {

        if (!toast || toast.classList.contains("is-leaving")) {
            return;
        }

        toast.classList.add("is-leaving");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });

    }

    function toast(title, options = {}) {

        const type = options.type || "info";

        const el = document.createElement("div");
        el.className = `toast toast-${type}`;

        const icon = document.createElement("i");
        icon.className = `bi ${TOAST_ICONS[type] || TOAST_ICONS.info} toast-icon`;

        const content = document.createElement("div");
        content.className = "toast-content";

        const titleEl = document.createElement("div");
        titleEl.className = "toast-title";
        titleEl.textContent = title;
        content.appendChild(titleEl);

        if (options.message) {

            const messageEl = document.createElement("div");
            messageEl.className = "toast-message";
            messageEl.textContent = options.message;
            content.appendChild(messageEl);

        }

        const close = document.createElement("button");
        close.type = "button";
        close.className = "toast-close";
        close.setAttribute("aria-label", "Dismiss notification");
        close.innerHTML = '<i class="bi bi-x-lg"></i>';
        close.addEventListener("click", () => dismissToast(el));

        el.append(icon, content, close);
        toastRegion().appendChild(el);

        const timeout = options.timeout ?? 4500;

        if (timeout > 0) {
            setTimeout(() => dismissToast(el), timeout);
        }

        return el;

    }


    // -----------------------------------------------------------------
    // Button loading state
    // -----------------------------------------------------------------

    function setLoading(button, isLoading) {

        if (!button) {
            return;
        }

        button.classList.toggle("is-loading", isLoading);
        button.setAttribute("aria-busy", isLoading ? "true" : "false");
        button.disabled = isLoading;

    }


    // -----------------------------------------------------------------
    // Top progress bar (for async page actions)
    // -----------------------------------------------------------------

    let pending = 0;

    function progress(isActive) {

        let bar = document.getElementById("progressBar");

        if (!bar) {

            bar = document.createElement("div");
            bar.id = "progressBar";
            bar.className = "progress-bar";
            document.body.appendChild(bar);

        }

        pending = Math.max(0, pending + (isActive ? 1 : -1));
        bar.classList.toggle("is-active", pending > 0);

    }


    // -----------------------------------------------------------------
    // Modals
    // -----------------------------------------------------------------

    let lastFocused = null;

    function focusable(root) {

        return [...root.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        )].filter(el => el.offsetParent !== null);

    }

    function openModal(id) {

        const backdrop = document.getElementById(id);

        if (!backdrop) {
            return;
        }

        lastFocused = document.activeElement;
        backdrop.hidden = false;
        document.body.style.overflow = "hidden";

        const first = backdrop.querySelector("[data-autofocus]") || focusable(backdrop)[0];

        if (first) {
            requestAnimationFrame(() => first.focus());
        }

    }

    function closeModal(id) {

        const backdrop = document.getElementById(id);

        if (!backdrop || backdrop.hidden) {
            return;
        }

        backdrop.hidden = true;

        if (!document.querySelector(".modal-backdrop:not([hidden])")) {
            document.body.style.overflow = "";
        }

        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }

    }

    document.addEventListener("click", event => {

        // Backdrop click closes
        if (event.target.classList && event.target.classList.contains("modal-backdrop")) {
            closeModal(event.target.id);
        }

        // [data-close-modal] buttons
        const closer = event.target.closest && event.target.closest("[data-close-modal]");

        if (closer) {
            closeModal(closer.closest(".modal-backdrop").id);
        }

        // Click outside closes any open dropdown
        document.querySelectorAll(".dropdown.is-open").forEach(dropdown => {

            if (!dropdown.contains(event.target)) {
                toggleDropdown(dropdown, false);
            }

        });

    });

    document.addEventListener("keydown", event => {

        const openModalEl = [...document.querySelectorAll(".modal-backdrop:not([hidden])")].pop();

        if (event.key === "Escape") {

            if (openModalEl) {
                closeModal(openModalEl.id);
                return;
            }

            document.querySelectorAll(".dropdown.is-open").forEach(d => toggleDropdown(d, false, true));

        }

        // Simple focus trap for the top-most modal
        if (event.key === "Tab" && openModalEl) {

            const items = focusable(openModalEl);

            if (!items.length) {
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }

        }

    });


    // -----------------------------------------------------------------
    // Dropdowns
    // -----------------------------------------------------------------

    function toggleDropdown(dropdown, force, restoreFocus) {

        if (typeof dropdown === "string") {
            dropdown = document.getElementById(dropdown);
        }

        if (!dropdown) {
            return;
        }

        const willOpen = typeof force === "boolean" ? force : !dropdown.classList.contains("is-open");

        // Only one dropdown open at a time
        if (willOpen) {
            document.querySelectorAll(".dropdown.is-open").forEach(d => {
                if (d !== dropdown) {
                    toggleDropdown(d, false);
                }
            });
        }

        dropdown.classList.toggle("is-open", willOpen);

        const trigger = dropdown.querySelector("[aria-haspopup]");

        if (trigger) {

            trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");

            if (!willOpen && restoreFocus) {
                trigger.focus();
            }

        }

    }


    // -----------------------------------------------------------------
    // Offline banner
    // -----------------------------------------------------------------

    function initOfflineBanner() {

        const banner = document.createElement("div");
        banner.className = "offline-banner";
        banner.setAttribute("role", "status");
        banner.innerHTML = '<i class="bi bi-wifi-off"></i> You are offline. Some actions are unavailable until your connection is restored.';
        document.body.appendChild(banner);

        const update = () => banner.classList.toggle("is-visible", !navigator.onLine);

        window.addEventListener("online", () => {
            update();
            toast("Back online", { type: "success", timeout: 2500 });
        });

        window.addEventListener("offline", update);

        update();

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initOfflineBanner);
    } else {
        initOfflineBanner();
    }


    window.UI = {
        toast,
        setLoading,
        progress,
        openModal,
        closeModal,
        toggleDropdown
    };

})();
