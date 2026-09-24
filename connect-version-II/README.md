Routes (Folder, below files should cover)

academics.js (Collection calling routes & redirections, related to missions)

auth.js (related to authentication e.g login , logout, jwt, profiles, sessions, refresh, health)

graphapi.js (temp empty, profile info for ms login)

connect.js (related to complete connect site, azure - jwt - encode - decode, using for execute tokens ,basic data -> user profiles, user related)

v1.js (all features requested for connect site)

.env 

.env.example (local db details, FE urls, BE urls, sessions validity)

.gitignore (node modules)

app.js (security related and api tracking at server end)

db.js(local testing, mongo)

decodetoken.js (decoding logics, 256bit hashing algorithm, azure tokens > JWT > client > Bearer token )

readme.md

Front-end (UI)

login.html / home.html (pages; all original element IDs and global functions are kept so login.js and guard.js work unchanged)

styles/design-system.css (tokens: colors, type, spacing, radius, shadows; buttons, inputs + validation, cards, badges, avatars, dropdowns, modals, toasts, spinner/skeleton/progress)

styles/auth.css (login layout) , styles/dashboard.css (sidebar, topbar, module grid, API data drawer, profile modal)

ui.js (presentation-only helpers: UI.toast, UI.setLoading, UI.progress, UI.openModal/closeModal, UI.toggleDropdown, offline banner)

styles/styles.css (legacy stylesheet, no longer linked)


Modules ported from the original CMC V Connect (git: santhoshCRUD/cmcv) - Phase 1

routes/connectApp.js (POST /api/connectApp/<requestType>, JWT protected. Same request format as the legacy academics.cmcvellore.edu.in/api/connectApp API: fetchCollectionData, fetchCollectionDataFromDB, insertCollectionData(InDB), updateCollectionData(InDB). Collection allowlist, separate write allowlist (empty in Phase 1), role rules (Council collections need "Council Member"), blocks $where/$function/$accumulator/$out/$merge)

routes/auth.js (login, /me and the JWT now include the user's legacy roles, e.g. "Missions", "Council Member", "VConnect Guest")

js/connect-api.js (client for the route above), js/ui-kit.js (escaping, tables, dialogs, maps), js/app-shell.js (module registry, role-aware sidebar/tiles, hash routing #/<module>)

js/modules/ home.js (dashboard widgets per audience), hospitals.js, grand-rounds.js, news.js (Weekly Manna, News, Newsletter), research.js, learning.js (Learning Resources, Clinical Snippets, Council), pages.js (Conclave, Shiloh, Second-Opinion, Contact, Guide)

Access follows renderPostHomePage() in the git code: faculty/postgraduate -> missions view, student -> student view, external user by roles (Missions / student / VConnect Guest)

Phase 2 - form and workflow modules

js/forms.js + styles/forms.css (FormIO host: every form definition still comes from the FormIO collection by formKey, rendered in version II dialogs with one loading state, validation message style, font and colour set; Forms.confirm / Forms.prompt replace window.confirm)

vendor/formio (Form.io 4.21.7 from the git assets, plus its date picker / rich-text editor served locally instead of cdn.form.io); vendor/forms (samTrainingReportForm, which the git code shipped inside formLoad.js)

js/modules/ help.js (Legal Help, Finance, Library Access, NABH Entry Level, Feedback, Research Request form), missions.js (Manpower Requests, hospital administrator workspace with mission requests + message thread), mentorship.js (Mission Mentors / Mentees, meetings), service-commitment.js, engagement.js (Mission Engagement, Mandatory Mission Service, Mission Visits), network-consults.js (dashboard, themes, requests, consults, nodal, patient workspace with Q&A), grants.js (Grants, FOV, SAM with applicant/admin dashboards), equipment.js (register, requests, admin dashboard, history)

routes/connectApp.js (write allowlist for the Phase 2 collections; Asset writes need "Missions"; "students" only returns the caller's own record; missionHospital only accepts student feedback)

routes/uploads.js (POST /api/uploads: form attachments stored on disk and served from /uploads - replaces uploadToS3, which the git code never defined)

routes/public.js ("Register now" on the login page: the cmcvconnectLoginApplication form, stored in LoginRequest for the Missions Office)

routes/assistant.js + knowledge/modules.js + js/assistant.js (module guide chatbot, "Ask the guide" on every page; answers only from the knowledge base built from the git content; uses Claude when ANTHROPIC_API_KEY is set, keyword search otherwise)

scripts/seed-equipment.js (npm run seed:equipment - loads the Asset Recycling Committee list that the git Equipment page started with)

Mission Sabbatical stays "Coming Soon", as in the git code.


Run locally

1. Install Node.js 20+ and MongoDB (or use a MongoDB connection string).
2. cd connect-version-II
3. npm install
4. Copy .env.example to .env and fill in MONGO_URI and JWT_SECRET (ANTHROPIC_API_KEY is optional).
5. npm start  (then open http://localhost:7000/login)
   Do not use "npx serve" - the pages need the API routes served by app.js.
6. Optional: npm run seed:equipment

Forms: every form (Legal Help, MMS, FOV, Network Consults ...) is a Form.io definition read from the
FormIO collection by formKey - the same collection the original CMC V Connect uses. They are not in
the git code, so a new local database needs a copy of that collection:

    mongoexport --uri "<production MONGO_URI>" --collection FormIO --out FormIO.json
    mongoimport --uri "<your MONGO_URI>" --collection FormIO --file FormIO.json

Then run "npm run check:forms" to see which definitions are present.

The lookup (services/formio.js, GET /api/forms/<formKey>) accepts the collection under any
capitalisation (FormIO, formIO, formio), matches formKey ignoring case and surrounding spaces,
unwraps definitions stored in a nested field (form, schema, definition, formJson ...) and looks in
the database from MONGO_URI first, then FORMIO_DB (optional .env setting), then any other database
on the same server.
