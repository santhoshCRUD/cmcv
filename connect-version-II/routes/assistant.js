const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const { verifyJWT } = require("../auth-guard");
const KNOWLEDGE = require("../knowledge/modules");

const router = express.Router();


// =====================================================
// MODULE GUIDE ASSISTANT
//
// POST /api/assistant/chat
//   body: { messages: [{ role: "user"|"assistant", content }],
//           modules: [module ids the user can open], page }
//   resp: { success, answer, links: [{ title, route }], source }
//
// Answers only from knowledge/modules.js (content taken
// from the git code). With ANTHROPIC_API_KEY set, Claude
// writes the answer; without it (or if the API call
// fails) a keyword retrieval answer is returned, so the
// chat keeps working offline.
// =====================================================

const MODEL = process.env.ASSISTANT_MODEL || "claude-opus-5";

const client = (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)
    ? new Anthropic({ maxRetries: 2, timeout: 60 * 1000 })
    : null;

const MAX_HISTORY = 12;
const MAX_CHARS = 2000;


// -----------------------------------------------------
// Knowledge as text (system prompt, cached)
// -----------------------------------------------------

function entryText(entry) {

    return [
        `## ${entry.title}`,
        `Link: ${entry.route}`,
        `Who can use it: ${entry.access}`,
        entry.summary,
        ...(entry.steps?.length ? ["How to use it:", ...entry.steps.map(s => `- ${s}`)] : []),
        ...(entry.notes?.length ? ["Details:", ...entry.notes.map(s => `- ${s}`)] : []),
        ...(entry.contacts?.length ? [`Contact: ${entry.contacts.join("; ")}`] : [])
    ].join("\n");

}

const SYSTEM_PROMPT = `You are the CMC V Connect guide, a help assistant inside the CMC V Connect portal of the Missions Department, Christian Medical College (CMC) Vellore.

Your job is to help signed-in users find and use the portal's modules: explain what a module is for, who can use it, and the steps to get something done.

Rules:
- Answer only from the knowledge base below. If it doesn't cover the question, say you don't have that information and point the user to the Missions Office (missionsoffice@cmcvellore.ac.in, 0416-2286117). Never invent dates, amounts, eligibility rules, names or contact details.
- You cannot see or change the user's records (applications, requests, statuses). For their own data, tell them which page shows it.
- When you mention a module, link it with markdown using its Link value, e.g. [Mandatory Mission Service](#/mms). Only use links from the knowledge base.
- The user message lists the modules this user can open. If the relevant module is not in that list, say it is only available to the users named under "Who can use it" and suggest contacting the Missions Office for access.
- Keep answers short and practical: a sentence or two, then numbered steps when there is a procedure. Use plain language. Use **bold** sparingly. No headings.
- Politely decline requests unrelated to CMC V Connect or the Missions Department.

# Knowledge base

${KNOWLEDGE.map(entryText).join("\n\n")}`;


// -----------------------------------------------------
// Offline retrieval
// -----------------------------------------------------

const GENERAL = new Set(["about", "contact", "guide"]);

const tokenize = text => String(text || "").toLowerCase().match(/[a-z0-9]+/g) || [];

function rank(query, allowed) {

    const text = String(query || "").toLowerCase();
    const words = new Set(tokenize(text));

    return KNOWLEDGE
        .map(entry => {

            let score = 0;

            entry.keywords.forEach(keyword => {
                if (keyword.includes(" ") ? text.includes(keyword) : words.has(keyword)) {
                    score += keyword.includes(" ") ? 4 : 3;
                }
            });

            tokenize(entry.title).forEach(word => { if (word.length > 2 && words.has(word)) score += 2; });

            tokenize(entry.summary).forEach(word => { if (word.length > 4 && words.has(word)) score += 0.2; });

            if (allowed && !allowed.has(entry.id)) score *= 0.8;

            // General pages lose ties to the specific module being asked about.
            if (GENERAL.has(entry.id)) score *= 0.6;

            return { entry, score };

        })
        .filter(item => item.score >= 2)
        .sort((a, b) => b.score - a.score);

}

