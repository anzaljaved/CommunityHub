const express = require('express');
const { createCommunity, getCommunity, joinCommunity, getMyCommunity } = require('../controllers/communityController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/community (create community)
router.post('/', createCommunity);

// GET /api/community/my
router.get('/my', getMyCommunity);

// GET /api/community/:id
router.get('/:id', getCommunity);

// POST /api/community/join/:id
router.post('/join/:id', joinCommunity);

module.exports = router;
