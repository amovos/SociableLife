// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var geocoder = require("../shared/geocoder");

var createRoute = function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    // AUTHOR
    //store the author details from the request in the variable "author"
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    //add the author to the newActivity object using dot notation
    req.body.newActivity.author = author;
    
    // GEOCODE
    //generate geocode data (then only create once the geocoder is finished)
    geocoder.geocode(req.body.newActivity.location, function (err, data) {
        if (err || !data.length) {
          req.flash('errorMessage', 'Invalid address');
          return res.redirect('back');
        }
        //add the geocode data to the newActivity object using dot notation
        req.body.newActivity.lat = data[0].latitude;
        req.body.newActivity.lng = data[0].longitude;
        req.body.newActivity.location = data[0].formattedAddress; //This uses the nicely formatted location that is returned by geocoder and replaces the original content 

        //Create a new activity and save to database
        //Could move outside of the GEOCODE so it's not dependent on an external service
        //This would also mean you could do some form validation and save most of the data, but then wait to see if the geocoding works
        Activity.create(req.body.newActivity, function(err, newlyCreated){
            if(err){
                dbErrorResponse(req, res, err);
            } else {
                //redirect back to activities page
                req.flash("successMessage", "Successfully added activity");
                res.redirect("/activities/" + newlyCreated._id); //redirects to the newly created activity
            }
        });        
    });
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;