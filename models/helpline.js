const mongoose = require('mongoose');

const HELPLINE_CATEGORIES = [
  'General Mahakumbh Helpline',
  'Police',
  'Medical',
  'Fire',
  'Women Helpline',
  'Tourist Helpline',
  'Disaster Management',
  'Railway Enquiry'
];

const helplineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: HELPLINE_CATEGORIES,
    default: 'General Mahakumbh Helpline'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

helplineSchema.statics.CATEGORIES = HELPLINE_CATEGORIES;

module.exports = mongoose.model('Helpline', helplineSchema);
