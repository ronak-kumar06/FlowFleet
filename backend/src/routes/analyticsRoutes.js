const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/dashboard')
  .get(protect, authorize('Dispatcher', 'Admin'), getDashboardMetrics);

module.exports = router;
