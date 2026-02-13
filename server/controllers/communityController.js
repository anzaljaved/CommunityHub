const Community = require('../models/Community');
const User = require('../models/User');

const createCommunity = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create communities' });
    }

    const { name, city, description } = req.body;

    const community = new Community({
      name,
      city,
      description,
      admins: [req.user.userId],
      members: [req.user.userId], // Creator is also a member
    });

    await community.save();

    // Update user's community
    await User.findByIdAndUpdate(req.user.userId, { community: community._id });

    res.status(201).json({
      message: 'Community created successfully',
      community,
    });
  } catch (error) {
    console.error(error);
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
  getMyCommunity,
};
