const Incident = require('../models/incident');
const TrafficDiversion = require('../models/trafficDiversion');

// Runs on every request, attaches res.locals.siteNotifications so any view can
// render a banner. Kept lightweight — small collections, simple filtered queries.
exports.attachNotifications = async (req, res, next) => {
  try {
    const today = new Date();

    const [urgentIncidents, activeTraffic] = await Promise.all([
      Incident.find({ severity: { $in: ['High', 'Critical'] }, status: { $ne: 'Resolved' } }).sort({ createdAt: -1 }).limit(5),
      TrafficDiversion.find({ startDate: { $lte: today }, endDate: { $gte: today } }).sort({ severity: -1 }).limit(5)
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

    res.locals.siteNotifications = notifications;
    next();
  } catch (err) {
    console.error('❌ Notification middleware error:', err);
    res.locals.siteNotifications = []; // fail quietly — a banner is not critical enough to break the whole site
    next();
  }
};
