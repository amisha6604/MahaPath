const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Event = require('../models/event');

// Shows the logged-in user's profile: role, join date, and (if organizer/admin) events they created
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) {
      req.session.destroy(() => res.redirect('/login'));
      return;
    }

    let myEvents = [];
    if (user.role === 'organizer' || user.role === 'admin') {
      myEvents = await Event.find({ createdBy: user._id }).sort({ date: 1 });
    }

    res.render('profile', { user, myEvents, error: null, success: null });
  } catch (err) {
    console.error('❌ Profile error:', err);
    res.status(500).render('error', { message: 'Could not load your profile.' });
  }
};

// Lets a user change their own password (requires current password)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.session.user.id);
    const myEvents = (user.role === 'organizer' || user.role === 'admin')
      ? await Event.find({ createdBy: user._id }).sort({ date: 1 })
      : [];

    if (!currentPassword || !newPassword) {
      return res.render('profile', { user, myEvents, error: 'All fields are required.', success: null });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.render('profile', { user, myEvents, error: 'Current password is incorrect.', success: null });
    }

    if (newPassword !== confirmNewPassword) {
      return res.render('profile', { user, myEvents, error: 'New passwords do not match.', success: null });
    }

    if (newPassword.length < 6) {
      return res.render('profile', { user, myEvents, error: 'New password must be at least 6 characters.', success: null });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.render('profile', { user, myEvents, error: null, success: 'Password updated successfully.' });
  } catch (err) {
    console.error('❌ Change password error:', err);
    res.status(500).render('error', { message: 'Could not update your password.' });
  }
};
