const mongoose = require('mongoose');

const INCIDENT_CATEGORIES = ['Medical', 'Security', 'Fire', 'Crowd Crush', 'Infrastructure', 'Other'];
const INCIDENT_SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const INCIDENT_STATUSES = ['Reported', 'In Progress', 'Resolved'];

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: INCIDENT_CATEGORIES,
    default: 'Other'
  },
  severity: {
    type: String,
    enum: INCIDENT_SEVERITIES,
    default: 'Medium'
  },
  status: {
    type: String,
    enum: INCIDENT_STATUSES,
    default: 'Reported'
  },
  location: {
    type: String, // free-text location description (e.g. "Near Sangam Ghat, Gate 3")
    required: true,
    trim: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

incidentSchema.statics.CATEGORIES = INCIDENT_CATEGORIES;
incidentSchema.statics.SEVERITIES = INCIDENT_SEVERITIES;
incidentSchema.statics.STATUSES = INCIDENT_STATUSES;

module.exports = mongoose.model('Incident', incidentSchema);
