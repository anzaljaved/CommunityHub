const IssueComment = require('../models/IssueComment');
const Issue = require('../models/Issue');
const User = require('../models/User');

const createComment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create comments' });
    }

    const { issueId } = req.params;
    const { content } = req.body;

    // Check if issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if admin is in the same community
    const user = await User.findById(req.user._id);
    if (!user || user.community.toString() !== issue.community.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = new IssueComment({
      issue: issueId,
      user: req.user._id,
      content,
    });

    await comment.save();

    // Populate for response
    await comment.populate('user', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getComments = async (req, res) => {
  try {
    const { issueId } = req.params;

    // Check if issue exists and user has access
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // For private issues, only creator and admin can see comments
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (issue.type === 'private') {
      if (issue.createdBy.toString() !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // Community issues: only community members
      if (user.community.toString() !== issue.community.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const comments = await IssueComment.find({ issue: issueId })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await IssueComment.findById(commentId).populate('issue');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is admin and in the same community
    const user = await User.findById(req.user._id);
    if (req.user.role !== 'admin' || !user || user.community.toString() !== comment.issue.community.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await IssueComment.findById(commentId).populate('issue');
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is admin and in the same community
    const user = await User.findById(req.user._id);
    if (req.user.role !== 'admin' || !user || user.community.toString() !== comment.issue.community.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await IssueComment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
