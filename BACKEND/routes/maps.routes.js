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

  if (!lat || !lon || !isValidCoord(lat) || !isValidCoord(lon)) {
    return res.status(400).json({ message: "Latitude and Longitude required and must be valid numbers" });
  }

  try {
    const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API;
    let resultData = null;

    if (GOOGLE_MAPS_API) {
      try {
        const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API}`;
        const gResp = await axios.get(gUrl);
        if (gResp.data && gResp.data.status === "OK" && gResp.data.results.length > 0) {
          resultData = { provider: "google", raw: gResp.data };
        } else {
          console.warn("Google Geocode returned no results or non-OK status:", gResp.data && gResp.data.status);
        }
      } catch (googleErr) {
        // log google error but allow fallback
        console.error("Google Geocode error:", googleErr.response ? googleErr.response.data : googleErr.message);
      }
    }

    // fallback to Nominatim if no Google result
    if (!resultData) {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
        const nomResp = await axios.get(nomUrl, {
          headers: { "User-Agent": "FixifyApp/1.0 (+https://your-site.example)" }
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

    // normalize response into same shape your frontend expects
    if (resultData.provider === "google") {
      const best = resultData.raw.results[0];
      const comps = best.address_components || [];
      const formattedAddress = best.formatted_address || "";

      const address = {
        suburb: findComponent(comps, [['sublocality_level_1','sublocality'], ['neighborhood']]),
        neighbourhood: findComponent(comps, [['neighborhood'], ['sublocality']]),
        village: findComponent(comps, [['locality'], ['postal_town']]),
        town: findComponent(comps, [['administrative_area_level_3'], ['locality']]),
        city: findComponent(comps, [['administrative_area_level_2'], ['locality']]),
        state_district: findComponent(comps, [['administrative_area_level_2'], ['administrative_area_level_3']]),
        county: findComponent(comps, [['administrative_area_level_2'], ['administrative_area_level_3']]),
        state: findComponent(comps, [['administrative_area_level_1']]),
      };

      return res.json({
        provider: "google",
        address,
        display_name: formattedAddress,
        raw: best
      });
    } else {
      // Nominatim response shape
      const raw = resultData.raw;
      const address = raw.address || {};

      return res.json({
        provider: "nominatim",
        address: {
          suburb: address.suburb || address.hamlet || "",
          neighbourhood: address.neighbourhood || "",
          village: address.village || address.town || address.city || "",
          town: address.town || address.city || "",
          city: address.city || address.town || "",
          state_district: address.county || address.state_district || "",
          county: address.county || "",
          state: address.state || ""
        },
        display_name: raw.display_name || "",
        raw
      });
    }
  } catch (err) {
    console.error("Reverse geocode unexpected error:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
});

module.exports = router;
