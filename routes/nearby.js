const express = require('express');
const router = express.Router();
const nearbyController = require('../controllers/nearbyController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', nearbyController.list);
router.get('/add', ...adminOnly, nearbyController.addForm);
router.post('/add', ...adminOnly, nearbyController.add);
router.get('/edit/:id', ...adminOnly, nearbyController.editForm);
router.post('/edit/:id', ...adminOnly, nearbyController.update);
router.post('/delete/:id', ...adminOnly, nearbyController.remove);
router.get('/:id', nearbyController.detail); // keep last so /add and /edit aren't swallowed as an :id

module.exports = router;
