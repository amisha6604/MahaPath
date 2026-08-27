const mongoose = require('mongoose');

const REPORT_TYPES = ['Lost Person', 'Found Person', 'Lost Item', 'Found Item'];

const lostFoundSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: REPORT_TYPES,
    required: true
  },
  name: {
    type: String, // person's name, or a short item name like "Blue backpack"
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  lastSeenLocation: {
    type: String,
    trim: true,
    default: ''
  },
  contactInfo: {
    type: String, // phone or email so people can reach the reporter
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

lostFoundSchema.statics.REPORT_TYPES = REPORT_TYPES;

module.exports = mongoose.model('LostFound', lostFoundSchema);
