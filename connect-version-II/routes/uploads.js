const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { verifyJWT } = require("../auth-guard");

const router = express.Router();


// =====================================================
// FILE UPLOADS
//
// The git code uploads form attachments from the browser
// with uploadToS3(), which is not defined anywhere in the
// repository (formLoad.js / app.js call it). Version II
// stores attachments on the server instead:
//
//   POST /api/uploads   body: { name, type, data (base64 or data: URL), folder }
//   resp: { success, file: { name, originalName, url, size, type, storage: "url" } }
//
// The returned object has the same shape the git code
// stores for uploaded files, so existing records and new
// ones render the same way. Files are written to
// UPLOAD_DIR (default ./uploads) and served at /uploads.
// =====================================================

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads"));

const MAX_BYTES = 15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "text/csv",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);

const safeSegment = value =>
    String(value || "")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);


router.post("/", verifyJWT, async (req, res) => {

    try {

        const { name, data } = req.body || {};
        let { type } = req.body || {};

        if (typeof data !== "string" || !data) {
            return res.status(400).json({ success: false, message: "No file data" });
        }

        let base64 = data;
        const match = data.match(/^data:([^;,]+)?(?:;[^,]*)?,(.*)$/s);

        if (match) {
            type = type || match[1];
            base64 = match[2];
        }

        type = String(type || "").toLowerCase();

        if (!ALLOWED_TYPES.has(type)) {
            return res.status(415).json({ success: false, message: "This file type is not allowed" });
        }

        const buffer = Buffer.from(base64, "base64");

        if (!buffer.length || buffer.length > MAX_BYTES) {
            return res.status(413).json({ success: false, message: "Files must be smaller than 15 MB" });
        }

        const folder = safeSegment(req.body.folder) || "general";
        const originalName = String(name || "file").slice(0, 200);
        const ext = path.extname(originalName).replace(/[^A-Za-z0-9.]/g, "").slice(0, 10);
        const storedName = `${crypto.randomUUID()}${ext}`;
        const dir = path.join(UPLOAD_DIR, folder, safeSegment(req.user.id) || "user");

        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(path.join(dir, storedName), buffer);

        return res.status(200).json({
            success: true,
            file: {
                storage: "url",
                name: storedName,
                originalName,
                url: `/uploads/${folder}/${encodeURIComponent(safeSegment(req.user.id) || "user")}/${storedName}`,
                size: buffer.length,
                type
            }
        });

    } catch (error) {

        console.error("[UPLOADS][ERROR]", error);

        return res.status(500).json({ success: false, message: "Upload failed" });

    }

});


module.exports = { router, UPLOAD_DIR };
