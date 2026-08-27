const TrafficDiversion = require('../models/trafficDiversion');

exports.list = async (req, res) => {
  try {
    const diversions = await TrafficDiversion.find().sort({ startDate: 1 });
    res.render('traffic/index', { diversions });
  } catch (err) {
    console.error('❌ Traffic list error:', err);
    res.status(500).render('error', { message: 'Could not load traffic advisories.' });
  }
};

exports.addForm = (req, res) => {
  res.render('traffic/add', { error: null, values: {} });
};

exports.add = async (req, res) => {
  try {
    const { title, description, affectedRoute, severity, startDate, endDate } = req.body;

    if (!title || !description || !affectedRoute || !startDate || !endDate) {
      return res.status(400).render('traffic/add', {
        error: 'All fields except severity are required.',
        values: req.body
      });
    }

    await TrafficDiversion.create({
      title,
      description,
      affectedRoute,
      severity,
      startDate,
      endDate,
      createdBy: req.session.user.id
    });

    res.redirect('/traffic');
  } catch (err) {
    console.error('❌ Traffic add error:', err);
    res.status(500).render('traffic/add', {
      error: 'Could not save that advisory. Please try again.',
      values: req.body
    });
  }
};

exports.remove = async (req, res) => {
  try {
    await TrafficDiversion.findByIdAndDelete(req.params.id);
    res.redirect('/traffic');
  } catch (err) {
    console.error('❌ Traffic delete error:', err);
    res.status(500).render('error', { message: 'Could not delete that advisory.' });
  }
};
