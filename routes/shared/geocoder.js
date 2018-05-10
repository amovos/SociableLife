// ==========================
// GEOCODER - GOOGLE MAPS
// ==========================

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = geocoder;