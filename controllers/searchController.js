const Event = require('../models/event');
const Facility = require('../models/facility');
const Incident = require('../models/incident');
const Faq = require('../models/faq');
const Helpline = require('../models/helpline');
const NearbyPlace = require('../models/nearbyPlace');

exports.search = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.render('search/index', { query: q, results: null, totalCount: 0 });
    }

    // Escape regex special characters so a query like "C++" or "(test)" doesn't crash the regex
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safe, 'i');

    // Six content types searched in parallel — a single query string, genuinely
    // federated across the whole site rather than scoped to just one resource.
    const [events, facilities, incidents, faqs, helplines, nearby] = await Promise.all([
      Event.find({ $or: [{ title: regex }, { description: regex }, { location: regex }] }).limit(8),
      Facility.find({ $or: [{ name: regex }, { description: regex }, { type: regex }] }).limit(8),
      Incident.find({ $or: [{ title: regex }, { description: regex }, { location: regex }] }).limit(8),
      Faq.find({ isPublished: true, $or: [{ question: regex }, { answer: regex }] }).limit(8),
      Helpline.find({ $or: [{ name: regex }, { category: regex }] }).limit(8),
      NearbyPlace.find({ $or: [{ name: regex }, { shortDescription: regex }] }).limit(8)
    ]);

    const results = { events, facilities, incidents, faqs, helplines, nearby };
    const totalCount = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    res.render('search/index', { query: q, results, totalCount });
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).render('error', { message: 'Search failed. Please try again.' });
  }
};
