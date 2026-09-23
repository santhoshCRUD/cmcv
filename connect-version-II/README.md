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

Phase 2 (form and workflow modules): MMS, Mission Visits, Sabbatical, Mentorship, Legal Help, Finance, Equipment, Library Access, Manpower Request, Network Consults, FOV/SAM Grants, Research Request form, Feedback
