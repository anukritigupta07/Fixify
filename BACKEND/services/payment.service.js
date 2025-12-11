const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
const Booking = require("../models/bookings.model");

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

exports.createOrder = async ({ amount, bookingId, providerId, paymentMode }) => {
  try {
    console.log("💰 Creating Razorpay Order:", { amount, bookingId, providerId, paymentMode });

    // If payment mode is cash, directly create payment and confirm booking
    if (paymentMode === "cash") {
      const payment = await Payment.create({
        bookingId,
        providerId,
        amount,
        paymentMode,
        status: "pending",
      });

      await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

      return { success: true, message: "Cash payment recorded", payment };
    }

    // Online payment (Razorpay / UPI)
    const order = await razorpayInstance.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      payment_capture: 1,
    });

    const payment = await Payment.create({
      bookingId,
      providerId,
      amount,
      paymentMode,
      status: "pending",
      razorpayOrderId: order.id,
    });

    return {
      success: true,
      message: "Order created successfully",
      order,
      payment,
      key_id: process.env.RAZORPAY_API_KEY,
    };
  } catch (err) {
    console.error("Error in createOrder:", err);
    throw new Error("Failed to create order");
  }
};


exports.verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  bookingId,
}) => {
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) return { success: false, message: "Invalid payment signature" };

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "success",
      },
      { new: true }
    );

    await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });

    return { success: true, message: "Payment verified successfully", payment };
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    return { success: false, message: "Payment verification failed" };
  }
};

// Create a fallback payment record when checkout UI fails
exports.createFallbackPayment = async ({ bookingId, providerId, amount, note }) => {
  try {
    const payment = await Payment.create({
      bookingId,
      providerId,
      amount: amount || 0,
      paymentMode: 'failed_ui',
      status: 'failed_ui',
      note: note || 'Checkout UI failed to open',
    });
    // Do NOT confirm booking here; leave it pending for manual action or retry
    return payment;
  } catch (err) {
    console.error('Error creating fallback payment:', err);
    throw err;
  }
};
