// routes/maps.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// small helper to safely parse floats
const isValidCoord = (v) => {
  const n = parseFloat(v);
  return !isNaN(n) && isFinite(n);
};

// helper: check list of possible component types and return the first non-empty long_name
const findComponent = (components, typesList) => {
  if (!Array.isArray(components)) return "";
  for (const types of typesList) {
    const found = components.find(c => types.some(t => c.types.includes(t)));
    if (found && found.long_name) return found.long_name;
  }
  return "";
};

// Try Google Geocode first (if key provided), otherwise fallback to Nominatim
router.get("/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  const latNum = Number(lat);
  const lonNum = Number(lon);
  if (!isFinite(latNum) || !isFinite(lonNum)) {
    return res.status(400).json({ message: "Latitude and Longitude must be valid numbers" });
  }
  if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return res.status(422).json({ message: "Latitude or Longitude out of range" });
  }

  try {
    const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API;
    let resultData = null;

    if (GOOGLE_MAPS_API) {
      try {
        const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latNum},${lonNum}&key=${GOOGLE_MAPS_API}`;
        const gResp = await axios.get(gUrl);
        if (gResp.data && gResp.data.status === "OK" && Array.isArray(gResp.data.results) && gResp.data.results.length > 0) {
          resultData = { provider: "google", raw: gResp.data };
        } else {
          console.warn("Google Geocode returned no results or non-OK status:", gResp.data && gResp.data.status);
        }
      } catch (googleErr) {
        console.error("Google Geocode error:", googleErr.response ? googleErr.response.data : googleErr.message);
      }
    }

    // fallback to Nominatim if no Google result
    if (!resultData) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latNum}&lon=${lonNum}`;
        const nomResp = await axios.get(nomUrl, {
          headers: { "User-Agent": process.env.NOMINATIM_USER_AGENT || "FixifyApp/1.0 (+https://your-site.example)" }
        });
        if (nomResp.data) {
          resultData = { provider: "nominatim", raw: nomResp.data };
        }
      } catch (nomErr) {
        console.error("Nominatim reverse-geocode error:", nomErr.response ? nomErr.response.data : nomErr.message);
      }
    }

    if (!resultData) {
      return res.status(404).json({ message: "Location not found or geocoding services unavailable" });
    }

    // normalize response into consistent shape
    if (resultData.provider === "google") {
      const best = resultData.raw.results[0] || {};
      const comps = best.address_components || [];
      const formattedAddress = best.formatted_address || "";

      const address = {
        house_number: findComponent(comps, [['street_number']]),
        road: findComponent(comps, [['route']]),
        suburb: findComponent(comps, [['sublocality_level_1','sublocality'], ['neighborhood']]),
        neighbourhood: findComponent(comps, [['neighborhood'], ['sublocality']]),
        village: findComponent(comps, [['locality'], ['postal_town']]),
        town: findComponent(comps, [['administrative_area_level_3'], ['locality']]),
        city: findComponent(comps, [['administrative_area_level_2'], ['locality']]),
        county: findComponent(comps, [['administrative_area_level_2'], ['administrative_area_level_3']]),
        state: findComponent(comps, [['administrative_area_level_1']]),
        postcode: findComponent(comps, [['postal_code']]),
        country: findComponent(comps, [['country']])
      };

      const location = (best.geometry && best.geometry.location) || {};

      return res.json({
        provider: "google",
        latitude: Number(location.lat) || latNum,
        longitude: Number(location.lng) || lonNum,
        display_name: formattedAddress,
        address,
        raw: best
      });
    } else {
      // Nominatim response shape
      const raw = resultData.raw || {};
      const addr = raw.address || {};

      const address = {
        house_number: addr.house_number || "",
        road: addr.road || addr.pedestrian || "",
        suburb: addr.suburb || addr.hamlet || "",
        neighbourhood: addr.neighbourhood || "",
        village: addr.village || addr.town || addr.city || "",
        town: addr.town || addr.city || "",
        city: addr.city || addr.town || "",
        county: addr.county || "",
        state: addr.state || "",
        postcode: addr.postcode || "",
        country: addr.country || ""
      };

      return res.json({
        provider: "nominatim",
        latitude: Number(raw.lat) || latNum,
        longitude: Number(raw.lon) || lonNum,
        display_name: raw.display_name || "",
        address,
        raw
      });
    }
  } catch (err) {
    console.error("Reverse geocode unexpected error:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
});

module.exports = router;
