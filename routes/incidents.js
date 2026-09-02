const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { requireAuth, requireRole } = require('../middleware/auth');

const triageOnly = [requireAuth, requireRole(['organizer', 'admin'])];
const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', incidentController.list);
router.get('/add', requireAuth, incidentController.addForm);
router.post('/add', requireAuth, incidentController.add);
router.post('/status/:id', ...triageOnly, incidentController.updateStatus);
router.post('/delete/:id', ...adminOnly, incidentController.remove);

module.exports = router;
