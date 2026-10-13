const db = require("../config/db");
const { DASHBOARD_ROLES } = require("../config/Roles");

// Designation ka ek hi source: live RajSSO identity (req.identity),
// jo getUserDetails bhi use karta hai. DB wali designation sirf fallback hai.
function currentDesignation(req, user) {
  const live = (req.identity?.designation || "").trim();
  const saved = (user?.designation || "").trim();
  return (live || saved).toUpperCase();
}

// OIC dashboard (/api/oic/*, mapping approvals) sirf DASHBOARD_ROLES ke liye.
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
    const designation = currentDesignation(req, user);
    const isActive = (user?.status || "").trim().toLowerCase() === "active";
    const isApproved = !!user?.is_approved;

    if (
      !user ||
      !DASHBOARD_ROLES.includes(designation) ||
      !isActive ||
      !isApproved
    ) {
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

// Dashboard-only users ko form APIs se door rakhta hai.
// OIC_ROLES wale users form use kar sakte hain, isliye wo yahan block nahi hote.
function blockOic(req, res, next) {
  const designation = (req.identity?.designation || "").trim().toUpperCase();

  if (designation && DASHBOARD_ROLES.includes(designation)) {
    return res.status(403).json({
      success: false,
      message: "Dashboard users can only access the dashboard.",
      reason: "OIC_DASHBOARD_ONLY",
    });
  }

  next();
}

module.exports = { requireOicRole, blockOic };