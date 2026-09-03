const express = require('express');
const router = express.Router();
const crowdController = require('../controllers/crowdController');
const { requireAuth, requireRole } = require('../middleware/auth');

const reporterOnly = [requireAuth, requireRole(['organizer', 'admin'])];

router.get('/', crowdController.list);
router.get('/add', ...reporterOnly, crowdController.addForm);
router.post('/add', ...reporterOnly, crowdController.add);

module.exports = router;
