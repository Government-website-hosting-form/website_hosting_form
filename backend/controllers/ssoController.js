
const pool = require('../db');


exports.getUserBasic = async (req, res) => {
  try {
    const { ssoId } = req.query;
    if (!ssoId) return res.status(400).json({ success: false, message: 'ssoId is required' });

    const [rows] = await pool.query(
      'SELECT sso_id, designation, status FROM users WHERE sso_id = ?',
      [ssoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'User inactive' });
    }

    return res.status(200).json({
      success: true,
      data: { ssoId: user.sso_id, userType: user.designation }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const { ssoId } = req.query;
    if (!ssoId) return res.status(400).json({ success: false, message: 'ssoId is required' });

    const [rows] = await pool.query(
      `SELECT u.designation, u.email, COALESCE(o.name, u.department) AS department, u.is_approved
       FROM users u
       LEFT JOIN org o ON o.user_id = u.user_id
       WHERE u.sso_id = ?`,
      [ssoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    if (!user.is_approved) {
      return res.status(202).json({ success: false, message: 'Request pending approval' });
    }

    return res.status(200).json({
      success: true,
      data: {
        department: user.department,
        designation: user.designation,
        mailId: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};