const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', facilityController.list);
router.get('/add', ...adminOnly, facilityController.addForm);
router.post('/add', ...adminOnly, facilityController.add);
router.get('/edit/:id', ...adminOnly, facilityController.editForm);
router.post('/edit/:id', ...adminOnly, facilityController.update);
router.post('/delete/:id', ...adminOnly, facilityController.remove);

module.exports = router;
