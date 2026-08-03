
const express = require('express')
const router = express.Router()
const {
  ssoLanding,
  increaseSession,
  backToSso,
  signOut
} = require('../controllers/ssoAuthController')

router.post('/landing', ssoLanding)

router.get('/increase-session', increaseSession)

router.get('/back-to-sso', backToSso)

router.get('/signout', signOut)

module.exports = router
