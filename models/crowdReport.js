const mongoose = require('mongoose');

const DENSITY_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

// Each document is one point-in-time report. The MOST RECENT report per facility
// is treated as its "current" density — see crowdController.currentByFacility().
// This isn't live sensor data; it's manually reported by organizers/admins on the ground.
const crowdReportSchema = new mongoose.Schema({
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  density: {
    type: String,
    enum: DENSITY_LEVELS,
    required: true
  },
  note: {
    type: String,
    trim: true,
    default: ''
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

crowdReportSchema.statics.DENSITY_LEVELS = DENSITY_LEVELS;

module.exports = mongoose.model('CrowdReport', crowdReportSchema);
