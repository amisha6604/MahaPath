const CrowdReport = require('../models/crowdReport');
const Facility = require('../models/facility');

// Returns a map of { facilityId: mostRecentReport } by taking the newest report per facility.
async function currentByFacility() {
  const reports = await CrowdReport.find().sort({ createdAt: -1 }).populate('facility');
  const seen = new Map();
  reports.forEach(r => {
    if (r.facility && !seen.has(r.facility._id.toString())) {
      seen.set(r.facility._id.toString(), r);
    }
  });
  return seen;
}
exports.currentByFacility = currentByFacility;

exports.list = async (req, res) => {
  try {
    const currentMap = await currentByFacility();
    const facilities = await Facility.find().sort({ type: 1, name: 1 });

    const rows = facilities.map(f => ({
      facility: f,
      current: currentMap.get(f._id.toString()) || null
    }));

    res.render('crowd/index', { rows });
  } catch (err) {
    console.error('❌ Crowd density list error:', err);
    res.status(500).render('error', { message: 'Could not load crowd density data.' });
  }
};

exports.addForm = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ type: 1, name: 1 });
    res.render('crowd/add', { facilities, densityLevels: CrowdReport.DENSITY_LEVELS, error: null, values: {} });
  } catch (err) {
    console.error('❌ Crowd density form error:', err);
    res.status(500).render('error', { message: 'Could not load the report form.' });
  }
};

exports.add = async (req, res) => {
  try {
    const { facility, density, note } = req.body;

    if (!facility || !density) {
      const facilities = await Facility.find().sort({ type: 1, name: 1 });
      return res.status(400).render('crowd/add', {
        facilities,
        densityLevels: CrowdReport.DENSITY_LEVELS,
        error: 'Facility and density level are required.',
        values: req.body
      });
    }

    await CrowdReport.create({
      facility,
      density,
      note,
      reportedBy: req.session.user.id
    });

    res.redirect('/crowd');
  } catch (err) {
    console.error('❌ Crowd density add error:', err);
    res.status(500).render('error', { message: 'Could not submit that report.' });
  }
};
