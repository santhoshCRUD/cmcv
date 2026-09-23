const express = require("express");
const mongoose = require("mongoose");
const { verifyJWT } = require("../auth-guard");

const router = express.Router();


// =====================================================
// MISSIONS
// =====================================================

const Mission = mongoose.model(
    "Mission",
    new mongoose.Schema({}, {
        collection: "missions",
        strict: false
    })
);


// =====================================================
// STUDENTS
// =====================================================

const Student = mongoose.model(
    "Student",
    new mongoose.Schema({}, {
        collection: "students",
        strict: false
    })
);


// =====================================================
// USERS
// =====================================================

const Users = mongoose.model(
    "Users",
    new mongoose.Schema({}, {
        collection: "users",
        strict: false
    })
);

const ConclaveHsptl = mongoose.model(
    "ConclaveHsptl",
    new mongoose.Schema({}, {
        collection: "ConclaveHsptl",
        strict: false
    })
);

const ConnectNewsletter = mongoose.model(
    "ConnectNewsletter",
    new mongoose.Schema({}, {
        collection: "ConnectNewsletter",
        strict: false
    })
);

const GrandRounds = mongoose.model(
    "GrandRounds",
    new mongoose.Schema({}, {
        collection: "GrandRounds",
        strict: false
    })
);

// =====================================================
// EXISTING COLLECTION API
// =====================================================

// const models = {

//     missions: Mission,

//     students: Student

// };


// const roleRules = {

//     students: ["staff", "faculty", "admin"]

// };

// =====================================================
// CONCLAVE HOSPITAL
// =====================================================

