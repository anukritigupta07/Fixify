const mapService = require('../services/maps.service')
const {validationResult} = require('express-validator')

module.exports.getCoordinates = async (req, res, next) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {address} = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.log(error)
      res.status(404).json({ error: 'Coordinates not found' });
    }
}
module.exports.getDistanceTime = async (req, res, next) => {
  try { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;
  
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: 'Distance and time not found' });
    }
};

module.exports.getAutoCompleteSuggestions = async(req, res, next) => {
    try{
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
       }

       const { input } = req.query;
       const suggestions = await mapService.getAutoCompleteSuggestions(input);
       res.status(200).json(suggestions);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: 'Autocomplete suggestions not found' });
    }
}
module.exports.saveLiveLocation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // later you can store in DB, for now just return it
    return res.status(200).json({
      message: "Live location received successfully",
      coordinates: { lat, lng }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error saving live location" });
  }
};
