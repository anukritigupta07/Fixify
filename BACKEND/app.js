 const dotenv = require('dotenv');
 dotenv.config();
 const express  = require('express');
 const cors = require('cors')
const connecToDb = require('./db/db'); // Make sure C:\FIXIFY\BACKEND\db\db.js exists, or update the path accordingly
const app = express();
const cookieParser = require('cookie-parser')
const userRoutes =  require('./routes/user.routes');
const utilityRoutes = require('./routes/utility.route');
const mapsRoutes = require('./routes/maps.routes')
const bookingRoutes = require("./routes/booking.route");

connecToDb();
app.use(express.static('public'));
app.use(cors({
  origin: ['https://fixify-1-vn2l.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/' , (req, res) => {
    res.send('Welcome to FIXIFY')
})
app.use('/users' , userRoutes)
app.use('/utilities', utilityRoutes);
app.use('/maps', mapsRoutes);
app.use("/bookings", bookingRoutes);

// Serve static files from Frontend dist
const path = require('path');
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

module.exports = app;