const express = require('express');
const router = express.Router();
const nearestController = require('../controllers/nearestController');

router.get('/', nearestController.page);
router.get('/api', nearestController.api);

module.exports = router;
