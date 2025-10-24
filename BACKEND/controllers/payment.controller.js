const paymentService = require("../services/payment.service");

exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId, providerId, paymentMode } = req.body;
    const result = await paymentService.createOrder({
      amount,
      bookingId,
      providerId,
      paymentMode,
    });
    res.status(200).json(result);
  } catch (err) {
    console.error("Payment creation error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fallback: create a payment record when checkout UI fails to open
exports.fallbackPayment = async (req, res) => {
  try {
    const { bookingId, providerId, amount, note } = req.body;
    const payment = await paymentService.createFallbackPayment({ bookingId, providerId, amount, note });
    res.status(200).json({ success: true, payment });
  } catch (err) {
    console.error('Fallback payment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
