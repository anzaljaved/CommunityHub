const express = require('express');
const { activateBusinessProfile, getMyBusinessProfile, updateBusinessProfile, deactivateBusinessProfile, getCommunityBusinessProfiles } = require('../controllers/businessController');
const auth = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/business/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Activate business profile (residents only, with optional image upload)
router.post('/activate', auth, upload.single('advertisementImage'), activateBusinessProfile);

// Get my business profile
router.get('/my', auth, getMyBusinessProfile);

// Update business profile (with optional image upload)
router.patch('/update', auth, upload.single('advertisementImage'), updateBusinessProfile);

// Deactivate business profile
router.delete('/deactivate', auth, deactivateBusinessProfile);

// Get community business profiles
router.get('/community', auth, getCommunityBusinessProfiles);

module.exports = router;
