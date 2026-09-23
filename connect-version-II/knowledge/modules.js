/**
 * Knowledge base for the module guide chatbot (routes/assistant.js).
 *
 * Every entry is taken from the git code (santhoshCRUD/cmcv views/*.html,
 * modal.js, templates.js and the module logic in formLoad.js / app.js).
 * Keep it that way: the assistant is told to answer only from this text.
 *
 * Entry: { id, title, route, access, summary, steps?, notes?, contacts?, keywords }
 *   route  - version II hash route the assistant can link to
 *   access - who sees the module (mirrors App.register gating)
 */

const MISSIONS_OFFICE = "Missions Office: missionsoffice@cmcvellore.ac.in, phone 0416-2286117 / 6229.";

module.exports = [

    {
        id: "about",
        title: "About CMC V Connect",
        route: "#/",
        access: "Everyone",
        summary: "CMC V Connect is dedicated to providing a comprehensive platform for medical professionals, students, and individuals who share the ethos of CMC Vellore — \"Not to be ministered unto, but to minister\". It is a hub for engaging in discussions, accessing educational resources, and sharing ideas, knowledge, and expertise. It offers online courses, reading materials, second opinions for patient care, training opportunities, skill development workshops and job vacancies in mission hospitals, plus legal assistance and guidance for NABH certification.",
        notes: [
            "Who can connect? Anyone with a heart for service: health professionals, volunteers, donors, well-wishers, and anyone interested in India's healthcare. Students passionate about serving in different regions of India are especially encouraged to join.",
            "How do I connect? Fill out the form on the sign-up page (\"Register now\" on the login page) and the Missions Office at CMC Vellore will contact you. Registration requests are reviewed by the Missions Office before an account is created.",
            "The dashboard (Home) shows the thought for the day, news, what's new, ongoing grand rounds and, for hospital administrators, the hospitals allotted to you."
        ],
        contacts: [MISSIONS_OFFICE, "Address: CMC Vellore - 632004"],
        keywords: ["about", "connect", "register", "sign up", "signup", "account", "login", "join", "ethos", "home", "dashboard"]
    },

    {
        id: "contact",
        title: "Contact",
        route: "#/contact",
        access: "Everyone",
        summary: "For assistance in the Missions Department, contact the Missions Department - Directorate: missionsoffice@cmcvellore.ac.in, phone 0416-228 6117 / 6229.",
        notes: [
            "Mission Office Members: Dr. Jachin Velavan (28170, Associate Director (Missions)); Dr. Anne Jennifer Prabhu (28224, Deputy Director (Missions)); Dr. Sebin G Abraham (29425, Institutional Missions Coordinator); Dr. Carol (28941, Network Research Coordinator); Ms. Bency Vinitha Chhatria (43753, Missions Network Coordinator); Mr. Abishek P (P4541, Mission Help-desk Coordinator); Ms. Sharon Roshan (P4542, Missions Communication Officer); Mr. Xavier Raja (T6506, Missions Programmer); Ms. Jibi (44666, Missions Communication Officer); Mr. Santhosh kumar (55896, Missions Programmer)."
        ],
        contacts: [MISSIONS_OFFICE],
        keywords: ["contact", "help", "support", "phone", "email", "missions office", "who", "staff", "team"]
    },

    {
        id: "hospitals",
        title: "Mission Hospitals",
        route: "#/hospitals",
        access: "Everyone signed in",
        summary: "CMC's mission hospital network comprises around 200 hospitals across the country, primarily serving rural and underserved regions. In many of these areas, these hospitals are the only source of accessible, affordable, and dependable healthcare. The interactive map allows you to view them and identify opportunities to contribute.",
        steps: [
            "Open Mission Hospitals from the menu.",
            "Use the State filter (Missions users can also filter by department and manpower needs) and switch between Network and Non Network hospitals.",
            "Open a hospital to see its details, departments, bed strength and gallery."
        ],
        keywords: ["hospital", "hospitals", "map", "network", "mission hospital", "state", "location"]
    },

    {
        id: "my-hospital",
        title: "My hospital (hospital administrators)",
        route: "#/my-hospital",
        access: "Hospital administrators with allotted mission hospitals",
        summary: "Hospital administrators see their allotted hospitals on the dashboard (\"Your hospitals\"). Opening one shows the hospital workspace: hospital details, Mission Requests raised by the hospital (with a message thread to the Missions Office), and the hospital's Legal Help and Finance requests.",
        steps: [
            "On the dashboard, open a hospital under \"Your hospitals\".",
            "Mission Requests: add a request for personnel/specialists, track its status and use the messages to talk to the Missions Office.",
            "Legal Help and Finance: raise a request for the hospital and follow its status."
        ],
        keywords: ["hospital admin", "administrator", "my hospital", "mission request", "request doctor", "request specialist", "allotted"]
    },

    {
        id: "manpower",
        title: "Manpower Requests",
        route: "#/manpower",
        access: "Missions users (faculty, postgraduates and Missions-role users)",
        summary: "Manpower Requests lists the personnel needs mission hospitals have placed with the Missions Office (open and in-progress requests): the hospital, department/specialization and the dates they need help.",
        steps: [
            "Open Manpower Requests from the menu.",
            "Search or sort the table by hospital, specialization or dates.",
            "If you are interested in serving, contact the Missions Office or use Mission Visits to register your interest."
        ],
        contacts: [MISSIONS_OFFICE],
        keywords: ["manpower", "vacancy", "vacancies", "personnel", "need", "needs", "job", "jobs", "serve"]
    },

    {
        id: "engagement",
        title: "Mission Engagement",
        route: "#/engagement",
        access: "Faculty",
        summary: "Mission Engagement encompasses various programs designed by CMC to foster collaborative engagements that enable faculty from the Institution to engage with various mission hospitals. CMC's Mission Hospitals Network encompasses over 170 mission hospitals that operate primarily in remote or resource-limited regions. Currently there are 3 broad programs: Mandatory Mission Service, Missions Sabbatical and Mission Hospital Visits. The Missions Department coordinates these engagements.",
        notes: [
            "Mission Sabbatical: a structured opportunity for senior faculty to take short sabbatical leave of 6 months in a mission hospital, to decentralize and develop education, service and research and to mentor young graduates and postgraduates posted for service commitment. Faculty continue receiving full CMC salary and benefits as per institutional sabbatical policies; travel and accommodation support are provided by the mission hospitals; it does not entail an additional service obligation. The Sabbatical application page is coming soon.",
            "Mission Hospital Visits (Secondary Hospital Posting or short deputations) serve three purposes: clinical & non-clinical support, training and mentorship, and assessment and collaboration."
        ],
        keywords: ["engagement", "sabbatical", "faculty", "program", "programs", "deputation"]
    },

    {
        id: "mms",
        title: "Mandatory Mission Service (MMS)",
        route: "#/mms",
        access: "Faculty",
        summary: "The Mandatory Mission Service is part of a Faculty Engagement Program with Mission Hospitals, designed for medical faculty to have an orientation to healthcare needs in the country, resources available and healthcare practice in mission hospitals. All medical faculty (preclinical, paraclinical and clinical) are required to spend 14 days in select mission hospitals twice during their career: once before confirmation and later before promotion to Professor level.",
        steps: [
            "1. Planning and Selection: obtain initial permission from your HOD/HOU; use the interactive map to view eligible Mission Hospitals for MMS; choose a hospital with guidance from the Missions Office (queries answered within 1 week); contact the hospital administrator to confirm scheduling and logistics.",
            "2. Application and Approval: fill out and submit the Application form on the portal (\"Apply Here\" on the MMS page) after assessing the needs of the hospital; the Missions Office approves/rejects within a week; monitor the status in the portal. You can save the application as a draft before submitting.",
            "3. Upcoming Visit Preparation: after the approval email, request deputation leave from the Associate Director (Medical); the MS Office issues the Indemnity Certificate; the Missions Office emails you, your HOD and the hospital confirming the visit.",
            "4. Visit and Post-Visit Report: collect information about the hospital useful for others; update your visit details in the form to record the visit for confirmation/promotion; use insights in teaching and research.",
            "Other visits within the past three years (camps, SHPs, departmental activities) can be submitted with supporting documentation using \"Enter Other Visit Details\"."
        ],
        notes: [
            "How many days? Preferably a single visit of 2 weeks, or two visits of one week each. Visits within three years prior to confirmation/promotion can be considered; at least 7 of the 14 days must be spent working directly at a mission hospital.",
            "When is it mandatory? When due for confirmation and when due for promotion to professorship. Those completing their service obligation can finish MMS with HOD consultation during that period.",
            "How can it be done? By accompanying medical students on a Secondary Hospital Program (SHP) - if shorter than two weeks, make up the remaining days - or by applying directly for a service posting.",
            "Choosing a hospital: MHs in areas of need or that requested HR may be highlighted. Mission hospitals in South Indian capital cities or near CMC are excluded. Pre-clinical and para-clinical faculty should preferably go to centres with teaching needs (lab upgradation, staff training). If not enough hospitals have your subspecialty, choose one with the broad specialty.",
            "Travel as per eligibility; if air travel is inevitable, taxi to the nearest airport at institutional rates can be claimed. Food: enrol in the campus mess with reimbursement on bills, else Z-city rates apply. Accommodation: stay on campus where possible; submit actual bills; off-campus follows Z-city rates.",
            "Leave: deputation leave can be used, including travel days; travel days are excluded from MMS but Sundays within the service period count; annual leave can cover remaining days.",
            "Expenses are met from the department's special fund; SHP travel follows SHP guidelines from the principal's office.",
            "Spouses and children are welcome (inform the hospital in advance); their expenses are the faculty's responsibility unless visiting at the hospital's request.",
            "The Mission Hospital provides the Missions department a certificate of completion. On returning, update your visit on the portal with work done, observations and suggestions."
        ],
        contacts: [MISSIONS_OFFICE],
        keywords: ["mms", "mandatory", "mission service", "confirmation", "promotion", "professor", "indemnity", "certificate", "shp", "apply", "application", "draft", "14 days", "leave", "reimbursement"]
    },

    {
        id: "mission-visits",
        title: "Mission Visits",
        route: "#/mission-visits",
        access: "Faculty",
        summary: "Our mission hospital network comprises approximately 200 hospitals operated by various church missions, spread across the country, in rural areas serving communities that would otherwise lack access to affordable and reliable medical care. If you have visited any mission hospital, please share your experiences (\"Upload your Visit\"). You can also see the personnel mission hospitals have asked for and register your interest.",
        steps: [
            "Open Mission Visits and choose \"Upload your Visit\" to record a visit and share your experience.",
            "Under \"Are you interested?\", browse hospitals' personnel needs on the map or table and mark your interest.",
            "Read \"Notes from the journey\" - experiences shared by others."
        ],
        notes: ["How can you help? Clinical and non-clinical support; training and mentorship; assessment and collaboration."],
        keywords: ["visit", "visits", "upload visit", "experience", "journey", "interest", "interested", "notes"]
    },

    {
        id: "grants",
        title: "Grants",
        route: "#/grants",
        access: "External users with the Missions role (mission hospital staff)",
        summary: "Three ways we support healing across India's mission hospitals: the FOV Grant (building and equipment), the SAM Project (training and fellowship) and the Research Grant (collaborative research).",
        notes: [
            "Research Grant: the CMC Vellore Mission Network Collaborative Research Grant fosters partnerships between CMC Vellore faculty and Mission Network Hospitals for field-based, epidemiological, clinical and translational research. Research queries: missions.research@cmcvellore.ac.in."
        ],
        keywords: ["grant", "grants", "funding", "fund", "money", "research grant"]
    },

    {
        id: "fov",
        title: "FOV Grant (Friends of Vellore UK)",
        route: "#/fov",
        access: "External users with the Missions role; the admin dashboard is for Admin users",
        summary: "Mission Hospital Grant Programme of Friends of Vellore UK, supporting mission hospitals serving poor and marginalised communities across India. Up to £12,000 (approx 14 lakhs) for one-off grants, or up to £20,000 (approx 20 lakhs) over 3 years for ongoing programme grants. Eligible: mission hospitals in the CMC Vellore network or formally affiliated with CMC, with valid FCRA registration. Applications are reviewed twice yearly (April and October). Grant duration up to 12 months for one-off grants and up to 3 years for programme grants.",
        steps: [
            "Check eligibility: CMC network/affiliation, valid FCRA registration, commitment to ethical practice, safeguarding and non-discriminatory care; the grant must be within the scope permitted by FCRA.",
            "Keep ready: FCRA Certificate, supporting documents and photos, building/equipment specifications (if applicable).",
            "Add the names of your project coordinators - all of them need access to the CMCVConnect portal.",
            "Click \"Apply For Grant\". You can save the application anytime as draft; once verified, save and Submit.",
            "Track it on the Applicant Dashboard. You will receive intimation by mail/portal; the Board may request more information.",
            "Timeline: grant opens → submit application → board review → funding decision on the portal → funds transferred → progress reports at 6 and 12 months."
        ],
        notes: [
            "We fund: medical equipment, patient treatment support, training and capacity building, essential building or infrastructure works, pilot staffing positions (max 3 years), environmental and sustainability projects.",
            "We do not fund: retrospective expenses, routine operational deficits without a sustainability plan, capital projects lacking long-term viability.",
            "Selection criteria: community impact, sustainability, strategic alignment, institutional capacity, accountability, fair distribution. Submission does not guarantee funding."
        ],
        contacts: ["Ms. Bency - 8925396116", "Mr. Abishek - 9789377354"],
        keywords: ["fov", "friends of vellore", "uk", "equipment grant", "building", "fcra", "apply grant", "applicant dashboard", "pounds"]
    },

    {
        id: "sam",
        title: "SAM Project (Dr Sunil Agarwal Memorial Fellowship)",
        route: "#/sam",
        access: "External users with the Missions role; the admin dashboard is for Missions office users",
        summary: "Established by the MBBS Alumni Batch of 1978 with the Missions Office, CMC Vellore, the fellowship sends mission and NGO hospital staff to CMC Vellore for two to four weeks of focused re-skilling. Accommodation and meals at CMC Vellore are covered; training fees are rarely charged (the Grant Committee negotiates where they are). Travel to and from the home hospital is not covered.",
        steps: [
            "Eligibility: permanent employee of a mission hospital or NGO associated with CMC Vellore in an underserved area; doctors, nurses and allied health workers; at least two years of service at the hospital; long-term commitment to continue serving there.",
            "Documents: two references (institution head/senior colleague and another colleague), CMC Vellore Visitor-Observer application with certificates and health declaration, leave sanction letter, medical fitness certificate.",
            "Click \"Apply For Grant\" and track it on the Applicant Dashboard (Draft, Submitted, Under Review, Approved, Rejected).",
            "After approval and training, submit the Training Report from the Applicant Dashboard."
        ],
        notes: [
            "Cycle: advertised each January on CMC V Connect and partner networks (CMAI, CHAI, EMFI, EHA); applications close three months later; awards announced by 15th May; the grant can be used any time within the award year. Current call closes 31st May 2026.",
            "Screening is by a committee with the Associate Director, Missions, and FOV UK."
        ],
        keywords: ["sam", "sunil agarwal", "fellowship", "training", "reskilling", "observership", "training report", "1978"]
    },

    {
        id: "equipment",
        title: "Equipment & Resources",
        route: "#/equipment",
        access: "Missions users; hospital administrators request items; the Missions office manages the register",
        summary: "A shared shelf for mission hospitals. CMC lists equipment it no longer needs here first. Each listing stays open for a couple of weeks, so if something helps, don't wait too long to ask.",
        steps: [
            "Browse Available Equipment, filter by type (Computer, Furniture, Accessory, Spare, Consumables, Instrument) and open an item to apply.",
            "Tell us how many you need, why it would help and how you will collect it, then Send Request.",
            "Can't find it? Use \"Equipment You Want\" to describe the item, category, quantity and urgency (Critical, High, Medium, Low).",
            "Track everything under My Requests."
        ],
        notes: ["Every application is reviewed against the same criteria used for grants - level of need, expected impact, readiness to deploy and fair distribution - not first come, first served."],
        keywords: ["equipment", "asset", "assets", "resources", "furniture", "computer", "instrument", "donate", "recycling"]
    },

    {
        id: "network-consults",
        title: "Network Consults",
        route: "#/network-consults",
        access: "Everyone signed in can register; request/consult/nodal pages need the NC Request, NC Consultant or NC Nodal roles",
        summary: "This initiative provides an opportunity for network doctors to engage directly with specialists at CMC to seek expert opinions on patient treatment and care. Register to begin participating in this collaborative consultation process.",
        steps: [
            "Register Now (Registry of Network Consultants) - the Missions Office reviews it.",
            "My Patient Requests (NC Request role): add a new patient case or check the status of ones you sent; open a case for its full summary, reports, images and the Q&A discussion with CMC specialists.",
            "Department Consults (NC Consultant role): patient cases sent to your department, waiting for your opinion.",
            "Nodal Overview (NC Nodal role): review new patient cases and assign them to the right specialist.",
            "Consult Topics: browse the areas our specialists are available to advise on."
        ],
        keywords: ["network consult", "register", "consultant", "consultants", "registry", "consult", "consultation", "patient", "case", "specialist", "opinion", "nodal", "theme", "themes", "nc"]
    },

    {
        id: "second-opinion",
        title: "Second-Opinion Connect",
        route: "#/second-opinion",
        access: "Missions users",
        summary: "A Provider-to-Provider Teleconsultation program offering virtual support and guidance. Consultants: Dr Rajshekhar Vedantam (Neurosurgery / Neurology), Dr Rupa Vedantam (ENT), Dr Antony Devasia (Urology), Dr OC Abraham (General Medicine), Dr KS Jacob (Psychiatry).",
        steps: [
            "Patient assessment: the physician at the spoke evaluates a patient who may need specialist consultation.",
            "Teleconsultation: complete an e-request form to consult the specialist.",
            "Expert advice: once confirmed, the consultant advises on diagnosis, treatment or tests.",
            "Implementation: the physician at the spoke implements the advice."
        ],
        notes: ["Schedule: Monday 11-12 Psychiatry, 2-3 Neurosurgery/Neurology; Tuesday 11-12 Neurosurgery/Neurology, 3-4 General Medicine; Wednesday 2-3 Urology; Thursday 11-12 Psychiatry, 2-3 ENT."],
        keywords: ["second opinion", "teleconsultation", "tele", "consultant", "schedule"]
    },

    {
        id: "legal-help",
        title: "Legal Help",
        route: "#/legal-help",
        access: "Missions users",
        summary: "Request legal assistance for your mission hospital and follow your requests (Submitted, In Progress, Completed). Submitted requests can still be edited or deleted; once completed you can view the legal team's response and download supporting documents.",
        steps: ["Open Legal Help, click Add, fill the Legal Assistance form and submit.", "Track the status in the table; open Response when completed."],
        contacts: ["Please write to us: missionsoffice@cmcvellore.ac.in, or call +91 416 228 6117."],
        keywords: ["legal", "law", "lawyer", "legal help", "legal assistance"]
    },

    {
        id: "finance",
        title: "Finance",
        route: "#/finance",
        access: "Missions users",
        summary: "Request financial guidance/help for your mission hospital and follow your requests (Submitted, In Progress, Completed). Submitted requests can be edited or deleted; completed ones show the finance team's response and supporting documents.",
        steps: ["Open Finance, click Add, fill the form and submit.", "Track the status; open Response when completed."],
        contacts: ["Please write to us: missionsoffice@cmcvellore.ac.in, or call +91 416 228 6117."],
        keywords: ["finance", "financial", "money", "accounts", "audit", "tax"]
    },

    {
        id: "library-access",
        title: "Library Access",
        route: "#/library-access",
        access: "Missions users",
        summary: "CMC's E-Library offers academic journals, e-books and learning materials for students, professionals and researchers. If you have access, log in via MyLOFT. Free journals and books of the Dodd Library are at https://dodd.cmcvellore.ac.in/.",
        steps: [
            "Before requesting, check with your Hospital Administrator whether your hospital/organization already has access (only one request per institution).",
            "To request new access or renew, fill the short Library Access form. Access is granted based on institutional affiliation, subject to approval by the Library Services team; you'll receive an email after confirmation."
        ],
        keywords: ["library", "journal", "journals", "ebook", "e-book", "myloft", "dodd", "books"]
    },

    {
        id: "nabh",
        title: "NABH Entry Level",
        route: "#/nabh",
        access: "Missions users",
        summary: "For assistance in applying for entry-level NABH accreditation from CMC, contact Dr. Lallu Joseph, Directorate - Quality Management Cell.",
        contacts: ["missionsoffice@cmcvellore.ac.in", "directorate.qmc@cmcvellore.ac.in", "Phone: 0416-2282437"],
        keywords: ["nabh", "accreditation", "quality", "qmc"]
    },

    {
        id: "feedback",
        title: "Feedback",
        route: "#/feedback",
        access: "Everyone signed in",
        summary: "Share your feedback about CMC V Connect with the Missions Office using the feedback form. \"Thank you for your valuable feedback. We will work on the points you've raised to improve our service.\"",
        keywords: ["feedback", "suggestion", "complaint", "improve"]
    },

    {
        id: "research",
        title: "Research",
        route: "#/research",
        access: "Missions and student users",
        summary: "Research brings together grants, publications, grand rounds, recent interesting publications, public health news and research legacies. Use the Research Request Form to request research support from the Missions Office.",
        steps: ["Open Research and choose \"Research Request Form\"; submit it and you'll receive an email after confirmation."],
        contacts: ["Further queries: missions.research@cmcvellore.ac.in"],
        keywords: ["research", "publication", "publications", "research request", "study", "public health"]
    },

    {
        id: "grand-rounds",
        title: "Grand Rounds",
        route: "#/grand-rounds",
        access: "Everyone signed in",
        summary: "The Grand Rounds schedule with speakers and dates; register for ongoing sessions (the Register link is open until the end date) and watch recorded Grand Rounds videos.",
        keywords: ["grand rounds", "webinar", "lecture", "video", "register", "zoom", "session"]
    },

    {
        id: "learning-resources",
        title: "Learning Resources",
        route: "#/learning-resources",
        access: "Missions and student users",
        summary: "Learning resources shared for mission hospital staff and students: courses, reading materials and videos.",
        keywords: ["learning", "resources", "course", "courses", "reading", "material", "education"]
    },

    {
        id: "clinical-snippets",
        title: "Clinical Snippets",
        route: "#/clinical-snippets",
        access: "Missions and student users",
        summary: "Short clinical learning snippets.",
        keywords: ["clinical", "snippet", "snippets"]
    },

    {
        id: "council",
        title: "Council",
        route: "#/council",
        access: "Council Members only",
        summary: "Council information, head of organization details and council documents for Council Members.",
        keywords: ["council", "council member", "documents"]
    },

    {
        id: "weekly-manna",
        title: "Weekly Manna",
        route: "#/weekly-manna",
        access: "Missions and student users",
        summary: "Weekly devotional reflections (Weekly Manna).",
        keywords: ["manna", "weekly manna", "devotion", "devotional"]
    },

    {
        id: "news",
        title: "News",
        route: "#/news",
        access: "Everyone signed in",
        summary: "News from CMC Missions.",
        keywords: ["news", "updates", "announcement"]
    },

    {
        id: "newsletter",
        title: "Missions Connect Newsletter",
        route: "#/newsletter",
        access: "Missions and student users",
        summary: "Issues of the Missions Connect Newsletter. Do you have a story to share? Write to missionconnect@cmcvellore.ac.in.",
        keywords: ["newsletter", "story", "stories", "issue"]
    },

    {
        id: "conclave",
        title: "Medical Colleges Conclave",
        route: "#/conclave",
        access: "Missions and student users",
        summary: "The Medical Colleges Conclave 2025 brought together the 12 Christian Minority Medical Colleges to strengthen Education, Service, Research & Outreach: agenda, participants and the way forward.",
        keywords: ["conclave", "medical colleges", "christian colleges"]
    },

    {
        id: "shiloh",
        title: "Shiloh",
        route: "#/shiloh",
        access: "Missions and student users",
        summary: "Shiloh is a movement that seeks to nurture young students spiritually and develop leaders in the healing ministry of Christ. Nearly 1000 students (medical, dental, nursing and paramedical) attend the conference every year. Plenary talks from Shiloh 2025 (Dr. Sedevi Angami, Dr. Prabhu Singh) are available.",
        keywords: ["shiloh", "students", "conference", "plenary"]
    },

    {
        id: "mentors",
        title: "Mission Mentors",
        route: "#/mentors",
        access: "Users with the Missions Mentor role",
        summary: "Mentors see their mentor profile, instructions and their list of mentees, log mentorship meetings and edit their profile.",
        keywords: ["mentor", "mentors", "mentorship", "meeting", "mentees list"]
    },

    {
        id: "mentees",
        title: "Mission Mentees",
        route: "#/mentees",
        access: "Users with the Missions Mentee role",
        summary: "Mentees see their profile, instructions and their mentors (spiritual, career calling and others), log mentorship meetings and edit their profile. One-on-one mentorship supports students in career and spiritual growth.",
        keywords: ["mentee", "mentees", "mentorship", "my mentor"]
    },

    {
        id: "service-commitment",
        title: "Service Commitment",
        route: "#/service-commitment",
        access: "Students",
        summary: "Students see their service commitment details: course and quota, joining and expected completion dates, number of years of service, sponsoring body and the allotted hospital. You can share your journey at the hospitals you served in - it helps others wanting to go in the same direction.",
        keywords: ["service commitment", "sponsor", "sponsoring body", "bond", "quota", "allotted hospital", "student"]
    },

    {
        id: "guide",
        title: "Guide",
        route: "#/guide",
        access: "Everyone",
        summary: "How CMC V Connect works: 01 Choose a module, 02 follow the guide to understand the module workflow, 03 get started and track your requests. If you are unsure where to find a feature, ask this assistant or reach out to the Missions Office.",
        contacts: [MISSIONS_OFFICE],
        keywords: ["guide", "how to", "help", "start", "getting started", "tutorial"]
    },

    {
        id: "dls",
        title: "DLS",
        route: "#/library-access",
        access: "Missions users",
        summary: "DLS information is shared as a PDF document, linked from the Help section (Library Access page).",
        keywords: ["dls"]
    }

];
