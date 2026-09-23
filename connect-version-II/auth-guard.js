const jwtUtil = require("./decodetoken");

/**
 * verifyJWT
 * ---------
 * Validates the Bearer token on the Authorization header,
 * rejects tokens that were logged out (blacklisted in cache),
 * and attaches the decoded payload to req.user for downstream
 * routes/middleware to use.
 */
function verifyJWT(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Invalid details"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwtUtil.verifyToken(token);

        const cache = req.app.locals.cache;

        if (cache && decoded.jti && cache.get(`blacklist:${decoded.jti}`)) {

            return res.status(401).json({
                success: false,
                message: "Session has been logged out. Please login again."
            });

        }

        req.user = decoded;
        req.token = token;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Not a valid request"
        });

    }

}

/**
 * authorize(...allowedRoles)
 * ---------------------------
 * Role-based access control. Must run after verifyJWT.
 * Usage:
 *   router.get("/admin-only", verifyJWT, authorize("admin"), handler)
 *   router.get("/staff-area", verifyJWT, authorize("staff", "faculty", "admin"), handler)
 *
 * Call authorize() with no arguments to allow any authenticated
 * role through (equivalent to just using verifyJWT alone, but
 * useful for keeping route definitions consistent/readable).
 */
function authorize(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });

        }

        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource."
            });

        }

        next();

    };

}

module.exports = { verifyJWT, authorize };
