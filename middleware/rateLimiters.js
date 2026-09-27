const rateLimit = require('express-rate-limit');

function rateLimitHandler(message) {
  return (req, res) => {
    res.status(429).render('error', { message });
  };
}

// Limits login attempts per IP — blocks brute-force password guessing.
// Successful logins don't count against the limit, only failed/repeated attempts.
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: rateLimitHandler('Too many login attempts from this device. Please wait 15 minutes and try again.')
});

// Limits registration attempts per IP — blocks automated spam account creation.
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many accounts created from this device recently. Please wait an hour and try again.')
});
