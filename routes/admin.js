const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const faqController = require('../controllers/faqController');
const { requireAuth, requireRole } = require('../middleware/auth');

const adminOnly = [requireAuth, requireRole(['admin'])];

router.get('/', ...adminOnly, adminController.dashboard);
router.get('/users', ...adminOnly, adminController.listUsers);
router.post('/users/:id/role', ...adminOnly, adminController.updateUserRole);

router.get('/faqs', ...adminOnly, faqController.adminList);
router.get('/faqs/add', ...adminOnly, faqController.addForm);
router.post('/faqs/add', ...adminOnly, faqController.add);
router.get('/faqs/edit/:id', ...adminOnly, faqController.editForm);
router.post('/faqs/edit/:id', ...adminOnly, faqController.update);
router.post('/faqs/delete/:id', ...adminOnly, faqController.remove);

module.exports = router;
