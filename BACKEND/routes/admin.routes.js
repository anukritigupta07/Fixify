const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');

// Admin login
router.post('/login', adminController.adminLogin);

// Protected admin routes
router.get('/dashboard', adminMiddleware.authAdmin, adminController.getDashboardStats);
router.get('/users', adminMiddleware.authAdmin, adminController.getAllUsers);
router.get('/providers', adminMiddleware.authAdmin, adminController.getAllProviders);
router.get('/bookings', adminMiddleware.authAdmin, adminController.getAllBookings);

// Delete operations
router.delete('/users/:userId', adminMiddleware.authAdmin, adminController.deleteUser);
router.delete('/providers/:providerId', adminMiddleware.authAdmin, adminController.deleteProvider);

// Update booking
router.put('/bookings/:bookingId', adminMiddleware.authAdmin, adminController.updateBookingStatus);

module.exports = router;