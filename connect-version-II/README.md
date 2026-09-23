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
