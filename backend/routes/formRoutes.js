const express = require('express')
const router = express.Router()
const db = require('../config/db')
const { requireOwner, requireEditable, isAppLocked, ownsRow } = require('../middleware/access')

function formatDates(row) {
  if (!row) return row
  const out = {}
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString().slice(0, 10) : value
  }
  return out
}

function packInfraPayload(body) {
  const rest = {}
  for (const [key, value] of Object.entries(body)) {
    rest[key] = key === 'ssl_type' ? JSON.stringify(value) : value
  }
  return rest
}

function unpackInfraPayload(row) {
  if (!row) return row
  const result = { ...formatDates(row) }
  const sslType = result.ssl_type
  if (sslType) {
    result.ssl_type = typeof sslType === 'object' ? sslType : JSON.parse(sslType)
  } else {
    result.ssl_type = []
  }
  return result
}

const columnCache = {}
async function getColumns(table) {
  if (!columnCache[table]) {
    const [cols] = await db.query('SHOW COLUMNS FROM ??', [table])
    columnCache[table] = new Set(cols.map((c) => c.Field))
  }
  return columnCache[table]
}

async function cleanBody(table, body, { pk, drop = [] }) {
  const cols = await getColumns(table)
  const blocked = new Set([pk, ...drop])
  const out = {}
  for (const [key, value] of Object.entries(body || {})) {
    if (!cols.has(key) || blocked.has(key)) continue
    out[key] = value === '' ? null : value
  }
  return out
}

const forbidden = (res, msg) => res.status(403).json({ error: msg })

