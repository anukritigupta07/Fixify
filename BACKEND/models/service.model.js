// models/service.model.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['plumber', 'electrician', 'technician', 'carpenter', 'painter', 'mechanic'],
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 }, 
  location: {
    type: String,
    default: 'Available Citywide'
  },
  image: { type: String, required: true },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'utility', // <-- must match mongoose.model name for utilities
    required: true,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
