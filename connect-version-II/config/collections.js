/**
 * Catalog of every MongoDB collection and Form.io formKey the original
 * CMC V Connect (git: santhoshCRUD/cmcv - app.js, formLoad.js,
 * dynamicRender.js, modal.js, utils.js) reads or writes, plus the few
 * version II adds.
 *
 * One place for:
 *   - routes/connectApp.js   which collections the API serves / accepts writes to
 *   - scripts/sync-data.js   what `npm run sync:data` copies from the live server
 *   - scripts/check-*.js     what the check commands report
 *   - a future admin project (same names, labels and ownership)
 *
 * kind:
 *   content     maintained by the Missions office (hospitals, news, grants ...)
 *   submission  written by users through the modules (applications, requests ...)
 *   private     personal records, only ever read owner-scoped; never synced
 *   forms       Form.io definitions (see formKeys below)
 *
 * write: true  the modules insert into / update this collection
 * endpoint     live API endpoint the git code reads it with
 *              (default fetchCollectionData)
 */

const COLLECTIONS = {
    // ---- Missions: hospitals and requests
    MissionHospital:            { module: "Mission Hospitals", kind: "content" },
    MissionDepartments:         { module: "Mission Hospitals", kind: "content" },
    MissionSpecializations:     { module: "Mission Hospitals / Manpower", kind: "content" },
    MissionRequests:            { module: "Manpower Requests", kind: "submission", write: true },
    HospitalAdmins:             { module: "My hospital / Home", kind: "content" },
    ConclaveHsptl:              { module: "Medical Colleges Conclave", kind: "content" },
    Faculties:                  { module: "Medical Colleges Conclave", kind: "content" },
    Asset:                      { module: "Equipment", kind: "content", write: true },
    AssetRequest:               { module: "Equipment", kind: "submission", write: true },

    // ---- Mission engagement
    MmsApplication:             { module: "Mandatory Mission Service", kind: "submission", write: true },
    MmsDepHsptlAll:             { module: "Mandatory Mission Service", kind: "content" },
    MmsOtherVisit:              { module: "Mandatory Mission Service", kind: "submission", write: true },
    MmsVisitComplt:             { module: "Mandatory Mission Service", kind: "content" },
    MsnVisitApp:                { module: "Mission Visits", kind: "submission", write: true },
    ManPowerInterest:           { module: "Mission Visits", kind: "submission", write: true },
    missionHospital:            { module: "Service Commitment feedback", kind: "submission", write: true },
    students:                   { module: "Service Commitment", kind: "private" },

    // ---- Mentorship
    MentorRole:                 { module: "Mission Mentors", kind: "submission", write: true },
    MenteeRole:                 { module: "Mission Mentees", kind: "submission", write: true },
    MissionsMentorshipMeetings: { module: "Mission Mentors / Mentees", kind: "submission", write: true },
    MissionsInstructions:       { module: "Mission Mentors / Mentees", kind: "content" },

    // ---- Network Consults
    NetConsltRegApp:            { module: "Network Consults", kind: "submission", write: true },
    NetConsltPatient:           { module: "Network Consults", kind: "submission", write: true },
    NetConsltPatientQuery:      { module: "Network Consults", kind: "submission", write: true, endpoint: "fetchCollectionDataFromDB" },
    NCAllotDocLog:              { module: "Network Consults", kind: "submission", write: true, endpoint: "fetchCollectionDataFromDB" },
    NCPatientAllotLog:          { module: "Network Consults (allotment history)", kind: "submission" },
    NetConsltTheme:             { module: "Network Consults", kind: "content" },

    // ---- Grants
    FovApplication:             { module: "FOV Grant", kind: "submission", write: true },
    samProjectApplicationForm:  { module: "SAM Project", kind: "submission", write: true },
    samTrainingReportForm:      { module: "SAM Project", kind: "submission", write: true },
    GrantsList:                 { module: "Research", kind: "content" },
    GrantsAwardee:              { module: "Research", kind: "content" },

    // ---- Learning and research
    GrandRounds:                { module: "Grand Rounds / Home", kind: "content" },
    LearningResources:          { module: "Learning Resources", kind: "content" },
    ClinicalSnip:               { module: "Clinical Snippets", kind: "content" },
    MissionsStream:             { module: "Learning Resources", kind: "content" },
    CardBuilder:                { module: "Home / Council", kind: "content" },
    InformationCardBuilder:     { module: "Home", kind: "content" },
    CouncilMembers:             { module: "Council", kind: "content" },
    HeadOfOrganization:         { module: "Council", kind: "content" },
    ResearchNews:               { module: "Research", kind: "content" },
    ResearchPublications:       { module: "Research", kind: "content" },
    ResearchLegacies:           { module: "Research", kind: "content" },
    MsnPublications:            { module: "Research", kind: "content" },
    BioEthics:                  { module: "Bio Ethics (not linked in the git UI)", kind: "content" },

    // ---- News and updates
    NewsData:                   { module: "News / Home", kind: "content" },
    ConnectNewsletter:          { module: "Newsletter", kind: "content" },
    WeeklyManna:                { module: "Weekly Manna / Home", kind: "content" },
    Thought:                    { module: "Home (thought for the day)", kind: "content" },
    WhatsNew:                   { module: "Home (carousel)", kind: "content" },

    // ---- Help
    LegalHelp:                  { module: "Legal Help", kind: "submission", write: true },
    FinancialHelp:              { module: "Finance", kind: "submission", write: true },
    LibraryAccess:              { module: "Library Access", kind: "submission", write: true },
    ResearchRequest:            { module: "Research Request form", kind: "submission", write: true },
    ConnectFeedback:            { module: "Feedback", kind: "submission", write: true },
    LoginRequest:               { module: "Register now (login page)", kind: "submission" },

    // ---- Form.io definitions
    FormIO:                     { module: "All forms", kind: "forms" }
};


// Every formKey the git code loads from FormIO, and where it is used.
const FORM_KEYS = {
    cmcvconnectLoginApplication: "Register now (login page)",
    legalAssistance: "Legal Help",
    finance: "Finance",
    libraryAccess: "Library Access",
    formAllocation: "Feedback",
    researchRequest: "Research Request form",
    externalMissionRequest: "Hospital workspace - mission requests",
    mentorshipMeeting: "Mentors - meetings",
    mentorDetails: "Mentors - profile",
    menteeDetails: "Mentees - profile",
    missionVisitApplication: "Mandatory Mission Service",
    mmsOtherVisits: "MMS - other visits",
    missionVisits: "Mission Visits - upload your visit",
    registryOfNetworkConsultants: "Network Consults - registration",
    clinicalCaseDiscussion: "Network Consults - patient case",
    fovProjectPo: "FOV Grant application",
    samProjectApplicationForm: "SAM Project application",
    samTrainingReportForm: "SAM training report (bundled fallback exists)"
};


const names = filter => Object.keys(COLLECTIONS).filter(name => filter(COLLECTIONS[name]));

module.exports = {
    COLLECTIONS,
    FORM_KEYS,
    READ_COLLECTIONS: new Set(Object.keys(COLLECTIONS)),
    WRITE_COLLECTIONS: new Set(names(c => c.write)),
    // What sync:data copies: everything but personal records and FormIO (sync:forms does that).
    SYNC_COLLECTIONS: names(c => c.kind === "content" || c.kind === "submission")
};
