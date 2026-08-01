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
