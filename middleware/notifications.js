const Incident = require('../models/incident');
const TrafficDiversion = require('../models/trafficDiversion');

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

// Runs on every request, attaches res.locals.siteNotifications so any view can
// use it. Kept lightweight — small collections, simple filtered queries.
exports.attachNotifications = async (req, res, next) => {
  try {
    const today = new Date();

    const [urgentIncidents, activeTraffic] = await Promise.all([
      Incident.find({ severity: { $in: ['High', 'Critical'] }, status: { $ne: 'Resolved' } }).sort({ createdAt: -1 }).limit(10),
      TrafficDiversion.find({ startDate: { $lte: today }, endDate: { $gte: today } }).sort({ severity: -1 }).limit(10)
    ]);

    const notifications = [
      ...urgentIncidents.map(inc => ({
        id: `incident-${inc._id}`,
        type: 'incident',
        severity: inc.severity,
        text: `${inc.severity} incident: ${inc.title} — ${inc.location}`,
        link: '/incidents'
      })),
      ...activeTraffic.map(t => ({
        id: `traffic-${t._id}`,
        type: 'traffic',
        severity: t.severity,
        text: `Traffic advisory (${t.severity}): ${t.title} — ${t.affectedRoute}`,
        link: '/traffic'
      }))
    ];

    // Sort by true severity across BOTH types combined, so the single most urgent
    // item (used for the top banner) and the homepage list are both genuinely
    // ordered by real urgency, not just "incidents first because they were queried first."
    notifications.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));

    // Cap the total shown anywhere (banner + homepage section) to a manageable number —
    // this is what actually fixes the "7-8 red lines on page load" problem, combined
    // with the homepage section (not a stacked banner) being where the full list lives.
    res.locals.siteNotifications = notifications.slice(0, 8);
    next();
  } catch (err) {
    console.error('❌ Notification middleware error:', err);
    res.locals.siteNotifications = []; // fail quietly — a banner is not critical enough to break the whole site
    next();
  }
};
