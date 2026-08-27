const mongoose = require('mongoose');

// One model covers all fixed physical facilities so we're not duplicating
// near-identical schemas five times. `type` is what differentiates them
// on the map (different icon/color per type — see views/map.ejs).
const FACILITY_TYPES = ['Ghat', 'Hospital', 'Police Booth', 'Parking', 'Medical Camp'];

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: FACILITY_TYPES,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  contact: {
    type: String,
    trim: true,
    default: ''
  },
  capacity: {
    type: Number // mainly relevant for Parking / Medical Camp; optional otherwise
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

facilitySchema.statics.TYPES = FACILITY_TYPES;

module.exports = mongoose.model('Facility', facilitySchema);
