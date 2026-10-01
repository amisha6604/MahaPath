const Event = require('../models/event');
const Facility = require('../models/facility');
const LostFound = require('../models/lostFound');
const Helpline = require('../models/helpline');
const TrafficDiversion = require('../models/trafficDiversion');
const Incident = require('../models/incident');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Helper: turns [{ _id: 'X', count: N }, ...] from an aggregate into a plain { X: N } object
function toCountMap(aggResult) {
  const map = {};
  aggResult.forEach(row => { map[row._id || 'Unspecified'] = row.count; });
  return map;
}

exports.dashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalEvents,
      upcomingEvents,
      eventsByCategory,
      totalFacilities,
      facilitiesByType,
      openLostFound,
      resolvedLostFound,
      totalIncidents,
      incidentsBySeverity,
      openIncidents,
      activeTraffic,
      totalHelplines,
      usersByRole,
      recentIncidents,
      recentLostFound,
      recentEvents
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: today } }),
      Event.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Facility.countDocuments(),
      Facility.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      LostFound.countDocuments({ status: 'Open' }),
      LostFound.countDocuments({ status: 'Resolved' }),
      Incident.countDocuments(),
      Incident.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Incident.countDocuments({ status: { $ne: 'Resolved' } }),
      TrafficDiversion.countDocuments({ startDate: { $lte: today }, endDate: { $gte: today } }),
      Helpline.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Incident.find().sort({ createdAt: -1 }).limit(5),
      LostFound.find().sort({ createdAt: -1 }).limit(5),
      Event.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.render('admin/dashboard', {
      stats: {
        totalEvents,
        upcomingEvents,
        totalFacilities,
        openLostFound,
        resolvedLostFound,
        totalIncidents,
        openIncidents,
        activeTraffic,
        totalHelplines
      },
      eventsByCategory: toCountMap(eventsByCategory),
      facilitiesByType: toCountMap(facilitiesByType),
      incidentsBySeverity: toCountMap(incidentsBySeverity),
      usersByRole: toCountMap(usersByRole),
      recentIncidents,
      recentLostFound,
      recentEvents
    });
  } catch (err) {
    console.error('❌ Admin dashboard error:', err);
    res.status(500).render('error', { message: 'Could not load the admin dashboard.' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { users, error: null, success: null });
  } catch (err) {
    console.error('❌ Admin user list error:', err);
    res.status(500).render('error', { message: 'Could not load users.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetId = req.params.id;

    if (!['visitor', 'organizer', 'admin'].includes(role)) {
      const users = await User.find().sort({ createdAt: -1 });
      return res.status(400).render('admin/users', { users, error: 'Invalid role.', success: null });
    }

    // Guard rail: don't let an admin accidentally demote themselves and get locked out
    if (targetId === req.session.user.id && role !== 'admin') {
      const users = await User.find().sort({ createdAt: -1 });
      return res.status(400).render('admin/users', {
        users,
        error: "You can't change your own role away from admin here — ask another admin to do it.",
        success: null
      });
    }

    const user = await User.findByIdAndUpdate(targetId, { role }, { new: true });
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { users, error: null, success: `${user.username} is now "${role}".` });
  } catch (err) {
    console.error('❌ Admin role update error:', err);
    res.status(500).render('error', { message: 'Could not update that user\'s role.' });
  }
};

// Admin-initiated password reset. There's no email service wired up yet (see
// SYSTEM_DESIGN.md roadmap), so this generates a random temporary password, shown
// to the admin ONCE, who then relays it to the user out-of-band (chat, in person,
// etc.) — the user should change it immediately via their own /profile page.
exports.resetUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const users = await User.find().sort({ createdAt: -1 });
      return res.status(404).render('admin/users', { users, error: 'User not found.', success: null });
    }

    const tempPassword = crypto.randomBytes(6).toString('hex'); // 12-character one-time password
    user.password = await bcrypt.hash(tempPassword, 10);
    await user.save();

    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', {
      users,
      error: null,
      success: `Password reset for "${user.username}". Temporary password (shown once — relay it to them securely): ${tempPassword}`
    });
  } catch (err) {
    console.error('❌ Admin password reset error:', err);
    res.status(500).render('error', { message: "Could not reset that user's password." });
  }
};
