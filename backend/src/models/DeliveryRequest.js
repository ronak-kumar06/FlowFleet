const mongoose = require('mongoose');

const deliveryRequestSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const DeliveryRequest = mongoose.model('DeliveryRequest', deliveryRequestSchema);
module.exports = DeliveryRequest;
