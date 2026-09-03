const mongoose = require('mongoose');

const nearbyPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  distanceFromPrayagraj: {
    type: String, // e.g. "~120 km" — free text since exact distance depends on route
    trim: true,
    default: ''
  },
  shortDescription: {
    type: String, // shown on the homepage scroller card
    required: true,
    trim: true
  },
  history: {
    type: String, // longer text shown on the detail page
    required: true,
    trim: true
  },
  imageUrl: {
    type: String, // optional — falls back to a themed CSS placeholder if empty
    trim: true,
    default: ''
  },
  mapsUrl: {
    type: String, // optional external Google Maps link
    trim: true,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('NearbyPlace', nearbyPlaceSchema);
