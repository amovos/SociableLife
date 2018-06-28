// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var Activity = require("../../models/activity"); //require the activity database model
var geocoder = require("../shared/geocoder");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var createRoute = async function(req, res){ //REST convention to use the same route name but as a post to submit 

    console.log("HERE");
    
    //To Do:
    // Validate inputs
    // geocode location
    // set author to community user ID
    // if all pass then send data to review page (maybe by simply submitting the form to it? As it doesn't need to be ajax)
    
    res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> ERROR!"});

    // GEOCODE Location
    // generate geocode data, use "await" to make sure it completes before creating activity
    // await geocoder.geocode(req.body.activity.location, function (err, data) {
    //     if (err || !data.length) {
    //       req.flash('errorMessage', 'Invalid address');
    //       return res.redirect('back');
    //     }
    //     //add the geocode data to the activity object using dot notation
    //     req.body.activity.lat = data[0].latitude;
    //     req.body.activity.lng = data[0].longitude;
    //     req.body.activity.location = data[0].formattedAddress; //This uses the nicely formatted location that is returned by geocoder and replaces the original content 
    // });
    
    
    // AUTHOR
    //if(req.user) {
    //req.body.activity.author = req.user._id;
    // } else {
    // set it to be the community user (do a BD search to find the ID)
    //}
    
    
    
    //Don't actually create the activity yet, just run all the checks
    
    // CREATE ACTIVITY
    //Create a new activity and save to database
    // Activity.create(req.body.activity, function(err, newlyCreated){
    //     if(err){
    //         genericErrorResponse(req, res, err);
    //     } else {
    //         //redirect back to activities page
    //         req.flash("successMessage", "Successfully created activity - once it's been reviewed we'll add it to the map!");
    //         res.redirect("/activities/" + newlyCreated._id); //redirects to the newly created activity
    //     }
    // }); 
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;