const express = require('express');
const router = express.Router();
const lostFoundController = require('../controllers/lostFoundController');
const { requireAuth } = require('../middleware/auth');

router.get('/', lostFoundController.list);
router.get('/add', requireAuth, lostFoundController.addForm);
router.post('/add', requireAuth, lostFoundController.add);
router.post('/resolve/:id', requireAuth, lostFoundController.resolve);
router.post('/delete/:id', requireAuth, lostFoundController.remove);

module.exports = router;
