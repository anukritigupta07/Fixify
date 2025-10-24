const express = require("express");
const router = express.Router();
const axios = require("axios");

// ✅ Reverse geocode (Public, no auth)
router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and Longitude required" });
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon, format: "json", addressdetails: 1 },
      headers: { "User-Agent": "FixifyApp/1.0 (fixify@example.com)" },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocode error:", err.message);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
});

module.exports = router;
