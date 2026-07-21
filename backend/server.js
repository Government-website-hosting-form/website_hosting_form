const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('server running')
})

// ================= USERS =================
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

// ================= APPS =================
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

// ================= INFRA =================
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

// ================= CHECKLIST =================
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

app.listen(5000, () => {
  console.log('server running on port 5000')
})