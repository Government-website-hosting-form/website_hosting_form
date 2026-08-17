const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// converts any empty-string field ("") to null before it hits MySQL,
// so optional DATE columns (mom_date, maint_expiry, ssl_expiry, etc.) don't get rejected as invalid dates
function sanitize(body) {
  const clean = {}
  for (const [key, value] of Object.entries(body)) {
    clean[key] = value === '' ? null : value
  }
  return clean
}

// converts any JS Date object in a row to a plain 'YYYY-MM-DD' string,
// so it round-trips cleanly back into <input type="date"> and back into MySQL
function formatDates(row) {
  if (!row) return row
  const out = {}
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString().slice(0, 10) : value
  }
  return out
}

// bundles all staging_*/production_* keys into two JSON columns,
// and JSON-stringifies ssl_type (frontend sends it as an array)
function packInfraPayload(body) {
  const staging = {}
  const production = {}
  const rest = {}

  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith('staging_')) {
      staging[key] = value
    } else if (key.startsWith('production_')) {
      production[key] = value
    } else if (key === 'ssl_type') {
      rest.ssl_type = JSON.stringify(value)   // array -> JSON string
    } else {
      rest[key] = value
    }
  }

  return {
    ...rest,
    staging_servers: JSON.stringify(staging),
    production_servers: JSON.stringify(production),
  }
}

// reverses packInfraPayload — used when reading a saved row back
function unpackInfraPayload(row) {
  if (!row) return row
  const formatted = formatDates(row)
  const parse = (val) => {
    if (!val) return {}
    return typeof val === 'object' ? val : JSON.parse(val)
  }
  const staging = parse(formatted.staging_servers)
  const production = parse(formatted.production_servers)
  const { staging_servers, production_servers, ssl_type, ...rest } = formatted
  return {
    ...rest,
    ssl_type: ssl_type ? (typeof ssl_type === 'object' ? ssl_type : JSON.parse(ssl_type)) : [],
    ...staging,
    ...production,
  }
}


app.get('/', (req, res) => {
  res.send('server running')
})



// ================= USERS =================
app.get('/users', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users')
  res.json(rows.map(formatDates))
})

app.get('/users/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})

app.post('/users', async (req, res) => {
  try {
    // agar yeh email/sso_id ka user pehle se hai to usi ko use kar lo
    // (users table mein sso_id aur email dono UNIQUE hain)
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

// ================= ORG =================

app.get('/org', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org')
  res.json(rows.map(formatDates))
})
app.get('/org/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org WHERE org_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
app.post('/org', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO org SET ?', [sanitize(req.body)])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.put('/org/:id', async (req, res) => {
  try {
    await db.query('UPDATE org SET ? WHERE org_id = ?', [sanitize(req.body), req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.delete('/org/:id', async (req, res) => {
  await db.query('DELETE FROM org WHERE org_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

// ================= APPS =================
app.get('/apps', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps')
  res.json(rows.map(formatDates))
})
app.get('/apps/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps WHERE app_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
app.post('/apps', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO apps SET ?', [sanitize(req.body)])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.put('/apps/:id', async (req, res) => {
  try {
    await db.query('UPDATE apps SET ? WHERE app_id = ?', [sanitize(req.body), req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.delete('/apps/:id', async (req, res) => {
  await db.query('DELETE FROM apps WHERE app_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

// ================= INFRA =================
app.get('/infra', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM infra')
  res.json(rows.map(unpackInfraPayload))
})

app.get('/infra/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM infra WHERE infra_id = ?', [req.params.id])
  res.json(unpackInfraPayload(rows[0]))
})

app.post('/infra', async (req, res) => {
  try {
    const payload = sanitize(packInfraPayload(req.body))
    const [result] = await db.query('INSERT INTO infra SET ?', [payload])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

app.put('/infra/:id', async (req, res) => {
  try {
    const payload = sanitize(packInfraPayload(req.body))
    await db.query('UPDATE infra SET ? WHERE infra_id = ?', [payload, req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/infra/:id', async (req, res) => {
  await db.query('DELETE FROM infra WHERE infra_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

// ================= CHECKLIST =================
app.get('/checklist', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM checklist')
  res.json(rows.map(formatDates))
})
app.get('/checklist/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
app.post('/checklist', async (req, res) => {
  try {
    const [result] = await db.query('INSERT INTO checklist SET ?', [sanitize(req.body)])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.put('/checklist/:id', async (req, res) => {
  try {
    await db.query('UPDATE checklist SET ? WHERE checklist_id = ?', [sanitize(req.body), req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})
app.delete('/checklist/:id', async (req, res) => {
  await db.query('DELETE FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

app.listen(5000, () => {
  console.log('server running on port 5000')
})