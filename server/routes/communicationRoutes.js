const express = require('express');
const { getLatestCommunication } = require('../controllers/communicationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/latest', auth, getLatestCommunication);

module.exports = router;
