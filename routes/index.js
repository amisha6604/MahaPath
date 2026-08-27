const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const profileController = require('../controllers/profileController');
const { requireAuth, requireRole } = require('../middleware/auth');

const canManageEvents = [requireAuth, requireRole(['organizer', 'admin'])];

// Public routes — anyone can browse
router.get('/', mainController.home);
router.get('/map', mainController.map);
router.get('/schedule', mainController.schedule);

// Organizer/admin-only routes — visitors are logged in but can't manage events
router.get('/add', ...canManageEvents, mainController.addForm);
router.post('/add', ...canManageEvents, mainController.addEvent);

router.get('/edit/:id', ...canManageEvents, mainController.editForm);
router.post('/edit/:id', ...canManageEvents, mainController.updateEvent);

router.post('/delete/:id', ...canManageEvents, mainController.deleteEvent);

// Any logged-in user (visitor, organizer, or admin) can view/edit their own profile
router.get('/profile', requireAuth, profileController.viewProfile);
router.post('/profile/password', requireAuth, profileController.changePassword);

module.exports = router;
