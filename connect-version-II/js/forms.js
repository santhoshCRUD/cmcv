/**
 * FormIO host.
 *
 * The git code renders every data-entry form from a definition stored in
 * the FormIO collection (looked up by formKey) with Formio.createForm into
 * a Bootstrap modal. This keeps those definitions - they are the source of
 * truth for fields and validation - but hosts them in a Kit dialog styled
 * by styles/forms.css so all forms share the version II look, loading
 * state and validation messages.
 *
 *   Forms.definition(formKey)            -> definition (cached per page load)
 *   Forms.open({ title, formKey | definition, submission, hide, readOnly,
 *                prepare(def), onReady(form), onEvent(type, form, event),
 *                onSubmit(data, form) -> Promise, successMessage, size })
 *   Forms.render(container, options)     -> same, inline
 *   Forms.uploadFiles(data, folder)      -> data with base64 files uploaded
 *   Forms.confirm({ title, message, confirmLabel, danger }) -> Promise<bool>
 *   Forms.statusBadge(status)            -> badge markup
 *
 * Exposed as window.Forms.
 */
(function () {

    const { html, openDialog } = Kit;

    const SCRIPT = "vendor/formio/formio.full.min.js";
    const STYLE = "vendor/formio/formio.full.min.css";

    const LOCAL_LIBS = ["flatpickr-formio", "quill", "shortcut-buttons-flatpickr"];
    const READY_TIMEOUT = 20000;

    const cache = new Map();
    let loader = null;


    // -----------------------------------------------------------------
    // Library + definitions
    // -----------------------------------------------------------------

    function loadLibrary() {

        if (window.Formio) return Promise.resolve(window.Formio);

        if (loader) return loader;

        loader = new Promise((resolve, reject) => {

            if (!document.querySelector(`link[href="${STYLE}"]`)) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = STYLE;
                // Before our own sheets so styles/forms.css wins.
                document.head.insertBefore(link, document.head.querySelector('link[rel="stylesheet"]'));
            }

            const script = document.createElement("script");

            script.src = SCRIPT;
            script.onload = () => {

                if (!window.Formio) return reject(new Error("Form library unavailable"));

                // Date picker and rich-text editor are served from this app
                // (vendor/formio/lib) instead of cdn.form.io, so forms also
                // work where that CDN is unreachable.
                const local = new URL("vendor/formio/lib", document.baseURI).href.replace(/\/$/, "");
                LOCAL_LIBS.forEach(lib => window.Formio.cdn?.setOverrideUrl?.(lib, local));

                resolve(window.Formio);

            };
            script.onerror = () => reject(new Error("Couldn't load the form library"));

            document.head.appendChild(script);

        }).catch(error => {
            loader = null;
            throw error;
        });

        return loader;

    }

    async function definition(formKey) {

        if (!cache.has(formKey)) {

            cache.set(formKey, (async () => {

                const token = sessionStorage.getItem("accessToken");
                const response = await fetch(`/api/forms/${encodeURIComponent(formKey)}`, {
                    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                });
                const result = await response.json().catch(() => null);

                if (response.ok && result?.success && result.data) return result.data;

                if (response.status === 401) {
                    sessionStorage.clear();
                    window.location.href = "/login";
                }

                // Forms the git code bundled with the page instead of the
                // FormIO collection (e.g. samTrainingReportForm).
                const bundled = await fetch(`vendor/forms/${encodeURIComponent(formKey)}.json`).then(r => r.ok ? r.json() : null).catch(() => null);

                if (bundled) return bundled;

                console.warn(`FormIO definition "${formKey}" was not found (run "npm run check:forms" on the server).`);

                throw new Error(result?.message || "This form is not available right now. Please contact the Missions office.");

            })().catch(error => {
                cache.delete(formKey);
                throw error;
            }));

        }

        // Callers mutate definitions (hide buttons, fill select values).
        return structuredClone(await cache.get(formKey));

    }


    // -----------------------------------------------------------------
    // Definition helpers
    // -----------------------------------------------------------------

    function eachComponent(components, fn) {

        (components || []).forEach(component => {

            fn(component);

            eachComponent(component.components, fn);

            (component.columns || []).forEach(column => eachComponent(column.components, fn));

            (component.rows || []).forEach(row => (Array.isArray(row) ? row : []).forEach(cell => eachComponent(cell.components, fn)));

        });

    }

    function findComponent(def, key) {

        let found = null;

        eachComponent(def.components, component => {
            if (!found && component.key === key) found = component;
        });

        return found;

    }

    // Same as loadHelpForm in the git code: no Cancel button; no submit in preview.
    function tidyButtons(def, readOnly) {

        (def.components || []).forEach(page => {

            if (page.buttonSettings) {
                page.buttonSettings.cancel = false;
                if (readOnly) page.buttonSettings.submit = false;
            }

        });

        if (readOnly) {
            eachComponent(def.components, component => {
                if (component.type === "button" && (component.action || "submit") === "submit") {
                    component.hidden = true;
                }
            });
        }

    }


    // -----------------------------------------------------------------
    // Files: FormIO "base64" storage -> /api/uploads URL
    // (replaces uploadToS3, which the git code calls but never defines)
    // -----------------------------------------------------------------

    const isBase64File = value =>
        value && typeof value === "object" && typeof value.url === "string" && value.url.startsWith("data:");

    async function uploadOne(file, folder) {

        const token = sessionStorage.getItem("accessToken");

        const response = await fetch("/api/uploads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                name: file.originalName || file.name,
                type: file.type,
                data: file.url,
                folder
            })
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            throw new Error(result?.message || `Couldn't upload ${file.originalName || file.name || "the file"}`);
        }

        return { ...file, ...result.file, originalName: file.originalName || result.file.originalName };

    }

    async function uploadFiles(data, folder = "forms") {

        if (Array.isArray(data)) {
            return Promise.all(data.map(item => uploadFiles(item, folder)));
        }

        if (isBase64File(data)) {
            return uploadOne(data, folder);
        }

        if (data && typeof data === "object" && !(data instanceof Date)) {

            const out = {};

            for (const [key, value] of Object.entries(data)) {
                out[key] = await uploadFiles(value, folder);
            }

            return out;

        }

        return data;

    }


    // -----------------------------------------------------------------
    // Hosting
    // -----------------------------------------------------------------

    const loadingMarkup = () => html`
        <div class="form-loading" role="status">
            <span class="skeleton skeleton-text" style="width:40%"></span>
            <span class="skeleton form-loading-field"></span>
            <span class="skeleton skeleton-text" style="width:30%"></span>
            <span class="skeleton form-loading-field"></span>
            <span class="skeleton skeleton-text" style="width:50%"></span>
            <span class="skeleton form-loading-field form-loading-tall"></span>
            <span class="sr-only">Loading form…</span>
        </div>`;

    const errorMarkup = message => html`
        <div class="empty-state response-state error">
            <i class="bi bi-exclamation-octagon"></i>
            <strong>Couldn't open this form</strong>
            <span>${message}</span>
        </div>`;

    function setSaving(host, saving) {

        host.classList.toggle("is-saving", saving);

        host.querySelectorAll('button[type="submit"], button[name="data[submit]"]').forEach(button => {
            button.classList.toggle("is-loading", saving);
            button.disabled = saving;
        });

    }

    // Friendly validation summary: FormIO lists every error in its own
    // alert; we replace it with one toast + inline messages.
    function bindValidationToast(form) {

        form.on("error", errors => {

            const list = Array.isArray(errors) ? errors : [errors];
            const count = list.filter(Boolean).length;

            if (count) {
                UI.toast(count === 1 ? "Please fix the highlighted field." : `Please fix the ${count} highlighted fields.`, { type: "warning" });
            }

        });

    }

    async function mount(host, options) {

        const {
            formKey,
            hide = [],
            readOnly = false,
            submission,
            prepare,
            onReady,
            onEvent,
            onSubmit,
            successMessage = "Saved successfully",
            close
        } = options;

        host.classList.add("formio-host");
        host.innerHTML = String(loadingMarkup());

        let form;

        try {

            const [Formio, def] = await Promise.all([
                loadLibrary(),
                options.definition ? Promise.resolve(structuredClone(options.definition)) : definition(formKey)
            ]);

            tidyButtons(def, readOnly);

            if (prepare) await prepare(def);

            host.innerHTML = "";

            form = await Formio.createForm(host, def, {
                readOnly,
                noAlerts: true,
                hide: [].concat(hide, "style").reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                buttonSettings: { showCancel: false }
            });

        } catch (error) {

            console.error("Form failed to load:", error);
            host.innerHTML = String(errorMarkup(error.message));

            return null;

        }

        bindValidationToast(form);

        // A component whose library can't be fetched leaves form.ready pending.
        const ready = await Promise.race([form.ready.then(() => true), new Promise(r => setTimeout(() => r(false), READY_TIMEOUT))]);

        if (!ready) {
            host.innerHTML = String(errorMarkup("Part of this form could not be loaded. Please check your connection and try again."));
            return null;
        }

        if (submission) {
            form.submission = { data: structuredClone(submission) };
            await form.submissionReady;
        }

        if (onReady) {
            try {
                await onReady(form);
            } catch (error) {
                console.error(error);
                UI.toast(error.message || "Something went wrong", { type: "error" });
            }
        }

        if (onEvent) {

            form.on("customEvent", async event => {

                setSaving(host, true);

                try {
                    await onEvent(event.type, form, event);
                } catch (error) {
                    console.error(error);
                    UI.toast(error.message || "Couldn't complete this action", { type: "error" });
                } finally {
                    setSaving(host, false);
                }

            });

        }

        form.on("submit", async result => {

            if (!onSubmit) return;

            setSaving(host, true);

            try {

                const outcome = await onSubmit(result.data, form);

                if (outcome !== false) {
                    if (successMessage) UI.toast(successMessage, { type: "success" });
                    if (close) close();
                }

            } catch (error) {

                console.error("Form submit failed:", error);
                UI.toast(error.message || "Couldn't save. Please try again.", { type: "error" });

            } finally {

                setSaving(host, false);

            }

        });

        return form;

    }

    function open(options) {

        const body = document.createElement("div");

        const dialog = openDialog({
            title: options.title || "Form",
            size: options.size || "lg",
            body,
            onClose: options.onClose
        });

        const ready = mount(body, { ...options, close: options.keepOpen ? null : dialog.close });

        return { ...dialog, ready };

    }

    const render = (container, options) => mount(container, options);


    // -----------------------------------------------------------------
    // Confirm dialog (replaces window.confirm)
    // -----------------------------------------------------------------

    function confirm({ title = "Are you sure?", message = "", confirmLabel = "Confirm", danger = false } = {}) {

        return new Promise(resolve => {

            let answered = false;

            const dialog = openDialog({
                title,
                size: "sm",
                body: html`<p class="confirm-message">${message}</p>`,
                footer: html`
                    <button type="button" class="btn btn-secondary" data-answer="no">Cancel</button>
                    <button type="button" class="btn ${danger ? "btn-danger" : "btn-primary"}" data-answer="yes">${confirmLabel}</button>`,
                onClose: () => { if (!answered) resolve(false); }
            });

            dialog.element.querySelectorAll("[data-answer]").forEach(button => button.addEventListener("click", () => {
                answered = true;
                resolve(button.dataset.answer === "yes");
                dialog.close();
            }));

            dialog.element.querySelector('[data-answer="yes"]').focus();

        });

    }

    // Prompt for a short text (reasons, comments)
    function prompt({ title, label, placeholder = "", confirmLabel = "Submit", required = true, multiline = true } = {}) {

        return new Promise(resolve => {

            let answered = false;

            const dialog = openDialog({
                title,
                size: "sm",
                body: html`
                    <label class="field">
                        <span class="field-label">${label}</span>
                        ${multiline
                            ? html`<textarea class="input textarea" rows="4" placeholder="${placeholder}"></textarea>`
                            : html`<input class="input" placeholder="${placeholder}">`}
                        <span class="field-error" aria-live="polite"></span>
                    </label>`,
                footer: html`
                    <button type="button" class="btn btn-secondary" data-answer="no">Cancel</button>
                    <button type="button" class="btn btn-primary" data-answer="yes">${confirmLabel}</button>`,
                onClose: () => { if (!answered) resolve(null); }
            });

            const input = dialog.element.querySelector(".input");
            const error = dialog.element.querySelector(".field-error");

            dialog.element.querySelector('[data-answer="no"]').addEventListener("click", () => dialog.close());

            dialog.element.querySelector('[data-answer="yes"]').addEventListener("click", () => {

                const value = input.value.trim();

                if (required && !value) {
                    input.classList.add("is-invalid");
                    error.textContent = "This field is required.";
                    input.focus();
                    return;
                }

                answered = true;
                resolve(value);
                dialog.close();

            });

            input.addEventListener("input", () => { input.classList.remove("is-invalid"); error.textContent = ""; });

            input.focus();

        });

    }


    // -----------------------------------------------------------------
    // Status badge - one colour scheme for every module's workflow states
    // -----------------------------------------------------------------

    const STATUS_TONES = {
        success: ["approved", "completed", "accepted", "allotted", "awarded", "resolved", "closed", "available", "active", "current", "done", "visited", "confirmed"],
        warning: ["pending", "inprogress", "in progress", "ongoing", "under review", "underreview", "review", "submitted", "open", "referred", "requested", "draft saved", "on hold"],
        danger: ["rejected", "declined", "cancelled", "canceled", "withdrawn", "deleted", "expired", "critical", "high"],
        accent: ["draft", "new", "applied", "medium"]
    };

    function statusTone(status) {

        const value = String(status || "").trim().toLowerCase();

        for (const [tone, list] of Object.entries(STATUS_TONES)) {
            if (list.includes(value) || list.includes(value.replace(/[\s_-]+/g, ""))) return tone;
        }

        return "";

    }

    const humanize = value => String(value || "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/^\w/, c => c.toUpperCase());

    function statusBadge(status) {

        if (!status) return html`<span class="text-muted">—</span>`;

        const tone = statusTone(status);

        return html`<span class="badge ${tone ? `badge-${tone}` : ""}">${humanize(status)}</span>`;

    }


    window.Forms = {
        loadLibrary,
        definition,
        eachComponent,
        findComponent,
        uploadFiles,
        open,
        render,
        confirm,
        prompt,
        statusBadge,
        statusTone,
        humanize
    };

})();
