const Shipment = require('../models/Shipment');
const DeliveryRequest = require('../models/DeliveryRequest');
const { getIO } = require('../sockets/socket');

// @desc    Create a delivery request
// @route   POST /api/shipments/request
// @access  Private (Client)
const createDeliveryRequest = async (req, res) => {
  const { origin, destination, weight } = req.body;

  try {
    const request = new DeliveryRequest({
      clientId: req.user._id,
      origin,
      destination,
      weight,
    });

    const createdRequest = await request.save();
    
    // Notify dispatchers
    getIO().emit('newRequest', createdRequest);
    
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve/Reject a request and set priority
// @route   PUT /api/shipments/request/:id/review
// @access  Private (Dispatcher)
const reviewDeliveryRequest = async (req, res) => {
  const { status, priority } = req.body; // status: 'Approved' or 'Rejected'

  try {
    const request = await DeliveryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    if (status === 'Approved') {
      // Create actual Shipment
      const shipment = new Shipment({
        trackingId: `TRK-${Date.now()}`,
        requestId: request._id,
        priority: priority || 'Unassigned',
      });
      const createdShipment = await shipment.save();
      
      getIO().emit('shipmentUpdated', createdShipment);
      return res.json({ request, shipment: createdShipment });
    }

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all delivery requests
// @route   GET /api/shipments/request
// @access  Private (Dispatcher, Admin)
const getAllDeliveryRequests = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find().populate('clientId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get shipments (and requests)
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
  try {
    if (req.user.role === 'Admin' || req.user.role === 'Dispatcher') {
      const shipments = await Shipment.find({}).populate('requestId').populate('assignedTruck').populate('assignedDriver', 'name email');
      res.json(shipments);
    } else if (req.user.role === 'Driver') {
      const shipments = await Shipment.find({ assignedDriver: req.user._id }).populate('requestId');
      res.json(shipments);
    } else if (req.user.role === 'Client') {
      // Find requests for this client
      const requests = await DeliveryRequest.find({ clientId: req.user._id });
      const requestIds = requests.map(r => r._id);
      const shipments = await Shipment.find({ requestId: { $in: requestIds } }).populate('requestId');
      // Return both pending requests and active shipments
      res.json({ requests, shipments });
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Assign truck and driver
// @route   POST /api/shipments/:id/assign
// @access  Private (Dispatcher)
const assignShipment = async (req, res) => {
  const { truckId, driverId } = req.body;

  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    shipment.assignedTruck = truckId;
    shipment.assignedDriver = driverId;
    shipment.status = 'Assigned';
    shipment.dispatchedAt = Date.now();

    const updatedShipment = await shipment.save();
    
    // Notify driver
    getIO().emit('truckAssigned', updatedShipment);

    res.json(updatedShipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update shipment status
// @route   PUT /api/shipments/:id/status
// @access  Private (Driver)
const updateShipmentStatus = async (req, res) => {
  const { status, notes } = req.body;

  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Verify driver is assigned to this shipment
    if (shipment.assignedDriver.toString() !== req.user._id.toString() && req.user.role !== 'Dispatcher' && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this shipment' });
    }

    shipment.status = status;
    if (notes) shipment.notes = notes;
    
    if (status === 'Delivered') {
      shipment.actualDeliveryTime = Date.now();
    }

    const updatedShipment = await shipment.save();
    
    getIO().emit('shipmentUpdated', updatedShipment);

    res.json(updatedShipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createDeliveryRequest,
  getAllDeliveryRequests,
  reviewDeliveryRequest,
  getShipments,
  assignShipment,
  updateShipmentStatus,
};
