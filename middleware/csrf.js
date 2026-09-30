const crypto = require('crypto');

// Custom session-based CSRF protection — deliberately not using the popular `csurf`
// package, since it's officially deprecated/unmaintained by its own authors and doesn't
// cleanly support Express 5. This is the same underlying pattern (a per-session secret
// token that must be echoed back on state-changing requests) implemented directly.

// Generates a token once per session and makes it available to every view as
// `csrfToken` — mount this globally, early in the middleware chain (after sessions).
exports.attachCsrfToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

// Verifies the token on state-changing requests. The token itself is injected into
// every <form method="POST"> automatically by a small client-side script (see
// views/partials/head.ejs) rather than manually added to 25+ view files by hand —
// far less error-prone than editing every form individually.
exports.verifyCsrfToken = (req, res, next) => {
  const submitted = req.body && req.body._csrf;
  if (!submitted || submitted !== req.session.csrfToken) {
    return res.status(403).render('error', {
      message: 'Your session security token was missing or invalid. Please go back, refresh the page, and try again.'
    });
  }
  next();
};
