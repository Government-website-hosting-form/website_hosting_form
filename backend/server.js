const express = require('express')
const cors = require('cors')
const db = require('./db')
const ssoAuthRoutes = require('./routes/ssoAuthRoutes')
const mappingRoutes = require('./routes/mappingRoutes')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))   
app.use('/api/auth/sso', ssoAuthRoutes)            
app.use('/api/sso/mapping', mappingRoutes)         
app.use('/uploads', express.static('uploads'))     


app.use((req, res, next) => {
  if (!req.body) req.body = {}
  next()
})

app.get('/', (req, res) => {
  res.send('server running')
})


app.get('/users', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users')
  res.json(rows)
})

app.get('/users/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id])
  res.json(rows[0])
})

app.post('/users', async (req, res) => {
  try {
    
    const [existing] = await db.query(
      'SELECT * FROM users WHERE sso_id = ? OR email = ? LIMIT 1',
      [req.body.sso_id, req.body.email]
    )

    if (existing.length > 0) {
      res.json({ id: existing[0].user_id, msg: 'existing user used' })
      return
    }

    const [result] = await db.query('INSERT INTO users SET ?', [req.body])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})


app.get('/org', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org')
  res.json(rows)
})
app.get('/org/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org WHERE org_id = ?', [req.params.id])
  res.json(rows[0])
})
app.post('/org', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO org SET ?', [req.body])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.put('/org/:id', async (req, res) => {
  await db.query('UPDATE org SET ? WHERE org_id = ?', [req.body, req.params.id])
  res.json({ msg: 'updated' })
})
app.delete('/org/:id', async (req, res) => {
  await db.query('DELETE FROM org WHERE org_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})


app.get('/apps', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps')
  res.json(rows)
})
app.get('/apps/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps WHERE app_id = ?', [req.params.id])
  res.json(rows[0])
})
app.post('/apps', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO apps SET ?', [req.body])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.put('/apps/:id', async (req, res) => {
  await db.query('UPDATE apps SET ? WHERE app_id = ?', [req.body, req.params.id])
  res.json({ msg: 'updated' })
})
app.delete('/apps/:id', async (req, res) => {
  await db.query('DELETE FROM apps WHERE app_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})


app.get('/infra', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM infra')
  res.json(rows)
})
app.get('/infra/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM infra WHERE infra_id = ?', [req.params.id])
  res.json(rows[0])
})
app.post('/infra', async (req, res) => {
  const [result] = await db.query('INSERT INTO infra SET ?', [req.body])
  res.json({ id: result.insertId, msg: 'saved' })
})
app.put('/infra/:id', async (req, res) => {
  await db.query('UPDATE infra SET ? WHERE infra_id = ?', [req.body, req.params.id])
  res.json({ msg: 'updated' })
})
app.delete('/infra/:id', async (req, res) => {
  await db.query('DELETE FROM infra WHERE infra_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})


app.get('/checklist', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM checklist')
  res.json(rows)
})
app.get('/checklist/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json(rows[0])
})
app.post('/checklist', async (req, res) => {
  const [result] = await db.query('INSERT INTO checklist SET ?', [req.body])
  res.json({ id: result.insertId, msg: 'saved' })
})
app.put('/checklist/:id', async (req, res) => {
  await db.query('UPDATE checklist SET ? WHERE checklist_id = ?', [req.body, req.params.id])
  res.json({ msg: 'updated' })
})
app.delete('/checklist/:id', async (req, res) => {
  await db.query('DELETE FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})






const ssoRoutes = require('./routes/ssoRoutes')
app.use('/api/sso', ssoRoutes)


app.post('/api/web-hosting-form/submit', async (req, res) => {
  try {
    const {
      ssoId,
      name,
      type,
      nature,
      utility,
      purpose,
      subdomain,
      url,
      alternate_url,
      approval_authority,
      approval_designation,
      dev_company,
      dev_contact_person,
      dev_address,
      dev_phone_office,
      dev_phone,
      dev_email
    } = req.body

    if (!ssoId || !name) {
      return res.status(400).json({ success: false, message: 'ssoId and name are required' })
    }

    
    const [userRows] = await db.query('SELECT user_id FROM users WHERE sso_id = ?', [ssoId])
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const userId = userRows[0].user_id

    
    const [orgRows] = await db.query('SELECT org_id FROM org WHERE user_id = ?', [userId])
    if (orgRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No organization mapped for this user. Complete org details first.' })
    }
    const orgId = orgRows[0].org_id

    
    const [result] = await db.query(
      `INSERT INTO apps
        (org_id, user_id, name, type, nature, utility, purpose, subdomain, url, alternate_url,
         approval_authority, approval_designation, dev_company, dev_contact_person, dev_address,
         dev_phone_office, dev_phone, dev_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orgId, userId, name, type, nature, utility, purpose, subdomain, url, alternate_url,
       approval_authority, approval_designation, dev_company, dev_contact_person, dev_address,
       dev_phone_office, dev_phone, dev_email]
    )

    
    res.json({
      success: true,
      message: 'Request submitted successfully, on process',
      requestNo: result.insertId
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message })
  }
})


app.listen(5000, () => {
  console.log('server running on port 5000')
})