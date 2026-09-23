const User = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "upang_access_token";
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select(
      "_id name email course role status"
    );

    if (!user) {
      return res.status(401).json({
        error: "User account not found"
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        error: "User account is disabled"
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired authentication"
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions"
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};