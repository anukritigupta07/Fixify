const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

// Create Razorpay Order or Cash payment record
router.post("/order", paymentController.createOrder);

// Verify Razorpay Payment
router.post("/verify", paymentController.verifyPayment);

// Fallback when checkout UI fails to open in client
router.post('/fallback', paymentController.fallbackPayment);

module.exports = router;
