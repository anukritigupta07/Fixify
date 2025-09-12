const express  = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {getCoordinates} = require('../controllers/maps.controller')
const mapController = require('../controllers/maps.controller')
const {query} = require('express-validator')
const { body } = require('express-validator');
const axios = require('axios');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser, getCoordinates);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser, mapController.getDistanceTime);


router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser, mapController.getAutoCompleteSuggestions);



 

// Live location API
router.post(
  '/live-location',
  body('lat').isFloat().withMessage('Latitude must be a number'),
  body('lng').isFloat().withMessage('Longitude must be a number'),
  authMiddleware.authUser, 
  mapController.saveLiveLocation
);


router.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) return res.status(400).json({ message: "Latitude and Longitude required" });

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon, format: 'json' },
      headers: { 'User-Agent': 'FixifyApp/1.0 (your-email@example.com)' }, // required by Nominatim
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reverse geocoding failed' });
  }
});
module.exports = router;