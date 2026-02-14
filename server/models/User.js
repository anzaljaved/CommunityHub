const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['resident', 'admin', 'business'],
    default: 'resident', // Will be overridden in registration logic
  },
  isBusinessActive: {
    type: Boolean,
    default: false,
  },
  proofDocument: {
    type: String,
    // Not required for residents joining via invite
  },
  houseName: {
    type: String,
    trim: true,
  },
  houseNumber: {
    type: String,
    trim: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    // Not required, can be set later
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
