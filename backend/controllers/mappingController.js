

const pool = require('../db')

exports.submitMapping = async (req, res) => {
  try {
    const { ssoId, fullName, mobile, department, designation, email, remarks } = req.body

    if (!ssoId || !fullName || !mobile || !department || !designation || !email) {
      return res.status(400).json({ success: false, message: 'ssoId and all required fields must be provided.' })
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Approval Letter is required.' })
    }

    const [rows] = await pool.query('SELECT user_id FROM users WHERE sso_id = ?', [ssoId])
    if (rows.length === 0) {

      return res.status(404).json({ success: false, message: 'User not found. Please sign in again via SSO.' })
    }

    const userId = rows[0].user_id
    const approvalLetterPath = `uploads/approval-letters/${req.file.filename}`

    await pool.query(
      `UPDATE users
       SET full_name = ?, mobile = ?, department = ?, designation = ?, email = ?,
           remarks = ?, approval_letter_path = ?, mapping_submitted_at = NOW()
       WHERE user_id = ?`,
      [fullName, mobile, department, designation, email, remarks || null, approvalLetterPath, userId]
    )

    return res.json({
      success: true,
      message: 'Request submitted successfully, on process',
      requestNo: userId
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

function checkWebhookAuth(req, res) {
  const key = req.headers['x-api-key']
  if (!process.env.APPROVAL_WEBHOOK_KEY || key !== process.env.APPROVAL_WEBHOOK_KEY) {
    res.status(401).json({ success: false, message: 'Invalid or missing x-api-key' })
    return false
  }
  return true
}

exports.approvalCallback = async (req, res) => {
  try {
    if (!checkWebhookAuth(req, res)) return

    const { ssoId, decision } = req.body

    if (!ssoId || !['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'ssoId and decision ("approved"|"rejected") required' })
    }

    const [rows] = await pool.query('SELECT user_id FROM users WHERE sso_id = ?', [ssoId])
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (decision === 'approved') {
      await pool.query(
        'UPDATE users SET is_approved = 1 WHERE sso_id = ?',
        [ssoId]
      )
    } else {
      await pool.query(
        'UPDATE users SET is_approved = 0, mapping_submitted_at = NULL WHERE sso_id = ?',
        [ssoId]
      )
    }

    return res.json({ success: true, message: `Decision (${decision}) recorded` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}

exports.statusCallback = async (req, res) => {
  try {
    if (!checkWebhookAuth(req, res)) return

    const { ssoId, status } = req.body

    if (!ssoId || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'ssoId and status ("active"|"inactive") required' })
    }

    const [rows] = await pool.query('SELECT user_id FROM users WHERE sso_id = ?', [ssoId])
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    await pool.query('UPDATE users SET status = ? WHERE sso_id = ?', [status, ssoId])

    return res.json({ success: true, message: `Status set to ${status}` })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: err.message })
  }
}
