const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

const APPROVAL_LETTER_DIR = path.join(__dirname, "..", "uploads", "approval-letters");

async function findLatestRequestBySsoId(ssoId) {
  const [rows] = await pool.query(
    `SELECT request_id, status
     FROM requests
     WHERE sso_id = ?
     ORDER BY submitted_at DESC
     LIMIT 1`,
    [ssoId]
  );

  return rows[0] || null;
}

function loginRequired(res) {
  return res.status(401).json({ success: false, message: "Login required" });
}

exports.submitMapping = async (req, res) => {
  try {
    const ssoId = req.ssoId;
    const {
      fullName,
      mobile,
      department,
      designation,
      email,
      remarks,
    } = req.body;

    if (!ssoId) return loginRequired(res);

    if (!fullName || !mobile || !department || !designation || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Approval letter is required",
      });
    }

    const approvalLetterPath = req.file.filename;
    const existingRequest = await findLatestRequestBySsoId(ssoId);

    let requestNo;

    if (
      existingRequest &&
      (existingRequest.status === "pending" ||
        existingRequest.status === "objection")
    ) {
      await pool.query(
        `UPDATE requests
         SET full_name = ?,
             mobile = ?,
             department = ?,
             designation = ?,
             email = ?,
             remarks = ?,
             approval_letter_path = ?,
             submitted_at = NOW(),
             status = 'pending',
             is_approved = 0,
             objection_remarks = NULL,
             reviewed_at = NULL
         WHERE request_id = ?`,
        [
          fullName,
          mobile,
          department,
          designation,
          email,
          remarks || null,
          approvalLetterPath,
          existingRequest.request_id,
        ]
      );

      requestNo = existingRequest.request_id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO requests (
          sso_id,
          full_name,
          mobile,
          department,
          designation,
          email,
          remarks,
          approval_letter_path,
          submitted_at,
          status,
          is_approved
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pending', 0)`,
        [
          ssoId,
          fullName,
          mobile,
          department,
          designation,
          email,
          remarks || null,
          approvalLetterPath,
        ]
      );

      requestNo = result.insertId;
    }

    return res.json({
      success: true,
      message: "Mapping submitted successfully",
      requestNo,
    });
  } catch (error) {
    console.error("submitMapping error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const status = (req.query.status || "pending").trim().toLowerCase();

    const params = [];
    let where = "";

    if (status !== "all") {
      where = "WHERE status = ?";
      params.push(status);
    }

    const [rows] = await pool.query(
      `SELECT request_id, sso_id, full_name, mobile, department, designation,
              email, remarks, approval_letter_path, status, is_approved,
              submitted_at, reviewed_at
       FROM requests
       ${where}
       ORDER BY submitted_at DESC`,
      params
    );

    return res.json({ success: true, requests: rows });
  } catch (error) {
    console.error("listRequests error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM requests WHERE request_id = ?`,
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const request = rows[0];

    const [existingUsers] = await pool.query(
      `SELECT user_id FROM users WHERE sso_id = ?`,
      [request.sso_id]
    );

    if (existingUsers.length) {
      await pool.query(
        `UPDATE users
         SET full_name = ?,
             mobile = ?,
             department = ?,
             designation = ?,
             email = ?,
             is_approved = 1,
             status = 'active'
         WHERE sso_id = ?`,
        [
          request.full_name,
          request.mobile,
          request.department,
          request.designation,
          request.email,
          request.sso_id,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO users (
          sso_id, full_name, mobile, department, designation, email, is_approved, status
        ) VALUES (?, ?, ?, ?, ?, ?, 1, 'active')`,
        [
          request.sso_id,
          request.full_name,
          request.mobile,
          request.department,
          request.designation,
          request.email,
        ]
      );
    }

    await pool.query(
      `UPDATE requests
       SET status = 'approved', is_approved = 1, reviewed_at = NOW()
       WHERE request_id = ?`,
      [requestId]
    );

    return res.json({ success: true, message: "Request approved and user mapped" });
  } catch (error) {
    console.error("approveRequest error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const [rows] = await pool.query(
      `SELECT request_id FROM requests WHERE request_id = ?`,
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await pool.query(
      `UPDATE requests
       SET status = 'rejected', is_approved = 0, reviewed_at = NOW()
       WHERE request_id = ?`,
      [requestId]
    );

    return res.json({ success: true, message: "Request rejected" });
  } catch (error) {
    console.error("rejectRequest error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.raiseObjection = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { remarks } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: "Objection remarks are required",
      });
    }

    const [rows] = await pool.query(
      `SELECT request_id FROM requests WHERE request_id = ?`,
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await pool.query(
      `UPDATE requests
       SET status = 'objection',
           is_approved = 0,
           objection_remarks = ?,
           reviewed_at = NOW()
       WHERE request_id = ?`,
      [remarks.trim(), requestId]
    );

    return res.json({ success: true, message: "Objection raised" });
  } catch (error) {
    console.error("raiseObjection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.initRequest = async (req, res) => {
  try {
    const ssoId = req.ssoId;
    const { department, designation, email } = req.body;

    if (!ssoId) return loginRequired(res);

    const existingRequest = await findLatestRequestBySsoId(ssoId);
    let requestId;

    if (
      existingRequest &&
      (existingRequest.status === "pending" ||
        existingRequest.status === "objection")
    ) {
      await pool.query(
        `UPDATE requests SET department = ?, designation = ?, email = ? WHERE request_id = ?`,
        [department || null, designation || null, email || null, existingRequest.request_id]
      );
      requestId = existingRequest.request_id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO requests (sso_id, department, designation, email, submitted_at, status, is_approved)
         VALUES (?, ?, ?, ?, NOW(), 'pending', 0)`,
        [ssoId, department || null, designation || null, email || null]
      );
      requestId = result.insertId;
    }

    return res.json({ success: true, requestId });
  } catch (error) {
    console.error("initRequest error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMyRequest = async (req, res) => {
  try {
    const ssoId = req.ssoId;

    if (!ssoId) return loginRequired(res);

    const [rows] = await pool.query(
      `SELECT request_id, full_name, mobile, department, designation,
              email, remarks, status, objection_remarks
       FROM requests
       WHERE sso_id = ?
       ORDER BY submitted_at DESC
       LIMIT 1`,
      [ssoId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.json({ success: true, request: rows[0] });
  } catch (error) {
    console.error("getMyRequest error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const ssoId = req.ssoId;

    if (!ssoId) return loginRequired(res);

    const [rows] = await pool.query(
      `SELECT user_id, full_name, department, designation, email, is_approved, status
       FROM users WHERE sso_id = ?`,
      [ssoId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("getMe error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const ssoId = req.ssoId;

    if (!ssoId) return loginRequired(res);

    const [rows] = await pool.query(
      `SELECT status, is_approved, objection_remarks
       FROM requests
       WHERE sso_id = ?
       ORDER BY submitted_at DESC
       LIMIT 1`,
      [ssoId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const { status, is_approved, objection_remarks } = rows[0];

    if (status === "inactive") {
      return res.json({
        success: true,
        state: "inactive",
      });
    }

    if (status === "rejected") {
      return res.json({
        success: true,
        state: "rejected",
      });
    }

    if (status === "objection") {
      return res.json({
        success: true,
        state: "objection",
        remarks: objection_remarks || "",
      });
    }

    if (is_approved) {
      return res.json({
        success: true,
        state: "approved",
      });
    }

    return res.json({
      success: true,
      state: "pending",
    });
  } catch (error) {
    console.error("checkStatus error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.downloadApprovalLetter = async (req, res) => {
  try {
    const { requestId } = req.params;

    const [rows] = await pool.query(
      `SELECT approval_letter_path FROM requests WHERE request_id = ?`,
      [requestId]
    );

    if (!rows.length || !rows[0].approval_letter_path) {
      return res.status(404).json({
        success: false,
        message: "Approval letter not found for this request",
      });
    }

    const storedName = rows[0].approval_letter_path;
    const filePath = path.join(APPROVAL_LETTER_DIR, storedName);

    if (!filePath.startsWith(APPROVAL_LETTER_DIR)) {
      return res.status(400).json({ success: false, message: "Invalid file path" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Approval letter file is missing on the server",
      });
    }

    return res.download(filePath, storedName);
  } catch (error) {
    console.error("downloadApprovalLetter error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};