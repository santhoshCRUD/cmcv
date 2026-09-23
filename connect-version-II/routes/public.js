const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");

const router = express.Router();


// =====================================================
// PUBLIC (pre-login) ROUTES
//
// The git code's "Sign Up" button (views/header.html)
// opens the FormIO form "cmcvconnectLoginApplication" and
// inserts the submission into LoginRequest
// (formLoad.js requestLoginForm). Before login there is no
// JWT, so these two calls get their own narrow routes
// instead of the generic connectApp API.
// =====================================================

const REGISTRATION_FORM_KEY = "cmcvconnectLoginApplication";


// Simple in-memory rate limit: 5 submissions per IP per hour.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const submissions = new Map();

function rateLimited(ip) {

    const now = Date.now();
    const recent = (submissions.get(ip) || []).filter(t => now - t < WINDOW_MS);

    if (recent.length >= MAX_SUBMISSIONS) {
        submissions.set(ip, recent);
        return true;
    }

    recent.push(now);
    submissions.set(ip, recent);

    return false;

}


// Keep only plain JSON values, drop operator-looking keys.
function clean(value, depth = 0) {

    if (depth > 8) {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value.slice(0, 200).map(v => clean(v, depth + 1));
    }

    if (value && typeof value === "object") {

        const out = {};

        Object.keys(value).forEach(key => {
            if (!key.startsWith("$") && !key.includes(".")) {
                out[key] = clean(value[key], depth + 1);
            }
        });

        return out;

    }

    if (typeof value === "string") {
        return value.slice(0, 5000);
    }

    return value;

}


// -----------------------------------------------------
// GET /api/public/registration-form
// -----------------------------------------------------

router.get("/registration-form", async (req, res) => {

    try {

        const form = await mongoose.connection.db
            .collection("FormIO")
            .findOne({ formKey: REGISTRATION_FORM_KEY });

        if (!form) {

            return res.status(404).json({
                success: false,
                message: "The registration form is not available right now."
            });

        }

        return res.status(200).json({ success: true, data: form });

    } catch (error) {

        console.error("[PUBLIC][ERROR] registration-form:", error);

        return res.status(500).json({ success: false, message: "Invalid request" });

    }

});


// -----------------------------------------------------
// POST /api/public/registration
// body: { data: <FormIO submission data> }
// -----------------------------------------------------

router.post("/registration", async (req, res) => {

    try {

        if (rateLimited(req.ip)) {

            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });

        }

        const data = clean(req.body && req.body.data);

        if (!data || typeof data !== "object" || !Object.keys(data).length) {

            return res.status(400).json({ success: false, message: "Invalid request" });

        }

        // Same fields requestLoginForm() sets in the git code.
        const record = {
            ...data,
            _id: crypto.randomBytes(12).toString("hex"),
            isDeleted: false,
            Date: new Date(),
            status: "inProgress"
        };

        delete record.forMissionsOffice;

        await mongoose.connection.db.collection("LoginRequest").insertOne(record);

        console.log("[PUBLIC][INFO] New registration request");

        return res.status(200).json({ success: true });

    } catch (error) {

        console.error("[PUBLIC][ERROR] registration:", error);

        return res.status(500).json({ success: false, message: "Invalid request" });

    }

});


module.exports = router;
