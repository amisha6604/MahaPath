const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.registerForm = (req, res) => {
  res.render('register', { error: null });
};

exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password) {
      return res.render('register', { error: 'Username and password are required.' });
    }
    if (password !== confirmPassword) {
      return res.render('register', { error: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.render('register', { error: 'That username is already taken.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username: username.toLowerCase().trim(), password: hashed });

    req.session.user = { id: user._id.toString(), username: user.username, role: user.role };
    res.redirect('/');
  } catch (err) {
    console.error('❌ Register error:', err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
};

exports.loginForm = (req, res) => {
  res.render('login', { error: null, next: req.query.next || '/' });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const next = req.body.next || '/';

    const user = await User.findOne({ username: (username || '').toLowerCase().trim() });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password.', next });
    }

    const match = await bcrypt.compare(password || '', user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid username or password.', next });
    }

    req.session.user = { id: user._id.toString(), username: user.username, role: user.role };
    res.redirect(next && next.startsWith('/') ? next : '/');
  } catch (err) {
    console.error('❌ Login error:', err);
    res.render('login', { error: 'Something went wrong. Please try again.', next: '/' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
