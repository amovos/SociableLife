// ==========================
// GEOCODE ACTIVITY SEARCH LOCATION API ROUTE
// ==========================

var geocoder = require("../shared/geocoder");

var searchLocation = function(req, res) {
    
    geocoder.geocode(req.params.location, function (err, data) {
        if (err || !data.length) {
          //req.flash('errorMessage', 'Invalid address');
          res.send(err);
        }
        var location = {}
        location.lat = data[0].latitude;
        location.lng = data[0].longitude;
        location.formattedAddress = data[0].formattedAddress;
        return location;
    })
    .then(function(foundLocation){
        res.json(foundLocation);
    })
    .catch(function(err){
        res.send(err);
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = searchLocation;