const express = require('express');
const router = express.Router();
const {
  getTrucks,
  getTruckById,
  addTruck,
  updateTruck,
  updateTruckLocation,
} = require('../controllers/truckController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Admin', 'Dispatcher'), getTrucks)
  .post(protect, authorize('Admin', 'Dispatcher'), addTruck);

router.route('/:id')
  .get(protect, authorize('Admin', 'Dispatcher', 'Driver'), getTruckById)
  .put(protect, authorize('Admin', 'Dispatcher'), updateTruck);

router.route('/:id/location')
  .put(protect, authorize('Driver'), updateTruckLocation);

module.exports = router;