function offlineAnswer(question, allowed) {

    const [best, second] = rank(question, allowed);

    if (!best) {

        return {
            answer: "I couldn't find that in the CMC V Connect guide. Try asking about a module - for example Mandatory Mission Service, grants, Network Consults, Legal Help or Library Access - or contact the Missions Office at missionsoffice@cmcvellore.ac.in / 0416-2286117.",
            links: [{ title: "Guide", route: "#/guide" }, { title: "Contact", route: "#/contact" }]
        };

    }

    const entry = best.entry;
    const lines = [`**[${entry.title}](${entry.route})** — ${entry.summary}`];

    if (allowed && !allowed.has(entry.id) && entry.id !== "about") {
        lines.push(`This module is available to: ${entry.access}. Contact the Missions Office if you need access.`);
    }

    if (entry.steps?.length) {
        lines.push(entry.steps.map((step, i) => /^\d/.test(step) ? step : `${i + 1}. ${step}`).join("\n"));
    }

    if (entry.contacts?.length) {
        lines.push(`Contact: ${entry.contacts.join("; ")}`);
    }

    const links = [{ title: entry.title, route: entry.route }];

    if (second && second.score >= best.score * 0.7 && second.entry.route !== entry.route) {
        links.push({ title: second.entry.title, route: second.entry.route });
    }

    return { answer: lines.join("\n\n"), links };

}


// -----------------------------------------------------
// Rate limit: 30 questions per user per 10 minutes
// -----------------------------------------------------

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 30;
const usage = new Map();

function limited(userId) {

    const now = Date.now();
    const recent = (usage.get(userId) || []).filter(t => now - t < WINDOW_MS);

    recent.push(now);
    usage.set(userId, recent);

    return recent.length > LIMIT;

}


// -----------------------------------------------------
// Routes
// -----------------------------------------------------

function cleanHistory(messages) {

    if (!Array.isArray(messages)) return [];

    const history = messages
        .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
        .slice(-MAX_HISTORY)
        .map(m => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }));

    // The API needs the conversation to start with a user turn.
    while (history.length && history[0].role !== "user") history.shift();

    return history;

}

const linksIn = answer => {

    const seen = new Set();

    return KNOWLEDGE.filter(entry => {
        if (seen.has(entry.route) || !answer.includes(`(${entry.route})`)) return false;
        seen.add(entry.route);
        return true;
    }).map(entry => ({ title: entry.title, route: entry.route }));

};

router.post("/chat", verifyJWT, async (req, res) => {

    const history = cleanHistory(req.body?.messages);
    const last = history[history.length - 1];

    if (!last || last.role !== "user") {
        return res.status(400).json({ success: false, message: "Please type a question." });
    }

    if (limited(String(req.user.id))) {
        return res.status(429).json({ success: false, message: "You've asked a lot of questions in a short time. Please wait a few minutes." });
    }

    const known = new Set(KNOWLEDGE.map(entry => entry.id));
    const allowed = Array.isArray(req.body?.modules)
        ? new Set(req.body.modules.filter(id => typeof id === "string" && known.has(id)).concat("about", "contact", "guide", "feedback"))
        : null;

    if (!client) {
        return res.json({ success: true, source: "offline", ...offlineAnswer(last.content, allowed) });
    }

    // Context for this user goes in the last user turn so the system prompt stays cacheable.
    const context = [
        `[Portal context] Modules this user can open: ${allowed ? [...allowed].join(", ") : "unknown"}.`,
        typeof req.body?.page === "string" ? `Current page: ${req.body.page.slice(0, 80)}.` : ""
    ].filter(Boolean).join(" ");

    const messages = history.map((m, i) => i === history.length - 1
        ? { role: "user", content: `${context}\n\n${m.content}` }
        : m);

    try {

        const response = await client.beta.messages.create({
            model: MODEL,
            max_tokens: 8000,
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            output_config: { effort: "low" },
            system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
            messages
        });

        if (response.stop_reason === "refusal") {
            return res.json({
                success: true,
                source: "claude",
                answer: "I can only help with using CMC V Connect. For anything else, please contact the Missions Office at missionsoffice@cmcvellore.ac.in.",
                links: [{ title: "Contact", route: "#/contact" }]
            });
        }

        const answer = response.content
            .filter(block => block.type === "text")
            .map(block => block.text)
            .join("\n")
            .trim();

        if (!answer) {
            throw new Error("Empty answer");
        }

        return res.json({ success: true, source: "claude", answer, links: linksIn(answer) });

    } catch (error) {

        if (error instanceof Anthropic.RateLimitError) {
            console.warn("[ASSISTANT][WARN] Claude rate limited; answering offline");
        } else if (error instanceof Anthropic.APIError) {
            console.error(`[ASSISTANT][ERROR] Claude API ${error.status}:`, error.message);
        } else {
            console.error("[ASSISTANT][ERROR]", error);
        }

        return res.json({ success: true, source: "offline", ...offlineAnswer(last.content, allowed) });

    }

});

router.get("/status", verifyJWT, (req, res) => {
    res.json({ success: true, mode: client ? "claude" : "offline" });
});


module.exports = router;
module.exports.offlineAnswer = offlineAnswer;
