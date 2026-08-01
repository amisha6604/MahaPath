const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { requireAuth } = require('../middleware/auth');

// Public routes — anyone can browse
router.get('/', mainController.home);
router.get('/map', mainController.map);
router.get('/schedule', mainController.schedule);

// Organizer-only routes — require login
router.get('/add', requireAuth, mainController.addForm);
router.post('/add', requireAuth, mainController.addEvent);

router.get('/edit/:id', requireAuth, mainController.editForm);
router.post('/edit/:id', requireAuth, mainController.updateEvent);

router.post('/delete/:id', requireAuth, mainController.deleteEvent);

module.exports = router;
