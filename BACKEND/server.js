const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const utilityModel = require("./models/utility.model");
const bookingModel = require("./models/bookings.model");

// ----------------- MIDDLEWARE -----------------
app.use(express.json());

// Enable CORS
const cors = require("cors");
app.use(cors({ origin: "*" }));

// ----------------- SOCKET.IO -----------------
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const connectedProviders = {};
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("registerProvider", async (providerId) => {
    connectedProviders[providerId] = socket.id;
    await utilityModel.findByIdAndUpdate(providerId, {
      socketId: socket.id,
      status: "active",
    });
    console.log(`✅ Provider ${providerId} registered`);
  });

  socket.on("registerUser", async (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`👤 User ${userId} registered`);
  });

  socket.on("disconnect", async () => {
    const providerId = Object.keys(connectedProviders).find(
      (key) => connectedProviders[key] === socket.id
    );
    if (providerId) {
      delete connectedProviders[providerId];
      await utilityModel.findByIdAndUpdate(providerId, {
        status: "inactive",
        socketId: null,
      });
      console.log(`❌ Provider ${providerId} disconnected`);
    }

    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) {
      delete connectedUsers[userId];
      console.log(`❌ User ${userId} disconnected`);
    }
  });
});

// ----------------- ROUTES -----------------

// Create a booking
app.post("/book-service", async (req, res) => {
  try {
    const { userId, category, details } = req.body;

    const provider = await utilityModel.findOne({
      profession: category,
      status: "active",
    });

    if (!provider) {
      return res.status(404).json({ message: "No active provider available" });
    }

    const booking = new bookingModel({
      userId,
      providerId: provider._id,
      category,
      details,
      status: "pending",
    });
    await booking.save();

    if (connectedProviders[provider._id]) {
      io.to(connectedProviders[provider._id]).emit("newBooking", booking);
    }

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept / Reject Booking
app.post("/booking/:id/action", async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await bookingModel.findById(id).populate(
      "userId providerId"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (action === "accept") booking.status = "accepted";
    else if (action === "reject") booking.status = "rejected";
    else return res.status(400).json({ message: "Invalid action" });

    await booking.save();

    if (connectedUsers[booking.userId._id]) {
      io.to(connectedUsers[booking.userId._id]).emit("bookingUpdate", {
        bookingId: booking._id,
        status: booking.status,
      });
    }

    res.json({ message: `Booking ${booking.status}`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Provider Bookings
app.get("/provider/:id/bookings", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid provider ID" });
    }

    const bookings = await bookingModel
      .find({ providerId: id })
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fallback 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------- START SERVER -----------------
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
});
