
const express = require('express')
const app = express()
const PORT = process.env.MOCK_SSO_PORT || 4000

function decodeToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

app.get('/SSORESTNEW/TokenDetail', (req, res) => {
  const token = req.header('SSO-TOKEN')
  const data = decodeToken(token)
  if (!data || !data.ssoId) {
    return res.status(400).json({ error: 'bad/missing SSO-TOKEN for mock' })
  }
  res.json({
    sAMAccountName: data.ssoId,
    Roles: data.roles || [],
    UserType: data.userType || 'CITIZEN'
  })
})

app.get('/SSORESTNEW/Profile/:ssoId', (req, res) => {
  const token = req.header('SSO-TOKEN')
  const data = decodeToken(token)
  if (!data) return res.status(400).json({ error: 'bad/missing SSO-TOKEN for mock' })
  res.json({
    designation: data.designation || data.userType || 'CITIZEN',
    department: data.department || '',
    mailOfficial: data.email || `${req.params.ssoId}@example.gov.in`
  })
})

app.get('/SSORESTNEW/IncreaseSessionTime', (req, res) => {
  res.json({ status: 'extended (mock)' })
})

app.listen(PORT, () => {
  console.log(`Mock RajSSO server running on http://localhost:${PORT}`)
  console.log('Point SSO_BASE_URL at this in backend/.env while testing.')
})
