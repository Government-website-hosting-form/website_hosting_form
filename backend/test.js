const db = require('./db')

async function checkConnection() {
  const [rows] = await db.query('SHOW TABLES')
  console.log(rows)
}

checkConnection()