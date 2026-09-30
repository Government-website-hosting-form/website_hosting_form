const express = require('express')
const router = express.Router()
const { submitMapping, checkStatus, listRequests, approveRequest, rejectRequest, raiseObjection, initRequest, getMyRequest, downloadApprovalLetter, getMe } = require('../controllers/mappingController')
const { uploadApprovalLetterSingle } = require('../middleware/upload')
const { requireOicRole } = require('../middleware/auth')

router.post('/submit', uploadApprovalLetterSingle('approvalLetter'), submitMapping)
router.get('/status', checkStatus)
router.get('/my-request', getMyRequest)
router.get('/me', getMe)

router.post('/init', initRequest)
router.get('/requests', requireOicRole, listRequests)
router.post('/:requestId/approve', requireOicRole, approveRequest)
router.post('/:requestId/reject', requireOicRole, rejectRequest)
router.post('/:requestId/objection', requireOicRole, raiseObjection)
router.get('/:requestId/approval-letter', requireOicRole, downloadApprovalLetter)

module.exports = router