router.get("/conclave-hospital", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching ConclaveHsptl");

        const data = await ConclaveHsptl
            .find({})
            .sort({ createdAt: -1 })
            .lean();

        console.log(
            `[V1][INFO] ConclaveHsptl fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch ConclaveHsptl:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// CONNECT NEWSLETTER
// =====================================================

router.get("/connect-newsletter", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching ConnectNewsletter");

        const data = await ConnectNewsletter
            .find({})
            .lean();

        console.log(
            `[V1][INFO] ConnectNewsletter fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch ConnectNewsletter:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// GRAND ROUNDS
// =====================================================

router.get("/grand-rounds", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching GrandRounds");

        const data = await GrandRounds
            .find({})
            .lean();

        console.log(
            `[V1][INFO] GrandRounds fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch GrandRounds:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// LEARNING RESOURCES
// =====================================================

router.get("/learning-resources", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching LearningResources");

        const data = await LearningResources
            .find({})
            .lean();

        console.log(
            `[V1][INFO] LearningResources fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch LearningResources:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MENTEE ROLE
// =====================================================

router.get("/mentee-role", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MenteeRole");

        const data = await MenteeRole
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MenteeRole fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MenteeRole:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MENTOR ROLE
// =====================================================

router.get("/mentor-role", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MentorRole");

        const data = await MentorRole
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MentorRole fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MentorRole:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MISSION HOSPITAL
// =====================================================

router.get("/mission-hospital", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MissionHospital");

        const data = await MissionHospital
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MissionHospital fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MissionHospital:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MISSION REQUESTS
// =====================================================

router.get("/mission-requests", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MissionRequests");

        const data = await MissionRequests
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MissionRequests fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MissionRequests:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MISSION SPECIALIZATIONS
// =====================================================

router.get("/mission-specializations", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MissionSpecializations");

        const data = await MissionSpecializations
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MissionSpecializations fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MissionSpecializations:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MISSIONS STREAM
// =====================================================

router.get("/missions-stream", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MissionsStream");

        const data = await MissionsStream
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MissionsStream fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MissionsStream:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MMS APPLICATION
// =====================================================

router.get("/mms-application", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MmsApplication");

        const data = await MmsApplication
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MmsApplication fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MmsApplication:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MMS DEPARTMENT HOSPITAL
// =====================================================

router.get("/mms-dep-hsptl-all", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MmsDepHsptlAll");

        const data = await MmsDepHsptlAll
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MmsDepHsptlAll fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MmsDepHsptlAll:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MMS OTHER VISIT
// =====================================================

router.get("/mms-other-visit", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MmsOtherVisit");

        const data = await MmsOtherVisit
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MmsOtherVisit fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MmsOtherVisit:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MMS VISIT COMPLETED
// =====================================================

router.get("/mms-visit-complt", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching MmsVisitComplt");

        const data = await MmsVisitComplt
            .find({})
            .lean();

        console.log(
            `[V1][INFO] MmsVisitComplt fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch MmsVisitComplt:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// NET CONSULT PATIENT
// =====================================================

router.get("/net-conslt-patient", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching NetConsltPatient");

        const data = await NetConsltPatient
            .find({})
            .lean();

        console.log(
            `[V1][INFO] NetConsltPatient fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch NetConsltPatient:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// CARDBUILDER
// =====================================================

router.get("/cardbuilder", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching cardbuilder");

        const data = await Cardbuilder
            .find({})
            .lean();

        console.log(
            `[V1][INFO] cardbuilder fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch cardbuilder:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// MISSIONS
// =====================================================

router.get("/missions", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching missions");

        const data = await Mission
            .findOne({})
            .sort({ Date: -1 })
            .lean();

        console.log(
            `[V1][INFO] missions fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch missions:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// NEWSDATA
// =====================================================

router.get("/newsdata", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching newsdata");

        const data = await Newsdata
            .find({})
            .lean();

        console.log(
            `[V1][INFO] newsdata fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch newsdata:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// NEWSLETTER
// =====================================================

router.get("/newsletter", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching newsletter");

        const data = await Newsletter
            .find({})
            .lean();

        console.log(
            `[V1][INFO] newsletter fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch newsletter:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// ROLE FROM ALLOCATION
// =====================================================

router.get("/role-from-allocation", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching rolefromallocation");

        const data = await RoleFromAllocation
            .find({})
            .lean();

        console.log(
            `[V1][INFO] rolefromallocation fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch rolefromallocation:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// ROLES
// =====================================================

router.get("/roles", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching roles");

        const data = await Roles
            .find({})
            .lean();

        console.log(
            `[V1][INFO] roles fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch roles:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// STUDENTS
// =====================================================

router.get("/students", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching students");

        const data = await Student
            .find({})
            .lean();

        console.log(
            `[V1][INFO] students fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch students:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// =====================================================
// THOUGHTS
// =====================================================

router.get("/thoughts", verifyJWT, async (req, res) => {

    try {

        console.log("[V1][INFO] Fetching thoughts");

        const data = await Thoughts
            .find({})
            .lean();

        console.log(
            `[V1][INFO] thoughts fetched: ${data.length}`
        );

        return res.status(200).json({
            success: true,
            count: data.length,
            data
        });

    } catch (error) {

        console.error(
            "[V1][ERROR] Failed to fetch thoughts:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Invalid request"
        });

    }

});


// router.get("/:collection", verifyJWT, async (req, res) => {

//     try {

//         const collection = req.params.collection;

//         console.log(
//             `[V1][INFO] Fetching ${collection}`
//         );


//         const model = models[collection];


//         if (!model) {

//             console.log(
//                 `[V1][WARN] Invalid collection: ${collection}`
//             );

//             return res.status(404).json({
//                 success: false,
//                 message: "Invalid request"
//             });

//         }


//         const allowedRoles = roleRules[collection];


//         if (
//             allowedRoles &&
//             allowedRoles.length &&
//             !allowedRoles.includes(req.user.role)
//         ) {

//             console.log(
//                 `[V1][WARN] Unauthorized role ${req.user.role} for ${collection}`
//             );

//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid request"
//             });

//         }


//         const data = await model.find();


//         console.log(
//             `[V1][INFO] Successfully fetched ${collection}: ${data.length} records`
//         );


//         return res.status(200).json({

//             success: true,

//             collection,

//             count: data.length,

//             data

//         });


//     } catch (error) {

//         console.error(
//             `[V1][ERROR] Failed to fetch ${req.params.collection}`,
//             error
//         );


//         return res.status(500).json({

//             success: false,

//             message: "Invalid request"

//         });

//     }

// });

// =====================================================
// GET USER BY EMPLOYEE ID
// =====================================================

router.get(
    "/employee/:employeeId",
    verifyJWT,
    async (req, res) => {

        try {

            const employeeId =
                req.params.employeeId.trim();

            console.log(
                `[USER][INFO] Fetching employee: ${employeeId}`
            );


            if (!employeeId) {

                console.log(
                    "[USER][ERROR] Employee ID not provided"
                );

                return res.status(400).json({
                    success: false,
                    message: "Invalid request"
                });

            }


            // =================================================
            // Fetch only required fields
            //
            // employeeNo / batch / userType all live under
            // "profile" in this collection, not at the
            // top level.
            // =================================================

            const user = await Users.findOne(
                {
                    "profile.employeeNo": employeeId
                },
                {
                    "_id": 1,
                    "profile.employeeNo": 1,
                    "profile.userType": 1
                }
            ).lean();


            // =================================================
            // User not found
            // =================================================

            if (!user) {

                console.log(
                    `[USER][WARN] User not found: ${employeeId}`
                );

                return res.status(404).json({
                    success: false,
                    message: "Invalid user"
                });

            }


            console.log(
                `[USER][INFO] Employee found: ${employeeId}`
            );


            const profile =
                user.profile || {};


            // =================================================
            // Response
            // =================================================

            return res.status(200).json({

                success: true,

                employeeId: profile.employeeNo,
                userName: profile.name,
                userType: profile.userType,
                email: profile.email
            });


        } catch (error) {

            console.error(
                "[USER][ERROR] Failed to fetch employee:",
                error
            );

            return res.status(500).json({

                success: false,

                message: "Invalid request"

            });

        }

    }
);
module.exports = router;