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
      admins: [req.user._id],
      members: [req.user._id],
      inviteCode,
    });

    await community.save();

    // Update user's community
await User.findByIdAndUpdate(req.user._id, { community: community._id });

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
    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this community' });
    }

    // Add to members
    community.members.push(req.user._id);
    await community.save();

    // Update user's community
    await User.findByIdAndUpdate(req.user._id, { community: community._id });

    res.json({ message: 'Successfully joined the community' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const joinByInvite = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const { name, email, password, houseName, houseNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !houseName || !houseNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find community
    const community = await Community.findOne({
      inviteCode: inviteCode.toUpperCase(),
    });

    if (!community) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create resident
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "resident",
      community: community._id,
      houseName,
      houseNumber,
    });

    await user.save();

    // Add to community members
    community.members.push(user._id);
    await community.save();

    res.status(201).json({
      message: "Successfully joined community",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getMyCommunity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('community');
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
