const feedbackModel = require("../models/feedback.model");
const bookingModel = require("../models/bookings.model");

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user._id;

    const booking = await bookingModel.findById(bookingId).populate("providerId");
    if (!booking || booking.status !== "completed") {
      return res.status(400).json({ message: "Invalid booking or not completed" });
    }

    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Allow multiple feedback submissions - removed restriction

    const feedback = new feedbackModel({
      userId,
      providerId: booking.providerId._id,
      bookingId,
      rating,
      comment,
      serviceCategory: booking.category
    });

    await feedback.save();
    console.log('Feedback saved successfully:', feedback._id);
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all feedback (for admin)
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.find()
      .populate("userId", "fullname email")
      .populate("providerId", "fullname profession")
      .populate("bookingId", "category details")
      .sort({ createdAt: -1 });

    console.log('Feedback found:', feedback.length);
    res.json({ feedback });
  } catch (error) {
    console.error('Error in getAllFeedback:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};