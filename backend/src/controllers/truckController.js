const Truck = require('../models/Truck');

// @desc    Get all trucks
// @route   GET /api/trucks
// @access  Private (Admin, Dispatcher)
const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({});
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get truck by ID
// @route   GET /api/trucks/:id
// @access  Private
const getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (truck) {
      res.json(truck);
    } else {
      res.status(404).json({ message: 'Truck not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new truck
// @route   POST /api/trucks
// @access  Private (Admin, Dispatcher)
const addTruck = async (req, res) => {
  const { registrationNumber, capacity, fuelEfficiency } = req.body;

  try {
    const truckExists = await Truck.findOne({ registrationNumber });

    if (truckExists) {
      return res.status(400).json({ message: 'Truck already exists' });
    }

    const truck = new Truck({
      registrationNumber,
      capacity,
      fuelEfficiency,
    });

    const createdTruck = await truck.save();
    res.status(201).json(createdTruck);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update truck
// @route   PUT /api/trucks/:id
// @access  Private (Admin, Dispatcher)
const updateTruck = async (req, res) => {
  const { capacity, fuelEfficiency, status } = req.body;

  try {
    const truck = await Truck.findById(req.params.id);

    if (truck) {
      truck.capacity = capacity || truck.capacity;
      truck.fuelEfficiency = fuelEfficiency || truck.fuelEfficiency;
      truck.status = status || truck.status;

      const updatedTruck = await truck.save();
      res.json(updatedTruck);
    } else {
      res.status(404).json({ message: 'Truck not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update truck location
// @route   PUT /api/trucks/:id/location
// @access  Private (Driver)
const updateTruckLocation = async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const truck = await Truck.findById(req.params.id);

    if (truck) {
      truck.currentLocation = {
        lat,
        lng,
        updatedAt: Date.now(),
      };

      const updatedTruck = await truck.save();
      
      // Emit socket event for real-time tracking
      const { getIO } = require('../sockets/socket');
      getIO().emit('locationChanged', { truckId: truck._id, location: truck.currentLocation });

      res.json(updatedTruck);
    } else {
      res.status(404).json({ message: 'Truck not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTrucks,
  getTruckById,
  addTruck,
  updateTruck,
  updateTruckLocation,
};
