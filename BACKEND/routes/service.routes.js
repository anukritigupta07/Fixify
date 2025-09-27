const express = require('express');
const router = express.Router();
const Service = require('../models/service.model');

// Get all services (public route)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;