const db = require("../config/db");

async function requireApprovedUser(req, res, next) {
  try {
    if (!req.ssoId) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const [rows] = await db.query(
      "SELECT user_id, status, is_approved FROM users WHERE sso_id = ?",
      [req.ssoId]
    );

    const user = rows[0];
    const isActive = (user?.status || "").trim().toLowerCase() === "active";

    if (!user || !isActive || !user.is_approved) {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved/active for this action",
      });
    }

    req.userId = user.user_id;
    next();
  } catch (error) {
    console.error("requireApprovedUser error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

const OWNERSHIP_SQL = {
  org: "SELECT 1 FROM org WHERE org_id = ? AND user_id = ? LIMIT 1",
  apps: "SELECT 1 FROM apps WHERE app_id = ? AND user_id = ? LIMIT 1",
  infra: `SELECT 1 FROM infra i
          JOIN apps a ON a.app_id = i.app_id
          WHERE i.infra_id = ? AND a.user_id = ? LIMIT 1`,
  checklist: `SELECT 1 FROM checklist c
              JOIN apps a ON a.app_id = c.app_id
              WHERE c.checklist_id = ? AND a.user_id = ? LIMIT 1`,
};

async function ownsRow(resource, id, userId) {
  const sql = OWNERSHIP_SQL[resource];
  if (!sql) throw new Error("Unknown resource: " + resource);
  const [rows] = await db.query(sql, [id, userId]);
  return rows.length > 0;
}

function requireOwner(resource) {
  return async function (req, res, next) {
    try {
      if (!(await ownsRow(resource, req.params.id, req.userId))) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      next();
    } catch (error) {
      console.error("requireOwner error:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}

const LOCK_SQL = {
  org: "SELECT 1 FROM apps WHERE org_id = ? AND status = 'submitted' LIMIT 1",
  apps: "SELECT 1 FROM apps WHERE app_id = ? AND status = 'submitted' LIMIT 1",
  infra: `SELECT 1 FROM infra i
          JOIN apps a ON a.app_id = i.app_id
          WHERE i.infra_id = ? AND a.status = 'submitted' LIMIT 1`,
  checklist: `SELECT 1 FROM checklist c
              JOIN apps a ON a.app_id = c.app_id
              WHERE c.checklist_id = ? AND a.status = 'submitted' LIMIT 1`,
};

function requireEditable(resource) {
  return async function (req, res, next) {
    try {
      const [rows] = await db.query(LOCK_SQL[resource], [req.params.id]);
      if (rows.length) {
        return res.status(409).json({
          success: false,
          message: "This request is already submitted and can no longer be changed",
        });
      }
      next();
    } catch (error) {
      console.error("requireEditable error:", error.message);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}

async function isAppLocked(appId) {
  const [rows] = await db.query(LOCK_SQL.apps, [appId]);
  return rows.length > 0;
}

module.exports = {
  requireApprovedUser,
  requireOwner,
  requireEditable,
  isAppLocked,
  ownsRow,
};