const axios = require('axios');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API || process.env.GOGGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const results = response.data.results;
        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error('No coordinates found for the given address.');
        }
    } catch (error) {
        throw new Error('Error fetching coordinates: ' + error.message);
    
    
    }}

    module.exports.getDistanceTime = async (origin, destination) => {
        if(!origin || !destination){
            throw new Error
        }
        const apiKey = process.env.GOOGLE_MAPS_API || process.env.GOGGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
           if(response.data.status == 'OK'){
            if(response.data.rows[0].elements[0].status == 'ZERO_RESULTS'){
               throw new Error('No route found');
            }
            return response.data.rows[0].elements[0];
       } else {
         throw new Error('Error fetching distance and time');
       }

    } catch(err){
        console.error('Error fetching distance and time:', err);
        throw  err;
    }}

    module.exports.getAutoCompleteSuggestions = async (input) => {
        if(!input){
            throw new Error('Input is required');
        }
        const apiKey = process.env.GOOGLE_MAPS_API || process.env.GOGGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                return response.data.predictions;
            } else {
                throw new Error('Error fetching autocomplete suggestions');
            }
        } catch (error) {
            throw new Error('Error fetching autocomplete suggestions: ' + error.message);
        }
    }