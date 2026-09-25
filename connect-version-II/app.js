const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const academicsRoutes = require("./routes/academics");
const connectRoutes = require("./routes/connect");
const connectAppRoutes = require("./routes/connectApp");
const publicRoutes = require("./routes/public");
const { router: uploadRoutes, UPLOAD_DIR } = require("./routes/uploads");
const assistantRoutes = require("./routes/assistant");
const formRoutes = require("./routes/forms");
//const graphRoutes = require("./routes/graphapi");
const v1Routes = require("./routes/v1");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "25mb" }));  // FormIO base64 attachments
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// API Logger
app.use((req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`
        );

    });

    next();

});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/connect", connectRoutes);
app.use("/api/connectApp", connectAppRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/forms", formRoutes);
//app.use("/api/graph", graphRoutes);
app.use("/api/v1", v1Routes);

const path = require("path");

// Uploaded form attachments (see routes/uploads.js).
app.use("/uploads", express.static(UPLOAD_DIR, { fallthrough: false, index: false }));

// Server-side sources are not static assets.
const PRIVATE_PATHS = /^\/(routes|services|knowledge|node_modules|scripts)(\/|$)|^\/(app|db|auth-guard|decodetoken)\.js$|^\/package(-lock)?\.json$/i;
app.use((req, res, next) => PRIVATE_PATHS.test(req.path) ? res.status(404).end() : next());

app.use(express.static(__dirname, { dotfiles: "deny" }));
app.get("/login", (req, res) => {

    res.sendFile(path.join(__dirname, "", "login.html"));

});

app.get("/home", (req, res) => {

    res.sendFile(path.join(__dirname, "", "home.html"));

});
// Root
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "CMC V Connect V2 Running"
    });

});

// 404
app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Invalid request",

        path: req.originalUrl,

        method: req.method,

        timestamp: new Date().toISOString()

    });

});

const NodeCache = require("node-cache");

// Shared app-wide cache. Also used by auth-guard.js to store
// the logout blacklist (per-token jti -> true, TTL'd to match
// each token's remaining lifetime).
const cache = new NodeCache({
    stdTTL: 300,      // 5 minutes
    checkperiod: 60
});

app.locals.cache = cache;

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on Port ${PORT}`);

});