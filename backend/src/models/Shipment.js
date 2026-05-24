const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  origin: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  destination: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  weight: { type: Number, required: true }, // in tons
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Allocated', 'In Transit', 'Delivered', 'Delayed'], default: 'Pending' },
  truckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  dispatchedAt: { type: Date },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  notes: { type: String }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
