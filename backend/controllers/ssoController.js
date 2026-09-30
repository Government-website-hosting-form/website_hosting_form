const db = require("../config/db");
const { OIC_ROLES } = require("../config/Roles");
const { isTestOicBypass } = require("../config/testBypass");
const {
  dropSession,
  redeemLoginCode,
  resolveToken,
} = require("../middleware/session");

const SSO_PORTAL_URL =
  process.env.SSO_PORTAL_URL || "https://ssotest.rajasthan.gov.in/sso";
const SSO_SIGNOUT_URL =
  process.env.SSO_SIGNOUT_URL ||
  "https://ssotest.rajasthan.gov.in/sso/signout";

const exchangeLoginCode = async (req, res) => {
  const token = redeemLoginCode(req.body?.code);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Login code is invalid or expired. Please log in again.",
      reason: "INVALID_CODE",
    });
  }

  const result = await resolveToken(token);

  if (!result.ok) {
    return res.status(401).json({
      success: false,
      message: "Session could not be verified. Please log in again.",
      reason: result.reason,
    });
  }

  return res.json({ success: true, ssoId: result.identity.ssoId, token });
};

const getUserBasic = async (req, res) => {
  const id = req.identity;

  if (!id.profileOk) {
    return res.status(503).json({
      success: false,
      message: "Unable to fetch user profile from SSO right now",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      department: id.department,
      designation: id.designation,
      mailId: id.mailId,
    },
  });
};

const getUserDetails = async (req, res) => {
  try {
    const id = req.identity;

    if (isTestOicBypass(id.ssoId)) {
      return res.json({
        success: true,
        access: "FORM",
        reason: "TEST_BYPASS",
        data: {
          department: id.department,
          designation: "TEST-OIC",
          mailId: null,
        },
      });
    }

    if (!id.profileOk) {
      return res.status(503).json({
        success: false,
        message: "SSO profile is temporarily unavailable. Please try again.",
      });
    }

    const currentDepartment = id.department.toUpperCase();
    const currentDesignation = id.designation.toUpperCase();

    if (id.userType !== "GOVT" || currentDesignation === "CITIZEN") {
      return res.json({
        success: true,
        access: "DENIED",
        reason: "NOT_G2G",
        data: null,
      });
    }

    let users;

    try {
      const [rows] = await db.query(
        `
        SELECT department, designation, email, is_approved, status
        FROM users
        WHERE sso_id = ?
        `,
        [id.ssoId]
      );

      users = rows;
    } catch (dbError) {
      console.error("Database error:", dbError.message);

      return res.status(500).json({
        success: false,
        message: "Database error in getUserDetails",
      });
    }

    const existingUser = users[0];

    if (!existingUser) {
      return res.json({
        success: true,
        access: "MAPPING",
        reason: "FIRST_TIME_USER",
        data: {
          department: id.department || null,
          designation: id.designation || null,
          mailId: id.mailId || null,
        },
      });
    }

    const isActiveUser =
      (existingUser.status || "").trim().toLowerCase() === "active";
    const isApprovedUser = !!existingUser.is_approved;

    if (!isActiveUser) {
      return res.json({
        success: true,
        access: "DENIED",
        reason: "ACCOUNT_INACTIVE",
        data: null,
      });
    }

    if (!isApprovedUser) {
      return res.json({
        success: true,
        access: "DENIED",
        reason: "NOT_APPROVED",
        data: null,
      });
    }

    const hasAllowedRole = OIC_ROLES.includes(currentDesignation);

    if (hasAllowedRole) {
      return res.json({
        success: true,
        access: "FORM",
        reason: "ROLE_MATCHED",
        data: {
          department: existingUser.department,
          designation: existingUser.designation,
          mailId: existingUser.email,
        },
      });
    }

    const savedDepartment = (existingUser.department || "")
      .trim()
      .toUpperCase();

    const savedDesignation = (existingUser.designation || "")
      .trim()
      .toUpperCase();

    const detailsMatch =
      currentDepartment &&
      currentDesignation &&
      currentDepartment === savedDepartment &&
      currentDesignation === savedDesignation;

    if (detailsMatch) {
      return res.json({
        success: true,
        access: "FORM",
        reason: "DEPT_DESIGNATION_MATCHED",
        data: {
          department: existingUser.department,
          designation: existingUser.designation,
          mailId: existingUser.email,
        },
      });
    }

    return res.json({
      success: true,
      access: "MAPPING",
      reason: "USER_MAPPING_REQUIRED",
      data: {
        department: existingUser.department,
        designation: existingUser.designation,
        mailId: existingUser.email,
      },
    });
  } catch (error) {
    console.error("getUserDetails error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const verifySession = async (req, res) => {
  return res.status(200).json({
    success: true,
    authenticated: true,
    ssoId: req.ssoId,
    ssoPortalUrl: SSO_PORTAL_URL,
    signoutUrl: SSO_SIGNOUT_URL,
  });
};

const logout = async (req, res) => {
  try {
    const token = req.headers["sso-token"] || req.body?.token || null;
    dropSession(token);

    return res.status(200).json({
      success: true,
      message: "Logged out",
      signoutUrl: SSO_SIGNOUT_URL,
    });
  } catch (error) {
    console.error("logout error:", error.message);

    return res.status(200).json({
      success: true,
      message: "Logged out (with server warning)",
      signoutUrl: SSO_SIGNOUT_URL,
    });
  }
};

module.exports = {
  exchangeLoginCode,
  getUserBasic,
  getUserDetails,
  verifySession,
  logout,
};