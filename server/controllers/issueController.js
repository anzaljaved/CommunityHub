const Issue = require('../models/Issue');
const User = require('../models/User');

const createIssue = async (req, res) => {
  try {
    const { title, description, category, type } = req.body;

    // Get user and ensure they have a community
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    const issue = new Issue({
      title,
      description,
      category,
      type,
      createdBy: req.user._id,
      community: user.community,
      attachment: req.file ? req.file.path : undefined,
      upvotes: type === 'private' ? [] : [], // Initialize empty
    });

    await issue.save();

    // Populate for response
    await issue.populate('createdBy', 'name email');

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCommunityIssues = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    const { sort } = req.query;
    let sortOption = { createdAt: -1 }; // default sort by recent

    if (sort === 'popular') {
      sortOption = { upvotes: -1 }; // sort by upvotes count descending
    }

    const issues = await Issue.find({
      community: user.community,
      type: 'community',
    })
      .populate('createdBy', 'name email')
      .populate('upvotes', 'name email')
      .sort(sortOption);

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = { createdBy: req.user._id };

    if (type) {
      filter.type = type;
    }

    const issues = await Issue.find(filter)
      .populate('community', 'name')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateIssueStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update issue status' });
    }

    const { status } = req.body;
    const validStatuses = ['open', 'in-progress', 'resolved'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if admin is in the same community
    const user = await User.findById(req.user._id);
    if (!user || user.community.toString() !== issue.community.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.type !== 'community') {
      return res.status(400).json({ message: 'Only community issues can be upvoted' });
    }

    const userId = req.user._id;
    const upvoteIndex = issue.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      // Already upvoted, remove upvote
      issue.upvotes.splice(upvoteIndex, 1);
      await issue.save();
      res.json({ message: 'Upvote removed', upvotes: issue.upvotes.length });
    } else {
      // Add upvote
      issue.upvotes.push(userId);
      await issue.save();
      res.json({ message: 'Upvote added', upvotes: issue.upvotes.length });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeUpvote = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.type !== 'community') {
      return res.status(400).json({ message: 'Only community issues can be upvoted' });
    }

    const userId = req.user._id;
    const upvoteIndex = issue.upvotes.indexOf(userId);

    if (upvoteIndex === -1) {
      return res.status(400).json({ message: 'You have not upvoted this issue' });
    }

    issue.upvotes.splice(upvoteIndex, 1);
    await issue.save();

    res.json({ message: 'Upvote removed', upvotes: issue.upvotes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createIssue,
  getCommunityIssues,
  getMyIssues,
  updateIssueStatus,
  upvoteIssue,
  removeUpvote,
};
