const db = require("../config/db");
const { OIC_ROLES } = require("../config/Roles");

async function requireOicRole(req, res, next) {
  try {
    const ssoId = req.ssoId;

    if (!ssoId) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const [rows] = await db.query(
      `SELECT designation, is_approved, status FROM users WHERE sso_id = ?`,
      [ssoId]
    );

    const user = rows[0];
    const designation = (user?.designation || "").trim().toUpperCase();
    const isActive = (user?.status || "").trim().toLowerCase() === "active";
    const isApproved = !!user?.is_approved;

    if (!user || !OIC_ROLES.includes(designation) || !isActive || !isApproved) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("requireOicRole error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { requireOicRole };