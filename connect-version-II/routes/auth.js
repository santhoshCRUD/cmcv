const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const jwtUtil = require("../decodetoken");
const { verifyJWT } = require("../auth-guard");


// =====================================================
// USER MODEL
//
// This collection is a Meteor-style "users" collection.
// Its documents use a random STRING _id (e.g.
// "7ZPfbd6appxrRSJhp"), not a Mongo ObjectId, so _id
// must be explicitly typed as String below. Without
// this, Mongoose tries to cast every _id to ObjectId
// and every find() against this collection throws a
// CastError.
// =====================================================

const User = mongoose.model(
    "User",
    new mongoose.Schema(
        {
            _id: {
                type: String
            }
        },
        {
            collection: "users",
            strict: false,
            versionKey: false
        }
    )
);


// =====================================================
// COMMON EMAIL VALIDATION
// =====================================================

function normalizeEmail(email) {

    if (typeof email !== "string") {
        return null;
    }

    const normalized = email.trim().toLowerCase();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
        return null;
    }

    return normalized;
}


// =====================================================
// SHAPE A USER DOC INTO THE PUBLIC RESPONSE OBJECT
// =====================================================

function buildUserResponse(user, fallbackEmail) {

    const profile =
        user.profile || {};

    return {

        id:
            user._id,

        name:
            profile.name || "",

        email:
            profile.email ||
            user.emails?.[0]?.address ||
            fallbackEmail ||
            "",

        employeeId:
            profile.employeeNo || "",

        userType:
            profile.userType || "",

        department:
            profile.department || "",

        departmentId:
            profile.departmentId || "",

        unit:
            profile.unit || "",

        unitId:
            profile.unitId || "",

        designation:
            profile.designation || "",

        designationId:
            profile.designationId || "",

        avatar:
            profile.avatar || ""

    };

}


// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const { email, provider } = req.body;

        const normalizedEmail =
            normalizeEmail(email);


        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (!normalizedEmail) {

            console.log(
                "[AUTH][WARN] Invalid login email"
            );

            return res.status(400).json({

                success: false,

                message: "Invalid request"

            });

        }


        console.log(
            `[AUTH][INFO] Login request for: ${normalizedEmail}`
        );


        // -------------------------------------------------
        // Find user
        //
        // Only retrieve fields required by authentication
        // -------------------------------------------------

        const user = await User.findOne(
            {
                $or: [
                    {
                        "profile.email":
                            normalizedEmail
                    },
                    {
                        "emails.address":
                            normalizedEmail
                    }
                ]
            },
            {
                _id: 1,
                "emails.address": 1,

                "profile.name": 1,
                "profile.email": 1,
                "profile.employeeNo": 1,
                "profile.userType": 1,
                "profile.department": 1,
                "profile.departmentId": 1,
                "profile.unit": 1,
                "profile.unitId": 1,
                "profile.designation": 1,
                "profile.designationId": 1,
                "profile.avatar": 1
            }
        ).lean();


        // -------------------------------------------------
        // User not found
        // -------------------------------------------------

        if (!user) {

            console.log(
                `[AUTH][WARN] User not found: ${normalizedEmail}`
            );

            return res.status(401).json({

                success: false,

                message: "Invalid user"

            });

        }


        const profile =
            user.profile || {};


        const userId =
            user._id;


        const userEmail =
            profile.email ||
            user.emails?.[0]?.address ||
            normalizedEmail;


        const userRole =
            profile.userType;


        // -------------------------------------------------
        // Validate required user information
        // -------------------------------------------------

        if (!userId || !userRole) {

            console.log(
                `[AUTH][ERROR] Incomplete user profile: ${normalizedEmail}`
            );

            return res.status(401).json({

                success: false,

                message: "Invalid user"

            });

        }


        // -------------------------------------------------
        // Generate JWT
        // -------------------------------------------------

        const token =
            jwtUtil.generateToken({

                id: userId,

                email: userEmail,

                role: userRole,

                employeeId:
                    profile.employeeNo

            });


        console.log(
            `[AUTH][INFO] Login successful: ${profile.employeeNo || userId}`
        );


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "User authenticated successfully.",

            provider:
                provider || null,

            token,

            user:
                buildUserResponse(
                    user,
                    normalizedEmail
                )

        });

    } catch (error) {

        console.error(
            "[AUTH][ERROR] Login failed:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Invalid request"

        });

    }

});


// =====================================================
// CHECK USER
// =====================================================

