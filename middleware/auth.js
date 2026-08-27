// Blocks access unless a user is logged in (req.session.user is set at login).
// Redirects back to /login and remembers where the user was headed via ?next=
exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
};

// Makes the logged-in user (if any) available to every EJS template as `currentUser`.
exports.attachUser = (req, res, next) => {
  res.locals.currentUser = (req.session && req.session.user) || null;
  next();
};

// Blocks access unless the logged-in user has one of the given roles.
// Must run AFTER requireAuth (assumes req.session.user already exists).
// Usage: router.get('/add', requireAuth, requireRole(['organizer', 'admin']), ...)
exports.requireRole = (roles) => (req, res, next) => {
  const user = req.session && req.session.user;
  if (user && roles.includes(user.role)) {
    return next();
  }
  return res.status(403).render('error', {
    message: `You need ${roles.join(' or ')} access to do that. Your account is a "${user ? user.role : 'guest'}" account.`
  });
};
