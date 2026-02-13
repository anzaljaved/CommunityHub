const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['water', 'electricity', 'maintenance', 'security', 'other'],
    required: true,
  },
  type: {
    type: String,
    enum: ['private', 'community'],
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  attachment: {
    type: String, // File path
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Ensure upvotes are only used for community issues
issueSchema.pre('save', function(next) {
  if (this.type === 'private' && this.upvotes.length > 0) {
    return next(new Error('Private issues cannot have upvotes'));
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
