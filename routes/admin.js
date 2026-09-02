const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', ...adminOnly, adminController.dashboard);
router.get('/users', ...adminOnly, adminController.listUsers);
router.post('/users/:id/role', ...adminOnly, adminController.updateUserRole);

module.exports = router;
