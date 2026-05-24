const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true }, // Weight in tons
  fuelEfficiency: { type: Number }, // km/liter
  status: { type: String, enum: ['Available', 'In Transit', 'Maintenance'], default: 'Available' },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  },
  lastMaintenanceDate: { type: Date }
});

const Truck = mongoose.model('Truck', truckSchema);
module.exports = Truck;
