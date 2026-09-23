/**
 * Checks that the database in MONGO_URI has the Form.io definitions the
 * modules load from the FormIO collection (by formKey), and points at
 * likely alternatives when they are missing.
 *
 *   npm run check:forms
 */
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const REQUIRED = {
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

(async () => {

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set (see .env.example).");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection.db;
    const names = (await db.listCollections().toArray()).map(c => c.name);

    console.log(`Database: ${db.databaseName}`);

    if (!names.includes("FormIO")) {
        const similar = names.filter(n => /form/i.test(n));
        console.log("\n✗ There is no collection named \"FormIO\" in this database.");
        console.log(similar.length ? `  Collections with "form" in the name: ${similar.join(", ")}` : "  No collection name contains \"form\".");
        console.log("  Import the FormIO collection from the production CMC V Connect database (see README).");
    }

    const present = new Set(names.includes("FormIO")
        ? (await db.collection("FormIO").find({}, { projection: { formKey: 1 } }).toArray()).map(f => f.formKey)
        : []);

    console.log("");

    let missing = 0;

    Object.entries(REQUIRED).forEach(([key, used]) => {
        const ok = present.has(key);
        if (!ok) missing++;
        console.log(`${ok ? "✓" : "✗"} ${key.padEnd(30)} ${used}`);
    });

    console.log(missing ? `\n${missing} form definition(s) missing - those forms will show "This form is not available right now".` : "\nAll form definitions found.");

    await mongoose.disconnect();

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
