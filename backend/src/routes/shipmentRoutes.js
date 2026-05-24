const express = require('express');
const router = express.Router();
const {
  createDeliveryRequest,
  reviewDeliveryRequest,
  getShipments,
  assignShipment,
  updateShipmentStatus,
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getShipments); // Access control handled inside controller

router.route('/request')
  .post(protect, authorize('Client'), createDeliveryRequest);

router.route('/request/:id/review')
  .put(protect, authorize('Dispatcher', 'Admin'), reviewDeliveryRequest);

router.route('/:id/assign')
  .post(protect, authorize('Dispatcher', 'Admin'), assignShipment);

router.route('/:id/status')
  .put(protect, authorize('Driver', 'Dispatcher', 'Admin'), updateShipmentStatus);

module.exports = router;
