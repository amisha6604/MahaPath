const Incident = require('../models/incident');

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
    if (req.query.severity && req.query.severity !== 'All') filter.severity = req.query.severity;
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;

    // Most urgent, most recent first: Critical > High > Medium > Low, then newest
    const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const incidents = await Incident.find(filter).sort({ createdAt: -1 });
    incidents.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    res.render('incidents/index', {
      incidents,
      categories: Incident.CATEGORIES,
      severities: Incident.SEVERITIES,
      statuses: Incident.STATUSES,
      query: req.query
    });
  } catch (err) {
    console.error('❌ Incident list error:', err);
    res.status(500).render('error', { message: 'Could not load incidents.' });
  }
};

exports.addForm = (req, res) => {
  res.render('incidents/add', { categories: Incident.CATEGORIES, severities: Incident.SEVERITIES, error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { title, description, category, severity, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).render('incidents/add', {
        categories: Incident.CATEGORIES,
        severities: Incident.SEVERITIES,
        error: 'Title, description, and location are required.',
        values: req.body
      });
    }

    await Incident.create({
      title,
      description,
      category,
      severity,
      location,
      reportedBy: req.session.user.id
    });

    res.redirect('/incidents');
  } catch (err) {
    console.error('❌ Incident add error:', err);
    res.status(500).render('incidents/add', {
      categories: Incident.CATEGORIES,
      severities: Incident.SEVERITIES,
      error: 'Could not submit that report. Please try again.',
      values: req.body
    });
  }
};

// Organizer/admin only — move an incident through Reported -> In Progress -> Resolved
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!Incident.STATUSES.includes(status)) {
      return res.status(400).render('error', { message: 'Invalid status.' });
    }
    await Incident.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/incidents');
  } catch (err) {
    console.error('❌ Incident status update error:', err);
    res.status(500).render('error', { message: 'Could not update that incident.' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.redirect('/incidents');
  } catch (err) {
    console.error('❌ Incident delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that incident.' });
  }
};
