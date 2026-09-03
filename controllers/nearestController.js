const Facility = require('../models/facility');
const { haversineDistanceKm } = require('../utils/geo');

exports.page = (req, res) => {
  res.render('nearest/index', { types: Facility.TYPES });
};

// GET /nearest/api?lat=..&lng=..&type=optional
// Returns the closest facilities to the given point, sorted nearest-first.
exports.api = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const { type } = req.query;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required.' });
    }

    const filter = {};
    if (type && type !== 'All' && Facility.TYPES.includes(type)) {
      filter.type = type;
    }

    const facilities = await Facility.find(filter);

    const results = facilities
      .map(f => ({
        id: f._id,
        name: f.name,
        type: f.type,
        contact: f.contact,
        lat: f.lat,
        lng: f.lng,
        distanceKm: Math.round(haversineDistanceKm(lat, lng, f.lat, f.lng) * 10) / 10
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 10);

    res.json({ results });
  } catch (err) {
    console.error('❌ Nearest facility API error:', err);
    res.status(500).json({ error: 'Could not compute nearest facilities.' });
  }
};
