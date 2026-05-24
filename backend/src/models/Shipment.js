const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryRequest', required: true },
  priority: { type: String, enum: ['Unassigned', 'Low', 'Medium', 'High', 'Critical'], default: 'Unassigned' },
  status: { 
    type: String, 
    enum: ['Assigned', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'], 
    default: 'Assigned' 
  },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispatchedAt: { type: Date },
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: { type: Date },
  notes: { type: String }
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