router.post("/checkUser", async (req, res) => {

    try {

        const { email } = req.body;

        const normalizedEmail =
            normalizeEmail(email);


        // -------------------------------------------------
        // Validate email
        // -------------------------------------------------

        if (!normalizedEmail) {

            console.log(
                "[AUTH][WARN] Invalid email in checkUser"
            );

            return res.status(400).json({

                success: false,

                registered: false,

                message: "Invalid request"

            });

        }


        console.log(
            `[AUTH][INFO] Checking user: ${normalizedEmail}`
        );


        // -------------------------------------------------
        // Only retrieve required fields
        // -------------------------------------------------

        const user = await User.findOne(
            {
                $or: [
                    {
                        "profile.email":
                            normalizedEmail
                    },
                    {
                        "emails.address":
                            normalizedEmail
                    }
                ]
            },
            {
                _id: 1,

                "profile.name": 1,
                "profile.email": 1,
                "profile.employeeNo": 1,
                "profile.userType": 1
            }
        ).lean();


        // -------------------------------------------------
        // User not found
        // -------------------------------------------------

        if (!user) {

            console.log(
                `[AUTH][INFO] User not registered: ${normalizedEmail}`
            );

            return res.status(404).json({

                success: false,

                registered: false,

                message: "Not a registered user."

            });

        }


        const profile =
            user.profile || {};


        console.log(
            `[AUTH][INFO] Registered user: ${profile.employeeNo || user._id}`
        );


        // -------------------------------------------------
        // Response
        // -------------------------------------------------

        return res.status(200).json({

            success: true,

            registered: true,

            message: "Registered user.",

            user: {

                id:
                    user._id,

                name:
                    profile.name || "",

                email:
                    profile.email ||
                    normalizedEmail,

                employeeId:
                    profile.employeeNo || "",

                userType:
                    profile.userType || ""

            }

        });

    } catch (error) {

        console.error(
            "[AUTH][ERROR] Check user failed:",
            error
        );

        return res.status(500).json({

            success: false,

            registered: false,

            message: "Invalid request"

        });

    }

});


// =====================================================
// LOGOUT
// =====================================================

router.post(
    "/logout",
    verifyJWT,
    (req, res) => {

        try {

            const cache =
                req.app.locals.cache;


            const ttl =
                jwtUtil.remainingSeconds(
                    req.user
                );


            if (
                cache &&
                req.user.jti &&
                ttl > 0
            ) {

                cache.set(
                    `blacklist:${req.user.jti}`,
                    true,
                    ttl
                );

            }


            console.log(
                `[AUTH][INFO] User logged out: ${req.user.id}`
            );


            return res.status(200).json({

                success: true,

                message:
                    "Logged out successfully."

            });

        } catch (error) {

            console.error(
                "[AUTH][ERROR] Logout failed:",
                error
            );

            return res.status(500).json({

                success: false,

                message: "Invalid request"

            });

        }

    }
);


// =====================================================
// CURRENT USER
// =====================================================

router.get(
    "/me",
    verifyJWT,
    async (req, res) => {

        try {

            // req.user.id / req.user.jti come from the
            // JWT payload created in /login above, where
            // "id" was set to the user's string _id.

            const user = await User.findOne(
                {
                    _id: req.user.id
                },
                {
                    _id: 1,

                    "profile.name": 1,
                    "profile.email": 1,
                    "profile.employeeNo": 1,
                    "profile.userType": 1,
                    "profile.department": 1,
                    "profile.departmentId": 1,
                    "profile.unit": 1,
                    "profile.unitId": 1,
                    "profile.designation": 1,
                    "profile.designationId": 1,
                    "profile.avatar": 1
                }
            ).lean();


            if (!user) {

                console.log(
                    `[AUTH][WARN] Authenticated user no longer exists: ${req.user.id}`
                );

                return res.status(401).json({

                    success: false,

                    message: "Invalid user"

                });

            }


            return res.status(200).json({

                success: true,

                user:
                    buildUserResponse(user)

            });

        } catch (error) {

            console.error(
                "[AUTH][ERROR] Failed to fetch current user:",
                error
            );

            return res.status(500).json({

                success: false,

                message: "Invalid request"

            });

        }

    }
);


// =====================================================
// HEALTH CHECK
// =====================================================

router.get("/health", (req, res) => {

    return res.status(200).json({

        success: true,

        status: "UP",

        message:
            "CMC VConnect Version 2 is running",

        timestamp:
            new Date().toISOString(),

        uptime:
            `${process.uptime().toFixed(2)} seconds`

    });

});

router.get("/token", (req, res) => {

    try {

        const token = jwtUtil.generateToken({

            id: 1,

            username: "developer",

            role: "admin"

        });

        res.status(200).json({

            success: true,

            token

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});

module.exports = router;