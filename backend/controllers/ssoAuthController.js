

const axios = require('axios')
const pool = require('../db')

const SSO_BASE_URL = process.env.SSO_BASE_URL
const WSUSERNAME = process.env.WSUSERNAME
const WSPASSWORD = process.env.WSPASSWORD
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

const DOITC_OIC_ROLES = (process.env.DOITC_OIC_ROLES || '')
  .split(',')
  .map((r) => r.trim().toUpperCase())
  .filter(Boolean)

function isDoitcOrOic(designation, department) {
  if (DOITC_OIC_ROLES.length === 0) return false
  const candidates = []
  if (designation) candidates.push(String(designation).toUpperCase())
  if (department) candidates.push(String(department).toUpperCase())
  return candidates.some((c) => DOITC_OIC_ROLES.includes(c))
}

async function getStoredToken(ssoId) {
  const [rows] = await pool.query('SELECT sso_token FROM users WHERE sso_id = ? LIMIT 1', [ssoId])
  return rows.length > 0 ? rows[0].sso_token : null
}

async function setStoredToken(ssoId, token) {
  await pool.query('UPDATE users SET sso_token = ? WHERE sso_id = ?', [token, ssoId])
}

async function clearStoredToken(ssoId) {
  await pool.query('UPDATE users SET sso_token = NULL WHERE sso_id = ?', [ssoId])
}

function basicAuthHeader() {
  const raw = `${WSUSERNAME}:${WSPASSWORD}`
  return 'Basic ' + Buffer.from(raw, 'utf-8').toString('base64')
}

async function hasPendingRequest(userId) {
  const [rows] = await pool.query('SELECT mapping_submitted_at FROM users WHERE user_id = ? LIMIT 1', [userId])
  return rows.length > 0 && rows[0].mapping_submitted_at !== null
}

exports.ssoLanding = async (req, res) => {
  try {
    const token = req.body.userdetails
    if (!token) {
      return res.redirect(`${FRONTEND_URL}/sso/failed?reason=no_token`)
    }


    const tokenDetailRes = await axios.get(`${SSO_BASE_URL}/SSORESTNEW/TokenDetail`, {
      headers: {
        'SSO-TOKEN': token,
        Authorization: basicAuthHeader()
      }
    })

    const { sAMAccountName: ssoId, UserType } = tokenDetailRes.data

    if (!ssoId) {
      return res.redirect(`${FRONTEND_URL}/sso/failed?reason=invalid_token`)
    }

    const profileRes = await axios.get(`${SSO_BASE_URL}/SSORESTNEW/Profile/${ssoId}`, {
      headers: {
        'SSO-TOKEN': token,
        Authorization: basicAuthHeader()
      }
    })
    const profile = profileRes.data

    const isAuthorityRole = isDoitcOrOic(profile.designation, profile.department)

    let [rows] = await pool.query('SELECT * FROM users WHERE sso_id = ?', [ssoId])

    if (isAuthorityRole) {

      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO users (sso_id, sso_token, designation, email, status, is_approved)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [ssoId, token, profile.designation || UserType, profile.mailOfficial || null, 'active', true]
        )
      } else {
        await setStoredToken(ssoId, token)
      }
      return res.redirect(`${FRONTEND_URL}/sso/success?ssoId=${encodeURIComponent(ssoId)}`)
    }

    if (rows.length === 0) {

      await pool.query(
        `INSERT INTO users (sso_id, sso_token, designation, email, status, is_approved)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ssoId, token, profile.designation || UserType, profile.mailOfficial || null, 'active', false]
      )
      return res.redirect(`${FRONTEND_URL}/sso/mapping?ssoId=${encodeURIComponent(ssoId)}`)
    }

    await setStoredToken(ssoId, token)

    const user = rows[0]

    if (user.status !== 'active') {
      return res.redirect(`${FRONTEND_URL}/sso/not-active?ssoId=${encodeURIComponent(ssoId)}`)
    }

    if (user.is_approved) {

      return res.redirect(`${FRONTEND_URL}/sso/success?ssoId=${encodeURIComponent(ssoId)}`)
    }


    const pending = await hasPendingRequest(user.user_id)

    if (pending) {

      return res.redirect(`${FRONTEND_URL}/sso/pending?ssoId=${encodeURIComponent(ssoId)}`)
    }

    return res.redirect(`${FRONTEND_URL}/sso/mapping?ssoId=${encodeURIComponent(ssoId)}`)
  } catch (err) {
    console.log(err?.response?.data || err.message)
    return res.redirect(`${FRONTEND_URL}/sso/failed?reason=server_error`)
  }
}

exports.increaseSession = async (req, res) => {
  try {
    const { ssoId } = req.query
    const token = await getStoredToken(ssoId)
    if (!token) return res.status(400).json({ success: false, message: 'No active SSO session' })

    const result = await axios.get(`${SSO_BASE_URL}/SSORESTNEW/IncreaseSessionTime`, {
      headers: { 'SSO-TOKEN': token, Authorization: basicAuthHeader() }
    })

    res.json({ success: true, extended: result.data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.backToSso = async (req, res) => {
  const { ssoId } = req.query
  const token = await getStoredToken(ssoId)
  if (!token) return res.redirect(FRONTEND_URL)


  res.send(`
    <html><body onload="document.forms[0].submit()">
      <form method="post" action="${process.env.SSO_BACKTOSSO_URL}">
        <input type="hidden" name="userdetails" value="${token}" />
      </form>
    </body></html>
  `)
}

exports.signOut = async (req, res) => {
  const { ssoId } = req.query
  const token = await getStoredToken(ssoId)
  await clearStoredToken(ssoId)
  if (!token) return res.redirect(FRONTEND_URL)

  res.send(`
    <html><body onload="document.forms[0].submit()">
      <form method="post" action="${process.env.SSO_SIGNOUT_URL}">
        <input type="hidden" name="userdetails" value="${token}" />
      </form>
    </body></html>
  `)
}