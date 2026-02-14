const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One user can only have one business profile
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  advertisementImage: {
    type: String, // file path
  },
  advertisementText: {
    type: String,
    trim: true,
  },
  isApproved: {
    type: Boolean,
    default: true,  // Set to true for testing; change to false for moderation
  },
}, {
  timestamps: true,
});

// Compound index to ensure one profile per user per community
businessProfileSchema.index({ owner: 1, community: 1 }, { unique: true });

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);
