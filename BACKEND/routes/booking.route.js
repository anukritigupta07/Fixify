const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings.model");
const Provider = require("../models/utility.model");
const bookingController = require("../controllers/booking.controller");


//router.post("/booking", bookingController.createBooking);
// Optionally: get all bookings (for dashboard)
router.get("/getbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId").populate("providerId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/create", bookingController.createBooking);

router.post("/:id/action", bookingController.bookingAction);
router.put("/:id/status", bookingController.updateBookingStatus);
router.get("/provider/:providerId", bookingController.getProviderBookings);
router.get("/user/:userId", bookingController.getUserBookings);

module.exports = router;