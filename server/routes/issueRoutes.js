const express = require('express');
const {
  createIssue,
  getCommunityIssues,
  getMyIssues,
  updateIssueStatus,
  upvoteIssue,
  removeUpvote,
} = require('../controllers/issueController');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require('../controllers/issueCommentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/issues (create issue)
router.post('/', upload.single('attachment'), createIssue);

// GET /api/issues/community
router.get('/community', getCommunityIssues);

// GET /api/issues/my
router.get('/my', getMyIssues);

// PATCH /api/issues/:id/status
router.patch('/:id/status', updateIssueStatus);

// POST /api/issues/:id/upvote
router.post('/:id/upvote', upvoteIssue);

// DELETE /api/issues/:id/upvote
router.delete('/:id/upvote', removeUpvote);

// POST /api/issues/:issueId/comments
router.post('/:issueId/comments', createComment);

// GET /api/issues/:issueId/comments
router.get('/:issueId/comments', getComments);

// PATCH /api/issues/comments/:commentId
router.patch('/comments/:commentId', updateComment);

// DELETE /api/issues/comments/:commentId
router.delete('/comments/:commentId', deleteComment);

module.exports = router;
