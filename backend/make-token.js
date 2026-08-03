
const [, , ssoId, role, userType] = process.argv

if (!ssoId) {
  console.error('Usage: node make-token.js <ssoId> [role] [userType]')
  process.exit(1)
}

const payload = {
  ssoId,
  roles: role ? [role] : [],
  userType: userType || 'CITIZEN',
  designation: role || userType || 'CITIZEN'
}

const token = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64')
console.log(token)
