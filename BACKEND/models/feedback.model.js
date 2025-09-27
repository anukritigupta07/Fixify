const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "utility",
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  serviceCategory: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("feedback", feedbackSchema);