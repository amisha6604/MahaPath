const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', trafficController.list);
router.get('/add', ...adminOnly, trafficController.addForm);
router.post('/add', ...adminOnly, trafficController.add);
router.post('/delete/:id', ...adminOnly, trafficController.remove);

module.exports = router;
