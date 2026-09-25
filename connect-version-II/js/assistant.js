/**
 * Module guide chat panel.
 *
 * Floating "Ask the guide" button + panel on home.html. Questions go to
 * /api/assistant/chat (routes/assistant.js), which answers from the
 * knowledge base built from the git content - with Claude when the server
 * has an API key, by keyword retrieval otherwise. The page sends which
 * modules this user can open so the answer can say when something is
 * outside their access.
 *
 * Answers are rendered from a small, escaped markdown subset: paragraphs,
 * **bold**, numbered / bulleted lists and in-app links (#/...) only.
 */
(function () {

    const { html, esc, toNode } = Kit;

    const STORE_KEY = "cmcvGuideChat";
    const MAX_TURNS = 12;

    let history = [];
    let busy = false;

    const load = () => {
        try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]"); } catch (error) { return []; }
    };

    const save = () => {
        try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-MAX_TURNS * 2))); } catch (error) { /* private mode */ }
    };

    const accessibleIds = () => App.modules().filter(App.canAccess).map(m => m.id);


    // -----------------------------------------------------------------
    // Markdown subset -> safe HTML
    // -----------------------------------------------------------------

    function inline(text) {

        return esc(text)
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\[([^\]]+)\]\((#\/[A-Za-z0-9\-/_]*)\)/g, (m, label, href) => `<a href="${href}" data-guide-link>${label}</a>`);

    }

    function render(markdown) {

        const blocks = String(markdown || "").replace(/\r/g, "").split(/\n{2,}/);

        return blocks.map(block => {

            const lines = block.split("\n").filter(line => line.trim());

            if (lines.length && lines.every(line => /^\s*\d+[.)]\s+/.test(line))) {
                return `<ol>${lines.map(line => `<li>${inline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
            }

            if (lines.length && lines.every(line => /^\s*[-*•]\s+/.test(line))) {
                return `<ul>${lines.map(line => `<li>${inline(line.replace(/^\s*[-*•]\s+/, ""))}</li>`).join("")}</ul>`;
            }

            return `<p>${lines.map(inline).join("<br>")}</p>`;

        }).join("");

    }


    // -----------------------------------------------------------------
    // UI
    // -----------------------------------------------------------------

    function suggestions() {

        const ids = new Set(accessibleIds());

        return [
            ids.has("mms") && "How do I apply for Mandatory Mission Service?",
            ids.has("fov") && "Am I eligible for the FOV grant?",
            ids.has("network-consults") && "How do I ask a CMC specialist about a patient?",
            ids.has("legal-help") && "How do I request legal help?",
            ids.has("library-access") && "How do I get library access?",
            ids.has("service-commitment") && "Where can I see my service commitment?",
            "What can I do on CMC V Connect?",
            "How do I contact the Missions Office?"
        ].filter(Boolean).slice(0, 4);

    }

    function build() {

        const fab = toNode(html`
            <button type="button" class="assistant-fab" aria-controls="assistantPanel" aria-expanded="false">
                <i class="bi bi-chat-dots"></i><span>Ask the guide</span>
            </button>`);

        const panel = toNode(html`
            <section class="assistant-panel" id="assistantPanel" role="dialog" aria-label="CMC V Connect guide" hidden>
                <header class="assistant-head">
                    <i class="bi bi-compass"></i>
                    <div><strong>CMC V Connect guide</strong><small>Ask how to use any module</small></div>
                    <button type="button" class="btn btn-ghost btn-icon btn-sm" data-clear title="New conversation" aria-label="New conversation"><i class="bi bi-arrow-counterclockwise"></i></button>
                    <button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close guide"><i class="bi bi-x-lg"></i></button>
                </header>
                <div class="assistant-log" data-log aria-live="polite"></div>
                <form class="assistant-form" data-form novalidate>
                    <label class="sr-only" for="assistantInput">Your question</label>
                    <textarea id="assistantInput" class="input" rows="1" maxlength="1000" placeholder="Ask about a module…"></textarea>
                    <button type="submit" class="btn btn-primary btn-icon" aria-label="Send"><i class="bi bi-send"></i></button>
                </form>
                <div class="assistant-note">Answers come from the CMC V Connect guide. For anything else, contact the Missions Office.</div>
            </section>`);

        document.body.append(fab, panel);

        const log = panel.querySelector("[data-log]");
        const form = panel.querySelector("[data-form]");
        const input = panel.querySelector("textarea");
        const sendBtn = form.querySelector('button[type="submit"]');

        const scroll = () => { log.scrollTop = log.scrollHeight; };

        function bubble(role, content, { links = [], error = false } = {}) {

            const el = document.createElement("div");

            el.className = `assistant-msg ${role === "user" ? "user" : ""} ${error ? "is-error" : ""}`;

            if (role === "user") el.textContent = content;
            else el.innerHTML = render(content);

            const extra = links.filter(link => !content.includes(`(${link.route})`));

            if (extra.length) {
                el.insertAdjacentHTML("beforeend", String(html`<div class="assistant-links">${extra.map(link => html`<a class="btn btn-secondary btn-sm" href="${link.route}" data-guide-link>${link.title} <i class="bi bi-arrow-right"></i></a>`)}</div>`));
            }

            log.appendChild(el);
            scroll();

            return el;

        }

        function welcome() {

            log.innerHTML = "";

            bubble("assistant", `Hello${window.currentUser?.name ? ` ${window.currentUser.name.split(/\s+/)[0]}` : ""}! I can help you find your way around CMC V Connect — what a module is for, who can use it and the steps to get something done.`);

            const chips = document.createElement("div");
            chips.className = "assistant-suggestions";
            chips.innerHTML = suggestions().map(q => `<button type="button" data-suggest>${esc(q)}</button>`).join("");
            log.appendChild(chips);

        }

        function replay() {

            if (!history.length) return welcome();

            log.innerHTML = "";
            history.forEach(turn => bubble(turn.role, turn.content, { links: turn.links || [] }));

        }

        async function ask(question) {

            if (busy) return;

            const text = question.trim();

            if (!text) {
                input.classList.add("is-invalid");
                input.setAttribute("aria-invalid", "true");
                input.placeholder = "Please type a question";
                input.focus();
                return;
            }

            busy = true;
            input.value = "";
            input.style.height = "";
            log.querySelector(".assistant-suggestions")?.remove();

            history.push({ role: "user", content: text });
            bubble("user", text);

            const typing = document.createElement("div");
            typing.className = "assistant-msg";
            typing.innerHTML = '<span class="assistant-typing" aria-label="Thinking"><span></span><span></span><span></span></span>';
            log.appendChild(typing);
            scroll();

            UI.setLoading(sendBtn, true);

            try {

                const token = sessionStorage.getItem("accessToken");

                const response = await fetch("/api/assistant/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                    body: JSON.stringify({
                        messages: history.slice(-MAX_TURNS * 2).map(({ role, content }) => ({ role, content })),
                        modules: accessibleIds(),
                        page: location.hash || "#/"
                    })
                });

                const result = await response.json().catch(() => null);

                if (response.status === 401) {
                    sessionStorage.clear();
                    location.href = "/login";
                    return;
                }

                if (!response.ok || !result?.success) {
                    throw new Error(result?.message || "The guide is unavailable right now. Please try again in a moment.");
                }

                typing.remove();
                history.push({ role: "assistant", content: result.answer, links: result.links || [] });
                bubble("assistant", result.answer, { links: result.links || [] });
                save();

            } catch (error) {

                typing.remove();
                history.pop();
                bubble("assistant", error.message || "Something went wrong. Please try again.", { error: true });

            } finally {

                busy = false;
                UI.setLoading(sendBtn, false);
                input.focus();

            }

        }

        const setOpen = open => {
            panel.hidden = !open;
            fab.setAttribute("aria-expanded", String(open));
            if (open) { replay(); input.focus(); }
        };

        fab.addEventListener("click", () => setOpen(panel.hidden));
        panel.querySelector("[data-close]").addEventListener("click", () => { setOpen(false); fab.focus(); });

        panel.querySelector("[data-clear]").addEventListener("click", () => {
            history = [];
            save();
            welcome();
            input.focus();
        });

        panel.addEventListener("keydown", event => {
            if (event.key === "Escape") { setOpen(false); fab.focus(); }
        });

        log.addEventListener("click", event => {

            const chip = event.target.closest("[data-suggest]");

            if (chip) {
                ask(chip.textContent);
                return;
            }

            // In-app links: navigate and keep the panel out of the way on small screens
            if (event.target.closest("[data-guide-link]") && window.matchMedia("(max-width: 640px)").matches) {
                setOpen(false);
            }

        });

        form.addEventListener("submit", event => {
            event.preventDefault();
            ask(input.value);
        });

        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask(input.value);
            }
        });

        input.addEventListener("input", () => {
            input.classList.remove("is-invalid");
            input.removeAttribute("aria-invalid");
            input.placeholder = "Ask about a module…";
            input.style.height = "";
            input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
        });

    }

    document.addEventListener("DOMContentLoaded", () => {
        history = load();
        build();
    });

})();
