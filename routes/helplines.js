const express = require('express');
const router = express.Router();
const helplineController = require('../controllers/helplineController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', helplineController.list);
router.get('/add', ...adminOnly, helplineController.addForm);
router.post('/add', ...adminOnly, helplineController.add);
router.post('/delete/:id', ...adminOnly, helplineController.remove);

module.exports = router;
