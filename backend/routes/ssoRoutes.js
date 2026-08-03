
const express = require('express');
const router = express.Router();
const { getUserBasic, getUserDetails } = require('../controllers/ssoController');

router.get('/1/user-basic', getUserBasic);
router.get('/2/user-details', getUserDetails);

module.exports = router;