const { body, validationResult } = require('express-validator');

// ---------- Auth ----------

exports.registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores.'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match.')
];

exports.loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

// ---------- Events ----------

exports.eventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 120 }).withMessage('Title must be under 120 characters.'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required.'),
  body('date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Please provide a valid date.'),
  body('time')
    .trim()
    .notEmpty().withMessage('Time is required.'),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 }).withMessage('Description must be under 1000 characters.')
];

// Helper: returns the first validation error message, or null if none.
// Used by controllers to plug straight into their existing error-rendering pattern
// without needing to restructure how each one renders its form.
exports.firstError = (req) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return null;
  return errors.array()[0].msg;
};
