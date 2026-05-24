const Shipment = require('../models/Shipment');
const Truck = require('../models/Truck');
const DeliveryRequest = require('../models/DeliveryRequest');

// @desc    Get dashboard metrics
// @route   GET /api/analytics/dashboard
// @access  Private (Dispatcher, Admin)
const getDashboardMetrics = async (req, res) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const totalTrucks = await Truck.countDocuments();
    const activeTrucks = await Truck.countDocuments({ status: 'In Transit' });
    const delayedShipments = await Shipment.countDocuments({ status: 'Delayed' });
    const pendingRequests = await DeliveryRequest.countDocuments({ status: 'Pending' });

    res.json({
      totalShipments,
      totalTrucks,
      activeTrucks,
      delayedShipments,
      pendingRequests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardMetrics,
};
