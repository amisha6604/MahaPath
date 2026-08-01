const mongoose = require('mongoose');

const CATEGORIES = ['Shahi Snan', 'Aarti', 'Satsang', 'Procession', 'Cultural Program', 'Other'];

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: CATEGORIES,
    default: 'Other'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

eventSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Event', eventSchema);
