const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const utilityModel = require("./models/utility.model"); // provider schema
const bookingModel = require("./models/bookings.model"); // booking schema

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: { origin: "*" },
});


// 👀 Keep track of connected users and providers
const connectedProviders = {};
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  // ✅ Provider register karega
  socket.on("registerProvider", async (providerId) => {
    connectedProviders[providerId] = socket.id;

    await utilityModel.findByIdAndUpdate(providerId, {
      socketId: socket.id,
      status: "active",
    });

    console.log(`✅ Provider ${providerId} registered with socket ${socket.id}`);
  });



  // ✅ User register karega
  socket.on("registerUser", async (userId) => {
    connectedUsers[userId] = socket.id;

    // Agar user ka schema me socketId hai to update karna
    // (optional – depends on your user schema)
    // await userModel.findByIdAndUpdate(userId, { socketId: socket.id });

    console.log(`👤 User ${userId} registered with socket ${socket.id}`);
  });

  // ✅ Disconnect handling
  socket.on("disconnect", async () => {
    // Provider disconnect check
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

    // User disconnect check
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) {
      delete connectedUsers[userId];
      console.log(`❌ User ${userId} disconnected`);
    }
  });
});




// ✅ Start server
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Server running at ${port}`);
});
