const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter, registerLimiter, forgotLimiter } = require('../middleware/rateLimiters');
const { registerValidation, loginValidation, forgotValidation } = require('../middleware/validators');

router.get('/register', authController.registerForm);
router.post('/register', registerLimiter, registerValidation, authController.register);

router.get('/login', authController.loginForm);
router.post('/login', loginLimiter, loginValidation, authController.login);

router.get('/forgot-password', authController.forgotForm);
router.post('/forgot-password', forgotLimiter, forgotValidation, authController.forgotRequest);

router.post('/logout', authController.logout);

module.exports = router;
