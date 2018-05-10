// ==========================
// ACTIVITY UPDATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var geocoder = require("../shared/geocoder");

var updateRoute = function(req, res){
    // GEOCODER 
    // check if location info has changed otherwise don't re-geocode and charge for it
    geocoder.geocode(req.body.Activity.location, function (err, data) {
            if (err || !data.length) {
            req.flash('errorMessage', 'Invalid address');
            return res.redirect('back');
        }
        //overwrite existing location values with new geocoded values
        req.body.Activity.lat = data[0].latitude;
        req.body.Activity.lng = data[0].longitude;
        req.body.Activity.location = data[0].formattedAddress;
       
        //find and update the correct activity
        Activity.findByIdAndUpdate(req.params.id, req.body.Activity, function(err, updatedActivity){
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                req.flash("successMessage", "Successfully updated activity");
                res.redirect("/activities/" + req.params.id);
            }
        });
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;