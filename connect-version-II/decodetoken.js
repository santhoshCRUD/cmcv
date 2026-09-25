const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Generates a signed JWT.
 * A unique `jti` is stamped on every token so a single
 * session can be blacklisted on logout without affecting
 * the user's other sessions/devices.
 */
exports.generateToken = (payload) => {

    return jwt.sign(
        {
            ...payload,
            jti: crypto.randomUUID()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );

};

exports.verifyToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );

};

/**
 * Seconds remaining until a decoded token's `exp` claim.
 * Used to set a matching TTL on the logout blacklist entry
 * so we never keep it around longer than the token would
 * have been valid anyway.
 */
exports.remainingSeconds = (decoded) => {

    if (!decoded || !decoded.exp) {
        return 0;
    }

    const now = Math.floor(Date.now() / 1000);

    return Math.max(decoded.exp - now, 0);

};
