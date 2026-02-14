const User = require('../models/User');

const getLatestCommunication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    // Mock latest message - replace with actual Message model query
    const latestMessage = {
      sender: {
        name: 'Alice Johnson',
        avatar: 'https://via.placeholder.com/32',
      },
      preview: 'Hey everyone, the community meeting is scheduled for tomorrow at 6 PM...',
      timestamp: new Date().toISOString(),
    };

    res.json(latestMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLatestCommunication,
};
