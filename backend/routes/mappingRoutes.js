
const express = require('express')
const router = express.Router()
const { submitMapping, approvalCallback, statusCallback } = require('../controllers/mappingController')
const { uploadApprovalLetter } = require('../middleware/upload')
router.post('/submit', uploadApprovalLetter.single('approvalLetter'), submitMapping)
router.post('/approval-callback', approvalCallback)
router.post('/status-callback', statusCallback)
module.exports = router
