const LostFound = require('../models/lostFound');

function canModerate(user, report) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'organizer') return true;
  return report.reportedBy && report.reportedBy.toString() === user.id;
}

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.reportType && req.query.reportType !== 'All') {
      filter.reportType = req.query.reportType;
    }

    const reports = await LostFound.find(filter).sort({ createdAt: -1 });
    res.render('lostfound/index', {
      reports,
      reportTypes: LostFound.REPORT_TYPES,
      query: req.query,
      canModerate
    });
  } catch (err) {
    console.error('❌ Lost & Found list error:', err);
    res.status(500).render('error', { message: 'Could not load Lost & Found reports.' });
  }
};

exports.addForm = (req, res) => {
  res.render('lostfound/add', { reportTypes: LostFound.REPORT_TYPES, error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { reportType, name, description, lastSeenLocation, contactInfo } = req.body;

    if (!reportType || !name || !contactInfo) {
      return res.status(400).render('lostfound/add', {
        reportTypes: LostFound.REPORT_TYPES,
        error: 'Report type, name, and contact info are required.',
        values: req.body
      });
    }

    await LostFound.create({
      reportType,
      name,
      description,
      lastSeenLocation,
      contactInfo,
      reportedBy: req.session.user.id
    });

    res.redirect('/lost-found');
  } catch (err) {
    console.error('❌ Lost & Found add error:', err);
    res.status(500).render('lostfound/add', {
      reportTypes: LostFound.REPORT_TYPES,
      error: 'Could not submit that report. Please try again.',
      values: req.body
    });
  }
};

exports.resolve = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);
    if (!report) return res.status(404).render('error', { message: 'Report not found.' });

    if (!canModerate(req.session.user, report)) {
      return res.status(403).render('error', { message: 'You can only resolve your own reports.' });
    }

    report.status = 'Resolved';
    await report.save();
    res.redirect('/lost-found');
  } catch (err) {
    console.error('❌ Lost & Found resolve error:', err);
    res.status(500).render('error', { message: 'Could not update that report.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const report = await LostFound.findById(req.params.id);
    if (!report) return res.status(404).render('error', { message: 'Report not found.' });

    if (!canModerate(req.session.user, report)) {
      return res.status(403).render('error', { message: 'You can only delete your own reports.' });
    }

    await LostFound.findByIdAndDelete(req.params.id);
    res.redirect('/lost-found');
  } catch (err) {
    console.error('❌ Lost & Found delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that report.' });
  }
};
