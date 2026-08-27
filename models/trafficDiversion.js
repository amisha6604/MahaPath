const mongoose = require('mongoose');

const trafficDiversionSchema = new mongoose.Schema({
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
  affectedRoute: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Virtual, not stored — computed on the fly from the current date vs start/end
trafficDiversionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.startDate <= now && now <= this.endDate;
});

trafficDiversionSchema.set('toObject', { virtuals: true });
trafficDiversionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TrafficDiversion', trafficDiversionSchema);