router.get('/org', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org WHERE user_id = ?', [req.userId])
  res.json(rows.map(formatDates))
})
router.get('/org/:id', requireOwner('org'), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM org WHERE org_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
router.post('/org', async (req, res) => {
  try {
    const data = await cleanBody('org', req.body, { pk: 'org_id', drop: ['user_id'] })
    data.user_id = req.userId
    const [result] = await db.query('INSERT INTO org SET ?', [data])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.put('/org/:id', requireOwner('org'), requireEditable('org'), async (req, res) => {
  try {
    const data = await cleanBody('org', req.body, { pk: 'org_id', drop: ['user_id'] })
    if (!Object.keys(data).length) return res.status(400).json({ error: 'Nothing to update' })
    await db.query('UPDATE org SET ? WHERE org_id = ?', [data, req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.delete('/org/:id', requireOwner('org'), requireEditable('org'), async (req, res) => {
  await db.query('DELETE FROM org WHERE org_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

router.get('/apps', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps WHERE user_id = ?', [req.userId])
  res.json(rows.map(formatDates))
})
router.get('/apps/by-form-id/:formId', async (req, res) => {
  try {
    const formId = String(req.params.formId || '').trim()
    if (!formId || formId.length > 100) return res.status(404).json({ error: 'Not found' })
    const [rows] = await db.query('SELECT * FROM apps WHERE form_id = ? AND user_id = ?', [formId, req.userId])
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(formatDates(rows[0]))
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.get('/apps/:id', requireOwner('apps'), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM apps WHERE app_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
router.post('/apps', async (req, res) => {
  try {
    const data = await cleanBody('apps', req.body, { pk: 'app_id', drop: ['user_id', 'status', 'submitted_at', 'form_id', 'form_serial', 'request_no'] })
    if (data.org_id && !(await ownsRow('org', data.org_id, req.userId))) {
      return forbidden(res, 'Invalid org_id')
    }
    data.user_id = req.userId
    const [result] = await db.query('INSERT INTO apps SET ?', [data])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.put('/apps/:id', requireOwner('apps'), requireEditable('apps'), async (req, res) => {
  try {
    const data = await cleanBody('apps', req.body, { pk: 'app_id', drop: ['user_id', 'status', 'submitted_at', 'form_id', 'form_serial', 'request_no'] })
    if (data.org_id && !(await ownsRow('org', data.org_id, req.userId))) {
      return forbidden(res, 'Invalid org_id')
    }
    if (!Object.keys(data).length) return res.status(400).json({ error: 'Nothing to update' })
    await db.query('UPDATE apps SET ? WHERE app_id = ?', [data, req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.delete('/apps/:id', requireOwner('apps'), requireEditable('apps'), async (req, res) => {
  await db.query('DELETE FROM apps WHERE app_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

router.get('/infra', async (req, res) => {
  const [rows] = await db.query(
    `SELECT i.* FROM infra i JOIN apps a ON a.app_id = i.app_id WHERE a.user_id = ?`,
    [req.userId]
  )
  res.json(rows.map(unpackInfraPayload))
})
router.get('/infra/:id', requireOwner('infra'), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM infra WHERE infra_id = ?', [req.params.id])
  res.json(unpackInfraPayload(rows[0]))
})
router.post('/infra', async (req, res) => {
  try {
    const data = await cleanBody('infra', packInfraPayload(req.body), { pk: 'infra_id' })
    if (!data.app_id || !(await ownsRow('apps', data.app_id, req.userId))) {
      return forbidden(res, 'Invalid app_id')
    }
    if (await isAppLocked(data.app_id)) return res.status(409).json({ error: 'Request already submitted' })
    const [result] = await db.query('INSERT INTO infra SET ?', [data])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.put('/infra/:id', requireOwner('infra'), requireEditable('infra'), async (req, res) => {
  try {
    const data = await cleanBody('infra', packInfraPayload(req.body), {
      pk: 'infra_id',
      drop: ['app_id'],
    })
    if (!Object.keys(data).length) return res.status(400).json({ error: 'Nothing to update' })
    await db.query('UPDATE infra SET ? WHERE infra_id = ?', [data, req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.delete('/infra/:id', requireOwner('infra'), requireEditable('infra'), async (req, res) => {
  await db.query('DELETE FROM infra WHERE infra_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

router.get('/infra/:id/servers', requireOwner('infra'), async (req, res) => {
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
      if (row.server_type === 'db') {
        server.version = row.version || ''
      }
      grouped[row.server_type].push(server)
    }

    res.json(grouped)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/infra/:id/servers', requireOwner('infra'), requireEditable('infra'), async (req, res) => {
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
    for (const server of web) allServers.push({ ...server, server_type: 'web' })
    for (const server of appServers) allServers.push({ ...server, server_type: 'app' })
    for (const server of dbServers) allServers.push({ ...server, server_type: 'db' })
    for (const server of other) allServers.push({ ...server, server_type: 'other' })

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
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/checklist', async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.* FROM checklist c JOIN apps a ON a.app_id = c.app_id WHERE a.user_id = ?`,
    [req.userId]
  )
  res.json(rows.map(formatDates))
})
router.get('/checklist/:id', requireOwner('checklist'), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json(formatDates(rows[0]))
})
router.post('/checklist', async (req, res) => {
  try {
    const data = await cleanBody('checklist', req.body, { pk: 'checklist_id' })
    if (!data.app_id || !(await ownsRow('apps', data.app_id, req.userId))) {
      return forbidden(res, 'Invalid app_id')
    }
    if (await isAppLocked(data.app_id)) return res.status(409).json({ error: 'Request already submitted' })
    const [result] = await db.query('INSERT INTO checklist SET ?', [data])
    res.json({ id: result.insertId, msg: 'saved' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.put('/checklist/:id', requireOwner('checklist'), requireEditable('checklist'), async (req, res) => {
  try {
    const data = await cleanBody('checklist', req.body, { pk: 'checklist_id', drop: ['app_id'] })
    if (!Object.keys(data).length) return res.status(400).json({ error: 'Nothing to update' })
    await db.query('UPDATE checklist SET ? WHERE checklist_id = ?', [data, req.params.id])
    res.json({ msg: 'updated' })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Server error' })
  }
})
router.delete('/checklist/:id', requireOwner('checklist'), requireEditable('checklist'), async (req, res) => {
  await db.query('DELETE FROM checklist WHERE checklist_id = ?', [req.params.id])
  res.json({ msg: 'deleted' })
})

const FORM_ID_PREFIX = 'WebsiteHostingFormRSDC'
const APP_CODE_LENGTH = 5
const SERIAL_PAD = 4

function appCodeFromName(name) {
  const code = String(name || '')
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, APP_CODE_LENGTH)
    .toUpperCase()
  return code || 'APP'
}

async function submitAndAssignFormId(appId, appName) {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const [[row]] = await conn.query(
      'SELECT status, form_id FROM apps WHERE app_id = ? FOR UPDATE',
      [appId]
    )
    if (row.status === 'submitted') {
      await conn.rollback()
      return { alreadySubmitted: true, formId: row.form_id }
    }

    if (row.form_id) {
      await conn.query(
        `UPDATE apps SET status = 'submitted', submitted_at = NOW() WHERE app_id = ?`,
        [appId]
      )
      await conn.commit()
      return { alreadySubmitted: false, formId: row.form_id }
    }

    await conn.query('UPDATE form_serial_counter SET current_serial = current_serial + 1 WHERE id = 1')
    const [[counter]] = await conn.query('SELECT current_serial FROM form_serial_counter WHERE id = 1')
    const serial = counter.current_serial
    const formId = `${FORM_ID_PREFIX}_${appCodeFromName(appName)}_${String(serial).padStart(SERIAL_PAD, '0')}`

    await conn.query(
      `UPDATE apps SET status = 'submitted', submitted_at = NOW(), form_serial = ?, form_id = ?
       WHERE app_id = ?`,
      [serial, formId, appId]
    )
    await conn.commit()
    return { alreadySubmitted: false, formId }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

router.post('/apps/:id/reopen', requireOwner('apps'), async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE apps SET status = DEFAULT WHERE app_id = ? AND status = 'submitted'",
      [req.params.id]
    )
    res.json({ success: true, reopened: result.affectedRows > 0 })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.post('/apps/:id/submit', requireOwner('apps'), async (req, res) => {
  try {
    const appId = req.params.id

    const [[app]] = await db.query(
      'SELECT app_id, org_id, name, status, form_id FROM apps WHERE app_id = ?',
      [appId]
    )

    if (app.status === 'submitted') {
      return res.status(409).json({
        success: false,
        message: 'This request is already submitted',
        requestNo: app.form_id || app.app_id,
        form_id: app.form_id,
      })
    }

    const missing = []
    if (!app.name) missing.push('application details')
    const [orgRows] = app.org_id
      ? await db.query('SELECT 1 FROM org WHERE org_id = ? AND user_id = ?', [app.org_id, req.userId])
      : [[]]
    if (!orgRows.length) missing.push('organization details')
    const [infraRows] = await db.query('SELECT 1 FROM infra WHERE app_id = ? LIMIT 1', [appId])
    if (!infraRows.length) missing.push('infrastructure details')
    const [checkRows] = await db.query('SELECT 1 FROM checklist WHERE app_id = ? LIMIT 1', [appId])
    if (!checkRows.length) missing.push('checklist')

    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: 'Please complete: ' + missing.join(', '),
      })
    }

    const { alreadySubmitted, formId } = await submitAndAssignFormId(appId, app.name)
    if (alreadySubmitted) {
      return res.status(409).json({ success: false, message: 'This request is already submitted', requestNo: formId || appId, form_id: formId })
    }

    res.json({ success: true, message: 'Request submitted successfully', requestNo: formId, form_id: formId })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ success: false, message: 'Server error' })

  }
})

module.exports = router