const Community = require('../models/Community');
const User = require('../models/User');
const generateInviteCode = require('../utils/generateInviteCode');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createCommunity = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create communities' });
    }

    const { name, city, description } = req.body;

    // Generate unique invite code
    let inviteCode;
    let isUnique = false;
    while (!isUnique) {
      inviteCode = generateInviteCode();
      const existing = await Community.findOne({ inviteCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create community
    const community = new Community({
      name,
      city,
      description,
      admins: [req.user.userId],
      members: [req.user.userId],
      inviteCode,
    });

    await community.save();

    // Update user's community
    await User.findByIdAndUpdate(req.user.userId, { community: community._id });

    res.status(201).json({
      message: 'Community created successfully',
      community: {
        id: community._id,
        name: community.name,
        city: community.city,
        description: community.description,
        inviteCode: community.inviteCode,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Invite code generation failed, please try again' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate('admins', 'name email').populate('members', 'name email');
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if already a member
    if (community.members.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    // Add to members
    community.members.push(req.user.userId);
    await community.save();

    // Update user's community
    await User.findByIdAndUpdate(req.user.userId, { community: community._id });

    res.json({ message: 'Successfully joined the community' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const joinByInvite = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { houseName, houseNumber, members, password } = req.body;

    // Validate input
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Members array is required and cannot be empty' });
    }

    // Find community by invite code
    const community = await Community.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!community) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Hash password once
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUsers = [];
    const errors = [];

    // Process each member
    for (const member of members) {
      const { name, email } = member;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        errors.push({ email, error: 'User already exists' });
        continue;
      }

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'resident',
        community: community._id,
        houseName,
        houseNumber,
      });

      await user.save();

      // Add to community members
      community.members.push(user._id);

      createdUsers.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }

    // Save community with new members
    await community.save();

    if (createdUsers.length === 0) {
      return res.status(400).json({ message: 'No users were created', errors });
    }

    res.status(201).json({
      message: `Successfully added ${createdUsers.length} member(s) to the community`,
      community: {
        id: community._id,
        name: community.name,
      },
      createdUsers,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyCommunity = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('community');
    if (!user.community) {
      return res.status(404).json({ message: 'You are not part of any community' });
    }

    res.json(user.community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCommunity,
  getCommunity,
  joinCommunity,
  joinByInvite,
  getMyCommunity,
};
