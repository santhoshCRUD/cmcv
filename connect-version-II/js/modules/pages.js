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

    // Agenda and summaries: verbatim from views/academic_conclave.html
    const AGENDA = [
        {
            title: "Medical Education",
            speakers: [
                "Christian Medical College, Vellore – Dr. Solomon Sathiskumar, Principal",
                "Pondicherry Institute of Medical Sciences - Dr. Renu G’Boy Varghese, Director- Principal",
                "Father Muller Medical College, Mangalore - Dr Antony Sylvan D Souza, Dean",
                "Amala Institute of Medical Sciences, Thrissur - Dr. Betsy Thomas"
            ],
            summary: [["", [
                "Varying college fee structures create mindset challenges that impact student motivation for missions.",
                "There is a need for an advocacy body to represent medical education to the government.",
                "Integrating humanities and communication workshops fosters empathy through behavioral modeling.",
                "The INSPIRE program at Believer’s Medical College exposes students early to healthcare operations, promoting appreciation for all hospital roles.",
                "An Interns Exit Exam is proposed to ensure qualitative assessment of graduates."
            ]]]
        },
        {
            title: "Medical Services",
            speakers: [
                "Christian Medical College, Vellore - Dr. I Rajesh, Medical Superintendent",
                "Malankara Orthodox Syrian Church Medical College Hospital, Kolenchery - Dr. Vergis Paul, Medical Superintendent",
                "Dr. Somervell Memorial CSI Hospital & Medical College, Thiruvananthapuram - Dr. Bennet Abraham – Director",
                "Pushpagiri Medical College, Thiruvalla -Dr. Vikram Gowda"
            ],
            summary: [
                ["Modeling & Integrating Service and Education", ["Engage students early through hospital visits and shadowing", "Support diverse learners by identifying and nurturing training needs", "Empower junior faculty via mission postings and mentoring", "Prioritize outreach to high school students"]],
                ["Cultivating Compassion & Empathy: The Role Model Effect", ["Emphasize soft skills through humanities and reflective sessions", "Foster holistic health understanding via patient journey tracking and narratives", "Affirm faith and Christ-centered role modeling", "Recommend soft skills assessment in internship exams"]],
                ["Collaboration Ideas", ["Facilitate high school student engagement in mission hospitals and Christian medical colleges"]],
                ["Key Takeaways and Next Steps", ["Recognize evolving academic environments and student attitudes", "Invest in mentorship, as students learn more from seniors than lectures", "Involve churches and families in student engagement programs"]]
            ]
        },
        {
            title: "Research",
            speakers: [
                "Christian Medical College Vellore - Dr Suceena Alexander",
                "Christian Medical College, Ludhiana - Dr William Bhatti",
                "Jubilee Mission Medical College and Research Institute, Thrissur - Dr. Benny Joseph, CEO"
            ],
            summary: [["", [
                "Prioritize socially relevant research topics that address community needs and national impact.",
                "Balance basic science with public health priorities in research agendas.",
                "Initiate collaborations early in the proposal process for greater effectiveness.",
                "Target underexplored research areas to maximize impact.",
                "Draw inspiration from institutional examples in geriatric care, autism, and leprosy.",
                "Adopt a comprehensive ten-point action plan: Engage stakeholders, Identify problems, Assess impact, Evaluate resources, Develop roadmaps, Monitor progress, Conduct interim analyses, Encourage publication, Disseminate results, Maintain post-implementation surveillance.",
                "Emphasize multidisciplinary approaches, such as integrating rehabilitation in research on alcoholic pancreatitis.",
                "Establish robust research systems (e.g., IRB) to teach ethics and sound methodology from the outset.",
                "Foster a culture of research integrity and community-driven motivation, moving beyond career advancement.",
                "Improve student research through: encouraging publication of negative results, ensuring regular supervision, setting realistic targets, and adhering to CONSORT guidelines."
            ]]]
        },
        {
            title: "Outreach",
            speakers: [
                "Christian Medical College Vellore: Urban Outreach - Dr Venkatesan S, HOD, Family Medicine",
                "Rural Outreach - Dr Venkata Raghava, HOD, Community Medicine",
                "Mission Outreach - Dr Jachin Velavan, Associate Director (Missions)",
                "St. Johns Medical College, Bangalore - Dr. George D’Souza, Dean",
                "Believers Church Medical College Hospital, Thiruvalla - Dr. George Chandy, Director"
            ],
            summary: [["", [
                "Revise the medical curriculum to immerse students in underserved communities from the beginning, fostering responsibility and understanding of community needs.",
                "Integrate community engagement into education by creating opportunities for students to collaborate with local organizations and learn in real-world community settings.",
                "Strengthen the Family Adoption Program as mandated by the NMC to deepen student connections with families in need.",
                "Expand student learning beyond hospitals to include community health centers and clinics in underserved or needy areas through targeted postings.",
                "Encourage student research on community health issues such as disparities, access to care, and social determinants of health.",
                "Align community-based educational experiences with the actual health needs and priorities of local populations.",
                "Promote interdisciplinary collaboration by involving various departments in community outreach and helping students understand broader impacts of illness and treatment.",
                "Emphasize the teaching of social determinants of health—such as poverty, housing, education, and food security—within the curriculum.",
                "Highlight the importance of ethical conduct, compassion, and role modeling for students to inspire a genuine commitment to serving communities.",
                "Discuss ethical considerations such as equity and disparities in healthcare access.",
                "Facilitate partnerships between medical colleges and mission hospitals by sharing best practices, creating common frameworks, and identifying key contacts.",
                "Plan collaborative outreach by sharing information well in advance to maximize support and effectiveness.",
                "Develop model initiatives (e.g., SHP, MMS) to expose students and faculty to mission hospitals, ensuring realistic and relevant training.",
                "Aim for a socially responsible, community-focused medical education system through ongoing collaboration and innovation."
            ]]]
        }
    ];

    const WAY_FORWARD = [
        ["Common Consortium", ["Identify a single point of contact in each Medical College for HR needs.", "To form a common consortium of all Christian Medical Colleges and to explore CCH as a possible body to expand its scope of engagement."]],
        ["Sharing Best Practices", ["Developing a Common Minimum on various verticals – Resources, manpower, Ethics, Values.", "Colleges to exchange experiences and strategies for effective outreach.", "Common Research Journal.", "Research training/educational workshops."]],
        ["Engaging Students", ["Meeting High School Students and organising Open College Days.", "Engaging students through Mission Hospitals – expand SHP/MMP like programs.", "Facilitate Educational Webinars."]],
        ["Bettering Patient Care", ["Create channels for referral of patients for Tertiary Care.", "Platform for Centralized Resource Facilitation – Pharmacy, Equipment.", "Establish a Missions Innovation Hub."]]
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
                    <p>That we can work together to improve Medical Education, Service Delivery &amp; Medical Research, and Community Outreach in India by sharing and adopting best practices and thereby generate a critical mass of competent, ethical, and socially responsible health workforce by strengthening Education, Service, Research &amp; Outreach.</p>
                    <p class="text-muted">Approximately 100,000 doctors graduate annually from over 700 medical colleges in India. Yet ‘Health for All’ is a distant reality for many in this nation. As a handful of Christian minority institutions, do we have a mandate to be change-makers and bridge this gap?</p>
                    <p>In his welcome address, Dr. Vikram Mathews encouraged all institutions to come together as minority institutions in the face of unique challenges in a rapidly changing environment and share experiences and explore ways of collaborating in areas of complementary strengths.</p>
                </div>
            </section>
            <div class="fact-grid">
                <div class="card fact">Currently, there are 12 Christian Minority Medical Colleges each with a legacy of making transformational impact in terms of medical service, education, research, and outreach.</div>
                <div class="card fact fact-dark">The conclave was a first step toward understanding each institution's strengths and identifying colloboration opportunities.</div>
                <div class="card fact">A major takeaway was the need for a formal body to nurture collaborative initiatives, advocacy, joint government representations and research.</div>
                <div class="card fact">Key proposals included creating referral channels for tertiary care, developing a missions innovation hub, and sharing manpower.</div>
            </div>
            ${section("Agenda at a glance…", html`<div class="accordion-list">${AGENDA.map(a => html`
                <details class="accordion-item-lite">
                    <summary><strong>${a.title}</strong><span class="text-muted">${a.speakers.length} presentations</span></summary>
                    <h4 class="detail-subhead">Presentations</h4>
                    <ul>${a.speakers.map(s => html`<li>${s}</li>`)}</ul>
                    <h4 class="detail-subhead">Summary</h4>
                    ${a.summary.map(([heading, points]) => html`${heading ? html`<h5 class="detail-minor">${heading}</h5>` : ""}<ul>${points.map(p => html`<li>${p}</li>`)}</ul>`)}
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
        { salutation: "Mr.", name: "Xavier Raja", employeeNo: "T6506", designation: "Missions Programmer" },
        { salutation: "Ms.", name: "Jibi", employeeNo: "44666", designation: "Missions Communication Officer" },
        { salutation: "Mr.", name: "Santhosh kumar", employeeNo: "55896", designation: "Missions Programmer" }
    ];

    async function renderContact(view) {

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "Missions Department- Directorate", title: "Contact", icon: "bi-headset", color: "blue", description: "For assistance in Missions Department, please contact" })}
            <div class="contact-cards">
                <a class="card contact-card" href="mailto:missionsoffice@cmcvellore.ac.in"><i class="bi bi-envelope"></i><span class="stat-label">Email</span><strong>missionsoffice@cmcvellore.ac.in</strong></a>
                <a class="card contact-card" href="tel:+914162286117"><i class="bi bi-telephone"></i><span class="stat-label">Phone</span><strong>0416 - 228 6117 / 6229</strong></a>
                <div class="card contact-card"><i class="bi bi-geo-alt"></i><span class="stat-label">Address</span><strong>CMC Vellore - 632007</strong></div>
            </div>
            ${section("Mission Office Members", html`<div id="office" class="person-grid">${OFFICE.map(personCard)}</div>`)}`);

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

    // Copy from views/guidePage.html; each card links to the module when
    // the user can open it.
    const GUIDE = [
        ["Mission Service", "Manage your Mandatory Mission Service activities through CMC V Connect.", [
            ["mms", "📝", "MMS Application", "Start and manage a Mandatory Mission Service application from your MMS dashboard.", ["MMS Dashboard", "Application", "Application Tracking"]],
            ["mms", "📤", "Upload Certificate", "Upload your Indemnity Certificate against an approved MMS visit.", ["Certificate Upload", "MMS Visit", "Document Management"]]
        ]],
        ["Explore Modules", "Access different services and resources available through CMC V Connect.", [
            ["mission-visits", "✈️", "Mission Visits", "Track manpower requests and mission visit status.", ["Visit Tracking", "Manpower Requests"]],
            [null, "🌴", "Mission Sabbatical", "Apply for and track mission sabbatical requests.", ["Applications", "Request Tracking"]],
            ["legal-help", "⚖️", "Legal Help", "Request legal assistance for your mission hospital.", ["Legal Assistance", "Requests"]],
            ["equipment", "🩺", "Equipment & Resources", "Browse and request available equipment for your hospital.", ["Browse Equipment", "Resource Requests"]],
            ["library-access", "📚", "Library Access", "Request access to library and learning resources.", ["Library Resources", "Learning Materials"]],
            ["research", "🔬", "Research", "Browse research news, publications and grand rounds.", ["Research", "Publications", "Grand Rounds"]],
            ["network-consults", "🩺", "Network Consult", "Second-opinion and patient workspace for network hospitals.", ["Second Opinion", "Network Workspace"]],
            ["contact", "💬", "Contact Us", "Reach the Missions Office for help with anything on Connect.", ["Missions Office", "Support"]]
        ]]
    ];

    function renderGuide(view) {

        const open = id => {
            const module = id && App.find(id);
            return module && App.canAccess(module) ? id : null;
        };

        view.innerHTML = String(html`
            ${pageHeader({ eyebrow: "User Guide", title: "Explore CMC V Connect", icon: "bi-question-circle", color: "gray", description: "Discover what each module offers, how it helps mission hospitals, and how to get started." })}
            ${GUIDE.map(([title, text, cards]) => section(title, html`<div class="guide-grid">${cards.map(([id, emoji, name, desc, features]) => {
                const target = open(id);
                const body = html`<span class="guide-emoji" aria-hidden="true">${emoji}</span><div><strong>${name}</strong><p class="text-muted">${desc}</p><ul class="guide-features">${features.map(f => html`<li>${f}</li>`)}</ul>${id ? "" : html`<span class="badge">Coming Soon</span>`}</div>`;
                return target
                    ? html`<a class="card guide-card" href="#/${target}">${body}</a>`
                    : html`<div class="card guide-card is-muted">${body}</div>`;
            })}</div>`, { description: text }))}
            ${section("How CMC V Connect Works", html`<ol class="steps">
                <li><span class="step-icon">01</span><strong>Choose a Module</strong><span class="text-muted">Select the service or resource you want to explore.</span></li>
                <li><span class="step-icon">02</span><strong>Follow the Guide</strong><span class="text-muted">Follow the available instructions to understand the module workflow.</span></li>
                <li><span class="step-icon">03</span><strong>Get Started</strong><span class="text-muted">Use the module to perform the available activities and track your requests.</span></li>
            </ol>`, { description: "A simple way to discover and use the services available through the platform." })}
            <div class="notice card">
                <i class="bi bi-life-preserver"></i>
                <div><strong>We're here to help</strong><br><span class="text-muted">If you are unsure about where to find a feature or how to use a module, reach out to the Missions Office for assistance.</span></div>
                <button type="button" class="btn btn-primary" data-ask><i class="bi bi-chat-dots"></i> Ask the guide</button>
                <a class="btn btn-secondary" href="#/contact">Contact Support</a>
            </div>`);

        view.querySelector("[data-ask]").addEventListener("click", () => document.querySelector(".assistant-fab")?.click());

    }


    App.register({ id: "conclave", title: "Medical Colleges Conclave", icon: "bi-bank", color: "orange", group: "Community", audiences: ["missions", "student"], description: "Medical Colleges Conclave 2025: agenda, participants and the way forward.", render: renderConclave });
    App.register({ id: "shiloh", title: "Shiloh", icon: "bi-heart", color: "red", group: "Community", audiences: ["missions", "student"], description: "A movement that seeks to nurture young students spiritually and develop leaders in the healing ministry of Christ.", render: renderShiloh });
    App.register({ id: "second-opinion", title: "Second-Opinion Connect", icon: "bi-chat-square-heart", color: "teal", group: "Missions", audiences: ["missions"], description: "A Provider-to-Provider Teleconsultation program.", render: renderSecondOpinion });
    App.register({ id: "contact", title: "Contact", icon: "bi-headset", color: "blue", group: "Help", description: "For assistance in Missions Department, please contact the Missions Office.", render: renderContact });
    App.register({ id: "guide", title: "Guide", icon: "bi-question-circle", color: "gray", group: "Help", description: "Discover what each module offers, how it helps mission hospitals, and how to get started.", render: renderGuide });

})();
