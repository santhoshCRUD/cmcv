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

    const { formCollections, findDefinition, listFormKeys } = require("../services/formio");

    console.log(`Database in MONGO_URI: ${mongoose.connection.db.databaseName}`);

    const collections = await formCollections();

    if (!collections.length) {
        console.log("\n✗ No FormIO collection (any capitalisation) was found in any database on this server.");
        console.log("  Import the FormIO collection from the production CMC V Connect database (see README),");
        console.log("  or set FORMIO_DB in .env if the forms are in a database this user can't list.");
    } else {
        console.log(`Form definitions read from: ${collections.map(c => `${c.dbName}.${c.name}`).join(", ")}`);
    }

    console.log("");

    let missing = 0;

    for (const [key, used] of Object.entries(REQUIRED)) {
        const definition = await findDefinition(key);
        if (!definition) missing++;
        console.log(`${definition ? "✓" : "✗"} ${key.padEnd(30)} ${used}${definition ? ` (${definition.components.length} top-level components)` : ""}`);
    }

    if (missing) {
        const all = await listFormKeys();
        console.log(`\n${missing} form definition(s) not found. formKeys that do exist:`);
        console.log("  " + (all.map(k => k.formKey).filter(Boolean).sort().join(", ") || "(none)"));
    } else {
        console.log("\nAll form definitions found.");
    }

    await mongoose.disconnect();

})().catch(error => {
    console.error(error.message);
    process.exit(1);
});
