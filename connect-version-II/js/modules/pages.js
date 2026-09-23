/**
 * Content pages: Medical Colleges Conclave, Shiloh, Second-Opinion Connect,
 * Contact and the Guide.
 *
 * Conclave participants come from ConclaveHsptl (loadMap "conclaveHsptlMap"
 * in the git code); the rest is the static copy from the git views
 * (academic_conclave.html, shiloh.html, secondOpinionModule.html, the
 * "contactMissions" modal in modal.js and guidePage.html).
 */
(function () {

    const { html, img, safeUrl, emptyState, errorState, skeletonCards, pageHeader, section, renderMap, openVideo } = Kit;

    const S3 = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/";


    // -----------------------------------------------------------------
    // Medical Colleges Conclave
    // -----------------------------------------------------------------

    const AGENDA = [
        {
            title: "Medical Education",
            speakers: [
                "Christian Medical College, Vellore – Dr. Solomon Sathiskumar, Principal",
                "Pondicherry Institute of Medical Sciences – Dr. Renu G’Boy Varghese, Director-Principal",
                "Father Muller Medical College, Mangalore – Dr Antony Sylvan D Souza, Dean",
                "Amala Institute of Medical Sciences, Thrissur – Dr. Betsy Thomas"
            ],
            points: [
                "Varying college fee structures create mindset challenges that impact student motivation for missions.",
                "There is a need for an advocacy body to represent medical education to the government.",
                "Integrating humanities and communication workshops fosters empathy through behavioral modeling.",
                "The INSPIRE program at Believer’s Medical College exposes students early to healthcare operations, promoting appreciation for all hospital roles.",
                "An Interns Exit Exam is proposed to ensure qualitative assessment of graduates."
            ]
        },
        {
            title: "Medical Services",
            speakers: [
                "Christian Medical College, Vellore – Dr. I Rajesh, Medical Superintendent",
                "Malankara Orthodox Syrian Church Medical College Hospital, Kolenchery – Dr. Vergis Paul, Medical Superintendent",
                "Dr. Somervell Memorial CSI Hospital & Medical College, Thiruvananthapuram – Dr. Bennet Abraham, Director",
                "Pushpagiri Medical College, Thiruvalla – Dr. Vikram Gowda"
            ],
            points: [
                "Engage students early through hospital visits and shadowing; empower junior faculty via mission postings and mentoring.",
                "Cultivate compassion and empathy: soft skills through humanities and reflective sessions, patient-journey narratives and Christ-centred role modeling.",
                "Facilitate high school student engagement in mission hospitals and Christian medical colleges.",
                "Invest in mentorship, as students learn more from seniors than lectures, and involve churches and families in student engagement."
            ]
        },
        {
            title: "Research",
            speakers: [
                "Christian Medical College Vellore – Dr Suceena Alexander",
                "Christian Medical College, Ludhiana – Dr William Bhatti",
                "Jubilee Mission Medical College and Research Institute, Thrissur – Dr. Benny Joseph, CEO"
            ],
            points: [
                "Prioritize socially relevant research that addresses community needs and national impact, balancing basic science with public health.",
                "Initiate collaborations early in the proposal process and target underexplored areas.",
                "Adopt a ten-point action plan: engage stakeholders, identify problems, assess impact, evaluate resources, develop roadmaps, monitor progress, conduct interim analyses, encourage publication, disseminate results and maintain post-implementation surveillance.",
                "Establish robust research systems (e.g. IRB) and a culture of integrity; encourage publishing negative results with regular supervision and CONSORT adherence."
            ]
        },
        {
            title: "Outreach",
            speakers: [
                "Christian Medical College Vellore – Dr Venkatesan S (Urban), Dr Venkata Raghava (Rural), Dr Jachin Velavan (Mission Outreach)",
                "St. Johns Medical College, Bangalore – Dr. George D’Souza, Dean",
                "Believers Church Medical College Hospital, Thiruvalla – Dr. George Chandy, Director"
            ],
            points: [
                "Immerse students in underserved communities from the beginning and strengthen the NMC Family Adoption Program.",
                "Expand learning beyond hospitals to community health centres; teach the social determinants of health.",
                "Facilitate partnerships between medical colleges and mission hospitals with shared frameworks and key contacts.",
                "Develop model initiatives (e.g. SHP, MMS) that expose students and faculty to mission hospitals."
            ]
        }
    ];

    const WAY_FORWARD = [
        ["Common Consortium", ["Identify a single point of contact in each Medical College for HR needs.", "Form a common consortium of all Christian Medical Colleges and explore CCH as a possible body to expand its scope of engagement."]],
        ["Sharing Best Practices", ["Develop a Common Minimum on verticals – resources, manpower, ethics, values.", "Exchange experiences and strategies for effective outreach.", "A common research journal and research training workshops."]],
        ["Engaging Students", ["Meet high school students and organise Open College Days.", "Engage students through Mission Hospitals – expand SHP/MMP-like programs.", "Facilitate educational webinars."]],
        ["Bettering Patient Care", ["Create channels for referral of patients for tertiary care.", "A platform for centralized resource facilitation – pharmacy, equipment.", "Establish a Missions Innovation Hub."]]
    ];

    async function renderConclave(view, params) {

        if (params[0]) {
            return HospitalViews.renderDetails(view, params[0], { source: "conclave", back: { href: "#/conclave", label: "Conclave" } });
        }

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "“So they strengthened their hands for this good work.” — Nehemiah 2:18",
                title: "Medical Colleges Conclave 2025",
                icon: "bi-bank",
                color: "orange",
                description: "Bringing together Christian institutions to strengthen Education, Service, Research & Outreach in our nation."
            })}
            <nav class="subnav" aria-label="Conclave sections">
                <a href="#conclave-about" data-scroll>About</a>
                <a href="#conclave-agenda" data-scroll>Agenda</a>
                <a href="#conclave-participants" data-scroll>Participants</a>
                <a href="#conclave-forward" data-scroll>The way forward</a>
            </nav>
            <section class="feature-banner card" id="conclave-about">
                ${img(`${S3}_4446db68fab7ae554bc8088e78514154_Pictures.jpeg`, "Conclave participants", "feature-banner-img")}
                <div class="feature-banner-copy">
                    <h2>Vision &amp; objective</h2>
                    <p>That we can work together to improve Medical Education, Service Delivery &amp; Medical Research, and Community Outreach in India by sharing and adopting best practices, and thereby generate a critical mass of competent, ethical and socially responsible health workforce.</p>
                    <p class="text-muted">Approximately 100,000 doctors graduate annually from over 700 medical colleges in India. Yet ‘Health for All’ is a distant reality for many in this nation. As a handful of Christian minority institutions, do we have a mandate to be change-makers and bridge this gap?</p>
                </div>
            </section>
            <div class="fact-grid">
                <div class="card fact">There are 12 Christian Minority Medical Colleges, each with a legacy of transformational impact in medical service, education, research and outreach.</div>
                <div class="card fact fact-dark">The conclave was a first step toward understanding each institution's strengths and identifying collaboration opportunities.</div>
                <div class="card fact">A major takeaway was the need for a formal body to nurture collaborative initiatives, advocacy, joint government representations and research.</div>
                <div class="card fact">Key proposals included referral channels for tertiary care, a missions innovation hub, and sharing manpower.</div>
            </div>
            ${section("Agenda at a glance", html`<div class="accordion-list">${AGENDA.map(a => html`
                <details class="accordion-item-lite">
                    <summary><strong>${a.title}</strong><span class="text-muted">${a.speakers.length} presentations</span></summary>
                    <h4 class="detail-subhead">Presentations</h4>
                    <ul>${a.speakers.map(s => html`<li>${s}</li>`)}</ul>
                    <h4 class="detail-subhead">Summary</h4>
                    <ul>${a.points.map(p => html`<li>${p}</li>`)}</ul>
                </details>`)}</div>`, { id: "conclave-agenda" })}
            ${section("Conclave participants", html`<div id="participants">${skeletonCards(4)}</div>`, {
                id: "conclave-participants",
                actions: html`<button type="button" class="btn btn-secondary btn-sm" id="conclaveMapBtn"><i class="bi bi-map"></i> Show map</button>`
            })}
            ${section("The way forward", html`<div class="forward-grid">${WAY_FORWARD.map(([title, items], i) => html`
                <div class="forward-card"><span class="forward-num">${i + 1}</span><strong>${title}</strong><ul>${items.map(t => html`<li>${t}</li>`)}</ul></div>`)}</div>`, { id: "conclave-forward" })}`);

        view.querySelectorAll("[data-scroll]").forEach(a => a.addEventListener("click", event => {
            event.preventDefault();
            view.querySelector(a.getAttribute("href")).scrollIntoView({ behavior: "smooth", block: "start" });
        }));

        let hospitals;

        try {
            hospitals = await ConnectAPI.rows({
                collection: "ConclaveHsptl",
                query: { isDeleted: false },
                projection: {
                    _id: 1, hospitalName: 1, hospitalWebsite: 1, hospitalPincode: 1, hospitalPhone: 1, hospitalEmail: 1, hospitalBedStrength: 1,
                    hospitalLatitude: 1, hospitalLongitude: 1, hospitalState: 1,
                    hospitalImages: { $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } } }
                }
            });
        } catch (error) {
            view.querySelector("#participants").innerHTML = String(errorState(error.message));
            return;
        }

        view.querySelector("#participants").innerHTML = hospitals.length
            ? String(html`<div id="conclaveMap" class="map-canvas hidden"></div><div class="media-grid">${hospitals.map(h => html`
                <article class="card media-card">
                    ${img(h.hospitalImages?.[0]?.url, h.hospitalName, "media-card-img")}
                    <div class="media-card-body"><h3>${h.hospitalName}</h3></div>
                    <div class="media-card-footer">
                        ${safeUrl(h.hospitalWebsite) ? html`<a class="btn btn-ghost btn-sm" href="${safeUrl(h.hospitalWebsite)}" target="_blank" rel="noopener"><i class="bi bi-globe"></i> Website</a>` : Kit.raw("<span></span>")}
                        <a class="btn btn-secondary btn-sm" href="#/conclave/${encodeURIComponent(h._id)}">Read more <i class="bi bi-arrow-right"></i></a>
                    </div>
                </article>`)}</div>`)
            : String(emptyState("bi-bank", "No participants listed"));

        let mapShown = false;

        view.querySelector("#conclaveMapBtn").addEventListener("click", event => {

            const mapEl = view.querySelector("#conclaveMap");

            if (!mapEl) return;

            mapEl.classList.toggle("hidden");
            event.currentTarget.innerHTML = mapEl.classList.contains("hidden") ? '<i class="bi bi-map"></i> Show map' : '<i class="bi bi-grid"></i> Hide map';

            if (!mapShown) {
                mapShown = true;
                renderMap(mapEl, hospitals.map(h => ({ lat: h.hospitalLatitude, lng: h.hospitalLongitude, title: h.hospitalName, info: String(html`<strong>${h.hospitalName}</strong>`) })));
            }

        });

    }


    // -----------------------------------------------------------------
    // Shiloh
    // -----------------------------------------------------------------

    const SHILOH_TALKS = [
        {
            name: "Dr. Sedevi Angami",
            slot: "Morning plenary",
            bio: "Director of the Christian Institute of Health Sciences and Research (CIHSR), Dimapur, Nagaland. DM in Gastroenterology from CMC, with additional degrees in Bioethics and Hospital Management. Passionate about coaching, encouraging and enabling people to reach their full potential.",
            sessions: ["https://www.youtube.com/live/0wsUFx7xhGY", "https://www.youtube.com/live/I2nGyAAJN1Q", "https://www.youtube.com/live/p2w9mItwyMQ"]
        },
        {
            name: "Dr. Prabhu Singh",
            slot: "Evening plenary",
            bio: "Missiological anthropologist with a PhD in Intercultural Studies from Asbury Seminary, Kentucky. Over 30 years of ministry with the Union of Evangelical Students of India and Ambassadors for Christ; focuses on mission mobilization and developing next-generation leaders.",
            sessions: ["https://www.youtube.com/live/jDghz2LP308", "https://www.youtube.com/live/Y_Km48uYG7g", "https://www.youtube.com/live/aGiw4JeatJQ"]
        }
    ];

    function renderShiloh(view) {

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "“Then the whole congregation of the people of Israel assembled at Shiloh.” — Joshua 18:1",
                title: "Shiloh",
                icon: "bi-heart",
                color: "red",
                description: "A movement that seeks to nurture young students spiritually and develop leaders in the healing ministry of Christ.",
                actions: html`<a class="btn btn-primary" href="https://shilohcmc.org/" target="_blank" rel="noopener">Visit shilohcmc.org <i class="bi bi-box-arrow-up-right"></i></a>`
            })}
            <section class="feature-banner card">
                <video class="feature-banner-img" src="${S3}_22fbf2fc49b3707a7fe2467919b872e7_Pictures.mp4" muted loop playsinline autoplay></video>
                <div class="feature-banner-copy">
                    <h2>About Shiloh</h2>
                    <p>Shiloh is a forum where students can gain insight into Christian healthcare work within the country and abroad. Every year, nearly 1000 students (medical, dental, nursing and paramedical) attend this conference from medical colleges and institutions across India.</p>
                    <p class="text-muted">Would you like to know more about Shiloh and see how you can be a part of it?</p>
                    <a class="btn btn-secondary" href="https://shilohcmc.org/" target="_blank" rel="noopener">Read more</a>
                </div>
            </section>
            ${section("Listen to some of our speakers", html`<div class="speaker-grid">${SHILOH_TALKS.map(t => html`
                <article class="speaker-card">
                    <span class="badge badge-accent">${t.slot}</span>
                    <h3>${t.name}</h3>
                    <p class="text-muted">${t.bio}</p>
                    <div class="speaker-sessions">${t.sessions.map((url, i) => html`
                        <button type="button" class="btn btn-secondary btn-sm" data-talk="${url}" data-title="${t.name} – Day ${i + 1}"><i class="bi bi-play-circle"></i> Day ${i + 1}</button>`)}</div>
                </article>`)}</div>`, { description: "From the plenary sessions of Shiloh 2025" })}`);

        view.querySelectorAll("[data-talk]").forEach(button => button.addEventListener("click", () => openVideo(button.dataset.title, button.dataset.talk)));

    }


    // -----------------------------------------------------------------
    // Second-Opinion Connect
    // -----------------------------------------------------------------

    const CONSULTANTS = [
        ["Dr Rajshekhar Vedantam", "Neurosurgery / Neurology"],
        ["Dr Rupa Vedantam", "ENT"],
        ["Dr Antony Devasia", "Urology"],
        ["Dr OC Abraham", "General Medicine"],
        ["Dr KS Jacob", "Psychiatry"]
    ];

    const SCHEDULE = [
        ["Monday", [["11 am – 12 pm", "Psychiatry"], ["2 pm – 3 pm", "Neurosurgery / Neurology"]]],
        ["Tuesday", [["11 am – 12 pm", "Neurosurgery / Neurology"], ["3 pm – 4 pm", "General Medicine"]]],
        ["Wednesday", [["2 pm – 3 pm", "Urology"]]],
        ["Thursday", [["11 am – 12 pm", "Psychiatry"], ["2 pm – 3 pm", "ENT"]]]
    ];

    const STEPS = [
        ["bi-person-check", "Patient assessment", "The physician at the spoke evaluates a patient who may require specialized consultation."],
        ["bi-camera-video", "Teleconsultation", "Complete an e-request form to consult with any specialist you'd like to connect with."],
        ["bi-chat-square-heart", "Expert advice", "Once confirmed, the consultant offers advice, diagnoses, and guidance on treatment or tests."],
        ["bi-clipboard2-check", "Implementation", "The physician at the spoke implements the recommended advice into the patient's care plan."]
    ];

    function renderSecondOpinion(view) {

        view.innerHTML = String(html`
            ${pageHeader({
                eyebrow: "A provider-to-provider teleconsultation program",
                title: "Second-Opinion Connect",
                icon: "bi-chat-square-heart",
                color: "teal",
                description: "Welcome to Second-opinion Connect! We are thankful for this opportunity to offer virtual support and guidance through this dedicated platform.",
                actions: html`<a class="btn btn-primary" href="https://www.cognitoforms.com/DistanceEducationCMCVellore/SECONDOPINIONCONNECT" target="_blank" rel="noopener">Register <i class="bi bi-box-arrow-up-right"></i></a>`
            })}
            ${section("How does this work?", html`<ol class="steps">${STEPS.map(([icon, title, text]) => html`
                <li><span class="step-icon"><i class="bi ${icon}"></i></span><strong>${title}</strong><span class="text-muted">${text}</span></li>`)}</ol>`)}
            <div class="two-col">
                ${section("Consultants", html`<ul class="person-list">${CONSULTANTS.map(([name, dept]) => html`
                    <li><span class="avatar">${Kit.initials(name.replace(/^Dr\.?\s*/, ""))}</span><div><strong>${name}</strong><br><span class="text-muted">${dept}</span></div></li>`)}</ul>`)}
                ${section("Our schedule", html`<div class="schedule">${SCHEDULE.map(([day, slots]) => html`
                    <div class="schedule-day"><strong>${day}</strong>${slots.map(([time, dept]) => html`<div class="schedule-slot"><span class="badge">${time}</span> ${dept}</div>`)}</div>`)}</div>`)}
            </div>`);

    }


    // -----------------------------------------------------------------
    // Contact (openModal('contactMissions') in modal.js)
    // -----------------------------------------------------------------

    const OFFICE = [
        { salutation: "Dr.", name: "Jachin Velavan", employeeNo: "28170", designation: "Associate Director (Missions)" },
        { salutation: "Dr.", name: "Anne Jennifer Prabhu", employeeNo: "28224", designation: "Deputy Director (Missions)" },
        { salutation: "Dr.", name: "Sebin G Abraham", employeeNo: "29425", designation: "Institutional Missions Coordinator" },
        { salutation: "Dr.", name: "Carol", employeeNo: "28941", designation: "Network Research Coordinator" },
        { salutation: "Ms.", name: "Bency Vinitha Chhatria", employeeNo: "43753", designation: "Missions Network Coordinator" },
        { salutation: "Mr.", name: "Abishek P", employeeNo: "P4541", designation: "Mission Help-desk Coordinator" },
        { salutation: "Ms.", name: "Sharon Roshan", employeeNo: "P4542", designation: "Missions Communication Officer" },
        { salutation: "Mr.", name: "Xavier Raja", employeeNo: "T6506", designation: "Missions Programmer" }
    ];

    async function renderContact(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Missions Department – Directorate", title: "Contact the Missions office", icon: "bi-headset", color: "blue", description: "For assistance with anything on CMC V Connect, please get in touch." })}
            <div class="contact-cards">
                <a class="card contact-card" href="mailto:missionsoffice@cmcvellore.ac.in"><i class="bi bi-envelope"></i><span class="stat-label">Email</span><strong>missionsoffice@cmcvellore.ac.in</strong></a>
                <a class="card contact-card" href="tel:+914162286117"><i class="bi bi-telephone"></i><span class="stat-label">Phone</span><strong>0416 - 228 6117 / 6229</strong></a>
                <div class="card contact-card"><i class="bi bi-geo-alt"></i><span class="stat-label">Address</span><strong>CMC Vellore – 632007</strong></div>
            </div>
            ${section("Mission office members", html`<div id="office" class="person-grid">${OFFICE.map(personCard)}</div>`)}`);

        // Avatars from Faculties, as in the git modal
        try {

            const faculties = await ConnectAPI.rows({
                collection: "Faculties",
                query: { employeeNo: { $in: OFFICE.map(m => m.employeeNo) }, isDeleted: "false" },
                projection: { _id: 1, firstName: 1, lastName: 1, employeeNo: 1, avatar: 1 }
            });

            const merged = OFFICE.map(m => ({ ...m, avatar: faculties.find(f => f.employeeNo === m.employeeNo)?.avatar }));

            view.querySelector("#office").innerHTML = merged.map(m => String(personCard(m))).join("");

        } catch (error) {
            /* keep the list without photos */
        }

    }

    function personCard(m) {

        return html`
            <div class="card person-card">
                ${m.avatar ? img(m.avatar, m.name, "person-img") : html`<span class="avatar avatar-lg">${Kit.initials(m.name)}</span>`}
                <strong>${m.salutation} ${m.name}</strong>
                <span class="text-muted">${m.designation}</span>
            </div>`;

    }


    // -----------------------------------------------------------------
    // Guide
    // -----------------------------------------------------------------

    function renderGuide(view) {

        const available = App.modules().filter(m => m.nav !== false && App.canAccess(m) && m.id !== "guide");

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "User guide", title: "Explore CMC V Connect", icon: "bi-question-circle", color: "gray", description: "Discover what each module offers and how to get started." })}
            ${section("How CMC V Connect works", html`<ol class="steps">
                <li><span class="step-icon">01</span><strong>Choose a module</strong><span class="text-muted">Pick a service from the sidebar or the dashboard tiles.</span></li>
                <li><span class="step-icon">02</span><strong>Follow the guide</strong><span class="text-muted">Each page explains what it shows and what you can do there.</span></li>
                <li><span class="step-icon">03</span><strong>Get started</strong><span class="text-muted">Use the module, and reach the Missions office if you need help.</span></li>
            </ol>`)}
            ${section("Available to you", html`<div class="guide-grid">${available.map(m => html`
                <a class="card guide-card" href="#/${m.id}">
                    <div class="api-icon ${m.color}"><i class="bi ${m.icon}"></i></div>
                    <div><strong>${m.title}</strong><p class="text-muted">${m.description || ""}</p></div>
                </a>`)}</div>`)}
            ${section("Coming in the next update", html`<p class="text-muted">Mandatory Mission Service (MMS), Mission Visits, Mission Sabbatical, Mentorship, Legal Help, Finance, Equipment &amp; Resources, Library Access, Manpower Requests, Network Consults, FOV and SAM grants, the Research Request form and Feedback are moving to the new portal next.</p>`)}
            <div class="notice card">
                <i class="bi bi-life-preserver"></i>
                <div><strong>Need help?</strong><br><span class="text-muted">If you are unsure where to find a feature, reach out to the Missions office.</span></div>
                <a class="btn btn-secondary" href="#/contact">Contact support</a>
            </div>`);

    }


    App.register({ id: "conclave", title: "Medical Colleges Conclave", icon: "bi-bank", color: "orange", group: "Community", audiences: ["missions", "student"], description: "Christian medical colleges working together: agenda, participants and next steps.", render: renderConclave });
    App.register({ id: "shiloh", title: "Shiloh", icon: "bi-heart", color: "red", group: "Community", audiences: ["missions", "student"], description: "Student movement nurturing leaders in the healing ministry of Christ.", render: renderShiloh });
    App.register({ id: "second-opinion", title: "Second-Opinion Connect", icon: "bi-chat-square-heart", color: "teal", group: "Missions", audiences: ["missions"], description: "Provider-to-provider teleconsultation with CMC specialists.", render: renderSecondOpinion });
    App.register({ id: "contact", title: "Contact", icon: "bi-headset", color: "blue", group: "Help", description: "Reach the Missions office.", render: renderContact });
    App.register({ id: "guide", title: "Guide", icon: "bi-question-circle", color: "gray", group: "Help", description: "What each module offers and how to get started.", render: renderGuide });

})();
