const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['visitor', 'organizer', 'admin'],
    default: 'visitor'
  },
  // Set when a user submits the "Forgot password?" form — surfaces as a badge for
  // admins on /admin/users, and cleared once an admin performs the reset.
  resetRequested: {
    type: Boolean,
    default: false
  },
  resetRequestedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
