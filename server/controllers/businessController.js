const BusinessProfile = require('../models/BusinessProfile');
const User = require('../models/User');

// Activate business profile (residents only)
const activateBusinessProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    if (user.role !== 'resident') {
      return res.status(403).json({ message: 'Only resident users can activate business profiles' });
    }

    // Check if already has business profile
    const existingProfile = await BusinessProfile.findOne({ owner: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Business profile already exists' });
    }

    const {
      title,
      description,
      contactPhone,
      contactEmail,
      advertisementText,
    } = req.body;

    if (!title || !contactPhone) {
      return res.status(400).json({ message: 'Title and contact phone are required' });
    }

    const profileData = {
      owner: req.user._id,
      community: user.community,
      title,
      description,
      contactPhone,
      contactEmail,
      advertisementText,
    };

    // Handle file upload
    if (req.file) {
      profileData.advertisementImage = req.file.path;
    }

    // Create profile
    const profile = await BusinessProfile.create(profileData);

    // Update user role and activation
    user.role = 'business';
    user.isBusinessActive = true;
    await user.save();

    res.status(201).json({
      message: 'Business profile activated successfully',
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my business profile
const getMyBusinessProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ owner: req.user._id })
      .populate('owner', 'name email')
      .populate('community', 'name');

    if (!profile) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update business profile
const updateBusinessProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ owner: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    const allowedFields = [
      'title',
      'description',
      'contactPhone',
      'contactEmail',
      'advertisementText'
    ];

    // Update allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    // Handle file upload
    if (req.file) {
      profile.advertisementImage = req.file.path;
    }

    await profile.save();

    res.json({
      message: 'Business profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate business profile
const deactivateBusinessProfile = async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ owner: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    // Delete profile
    await BusinessProfile.findByIdAndDelete(profile._id);

    // Update user
    const user = await User.findById(req.user._id);
    user.role = 'resident';
    user.isBusinessActive = false;
    await user.save();

    res.json({ message: 'Business profile deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get community business profiles
const getCommunityBusinessProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    const profiles = await BusinessProfile.find({
      community: user.community,
      isApproved: true,
    })
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  activateBusinessProfile,
  getMyBusinessProfile,
  updateBusinessProfile,
  deactivateBusinessProfile,
  getCommunityBusinessProfiles,
};
