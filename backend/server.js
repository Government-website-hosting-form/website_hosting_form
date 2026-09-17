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

// staging_servers/production_servers JSON columns are gone — that data now
// lives in the infra_servers table instead. packInfraPayload only needs to
// keep handling ssl_type now (still JSON, unrelated to that change).
function packInfraPayload(body) {
  const rest = {}

  for (const [key, value] of Object.entries(body)) {
    if (key === 'ssl_type') {
      rest.ssl_type = JSON.stringify(value)   // array -> JSON string
    } else {
      rest[key] = value
    }
  }

  return rest
}

// no more staging/production JSON to parse out — just formats dates and
// parses ssl_type back into an array.
function unpackInfraPayload(row) {
  if (!row) return row
  const formatted = formatDates(row)
  const result = { ...formatted }
  const sslType = result.ssl_type

  if (sslType) {
    result.ssl_type = typeof sslType === 'object' ? sslType : JSON.parse(sslType)
  } else {
    result.ssl_type = []
  }

  return result
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

// ================= INFRA SERVERS =================
// One row per server in infra_servers, instead of a JSON blob.
app.get('/infra/:id/servers', async (req, res) => {
  const infraId = req.params.id
  const environment = req.query.environment

  try {
    const [rows] = await db.query(
      'SELECT * FROM infra_servers WHERE infra_id = ? AND environment = ?',
      [infraId, environment]
    )

    const grouped = { web: [], app: [], db: [], other: [] }

   for (const row of rows) {
  const server = {
    processor: row.processor || '',
    ram: row.ram || '',
    internal_storage: row.internal_storage || '',
    external_storage: row.external_storage || '',
    external_storage_other: row.external_storage_other || '',
    os: row.os || '',
    os_other: row.os_other || '',
    external_storage_capacity: row.external_storage_capacity || ''

  }
  // only db servers have a Database Version field in the UI —
  // attaching `version` to web/app/other rows makes validateServer()
  // treat them as if that field exists and is empty, and there's
  // no input on screen to ever satisfy it.
  if (row.server_type === 'db') {
    server.version = row.version || ''
  }
  grouped[row.server_type].push(server)
}

    res.json(grouped)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

app.put('/infra/:id/servers', async (req, res) => {
  const infraId = req.params.id
  const environment = req.body.environment
  const web = req.body.web || []
  const appServers = req.body.app || []
  const dbServers = req.body.db || []
  const other = req.body.other || []

  try {
    await db.query(
      'DELETE FROM infra_servers WHERE infra_id = ? AND environment = ?',
      [infraId, environment]
    )

    const allServers = []

    for (const server of web) {
      allServers.push({
        ...server,
        server_type: 'web'
      })
    }

    for (const server of appServers) {
      allServers.push({
        ...server,
        server_type: 'app'
      })
    }

    for (const server of dbServers) {
      allServers.push({
        ...server,
        server_type: 'db'
      })
    }

    for (const server of other) {
      allServers.push({
        ...server,
        server_type: 'other'
      })
    }

    for (const server of allServers) {
      await db.query(
        `INSERT INTO infra_servers
        (infra_id, environment, server_type, processor, ram,
         internal_storage, external_storage,
         external_storage_other, os, version, os_other, external_storage_capacity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          infraId,
          environment,
          server.server_type,
          server.processor || null,
          server.ram || null,
          server.internal_storage || null,
          server.external_storage || null,
          server.external_storage_other || null,
          server.os || null,
          server.version || null,
          server.os_other || null, 
          server.external_storage_capacity || null
        ]
      )
    }

    res.json({ msg: 'saved' })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
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