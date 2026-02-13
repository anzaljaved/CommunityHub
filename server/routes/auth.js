const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', upload.single('proofDocument'), register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/change-password
router.post('/change-password', auth, changePassword);

module.exports = router;
