// controllers/service.controller.js
const Service = require('../models/service.model');

exports.getAllServices = async (req, res) => {
  try {
    // remove isActive filter if your data doesn't have it
    const services = await Service.find({})
      .populate({ path: 'providerId', select: 'fullname email contact profession', options: { lean: true } })
      .sort({ createdAt: -1 });

    res.status(200).json({ services });
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// ➕ Create new service (only providers)
exports.createService = async (req, res) => {
  try {
    const { name, category, description, price, image, providerId } = req.body;

    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price,
      image,
      providerId,
    });

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔍 Get all services by provider
exports.getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const services = await Service.find({ providerId }).sort({ createdAt: -1 });
    res.status(200).json({ services });
  } catch (error) {
    console.error('❌ Error fetching provider services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
