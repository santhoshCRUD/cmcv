/**
 * "Register now" on the login page.
 *
 * Port of the git "Sign Up" button (views/header.html) and
 * requestLoginForm (formLoad.js): shows the FormIO form
 * "cmcvconnectLoginApplication" and stores the submission in LoginRequest
 * with status "inProgress" for the Missions Office to review. There is no
 * session yet, so it uses the narrow /api/public routes (routes/public.js).
 */
(function () {

    const { html } = Kit;

    let definition = null;

    async function loadDefinition() {

        if (definition) return structuredClone(definition);

        const response = await fetch("/api/public/registration-form", { headers: { Accept: "application/json" } });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            throw new Error(result?.message || "The registration form is not available right now.");
        }

        definition = result.data;

        return structuredClone(definition);

    }

    async function submit(data) {

        const response = await fetch("/api/public/registration", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ data })
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            throw new Error(result?.message || "We couldn't send your request. Please try again.");
        }

    }

    async function newRegistration() {

        const body = document.createElement("div");

        const dialog = Kit.openDialog({ title: "Request Login", size: "lg", body });

        body.innerHTML = String(html`
            <p class="text-muted">Tell us about yourself and how you would like to be involved. The Missions Office at CMC Vellore will get back to you.</p>
            <div data-form></div>`);

        const mount = body.querySelector("[data-form]");

        let def;

        try {
            def = await loadDefinition();
        } catch (error) {
            mount.innerHTML = String(html`
                <div class="empty-state response-state error">
                    <i class="bi bi-exclamation-octagon"></i>
                    <strong>Couldn't open the registration form</strong>
                    <span>${error.message} You can also write to missionsoffice@cmcvellore.ac.in.</span>
                </div>`);
            return;
        }

        Forms.render(mount, {
            definition: def,
            hide: ["forMissionsOffice"],
            successMessage: null,
            onSubmit: async data => {

                await submit(data);

                body.innerHTML = String(html`
                    <div class="empty-state response-state">
                        <i class="bi bi-check2-circle"></i>
                        <strong>Thank you!</strong>
                        <span>Your request has been sent to the Missions Office. You will receive an email once your account is ready.</span>
                    </div>`);

                UI.toast("Registration request sent", { type: "success" });

                setTimeout(dialog.close, 4000);

            }
        });

    }

    window.newRegistration = newRegistration;

})();
