// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var Activity = require("../../models/activity"); //require the activity database model
var geocoder = require("../shared/geocoder");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var createRoute = async function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    //if an image has been added on create then upload it to Cloudinary
    if(req.file){
        // CLOUDINARY
        cloudinary.config(cloudinaryConf);
    
        // set image location to correct folder on Cloudinary
        var public_id = "sl-" + process.env.ENV_ID + "/activities/" + req.file.filename;
        
        // Upload the image to Cloudinary and wait for a response
        await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, function(err, result) {
            if(err) {
                req.flash('errorMessage', err.message);
                return res.redirect('back');
            }
            // add cloudinary url for the image to the activity object under image property
            req.body.activity.image = result.secure_url;
            // add image's public_id to activity object
            req.body.activity.imageId = result.public_id;
        });
    }
    
    
    // GEOCODE Location
    //generate geocode data, use "await" to make sure it completes before creating activity
    await geocoder.geocode(req.body.activity.location, function (err, data) {
        if (err || !data.length) {
          req.flash('errorMessage', 'Invalid address');
          return res.redirect('back');
        }
        //add the geocode data to the activity object using dot notation
        req.body.activity.lat = data[0].latitude;
        req.body.activity.lng = data[0].longitude;
        req.body.activity.location = data[0].formattedAddress; //This uses the nicely formatted location that is returned by geocoder and replaces the original content 
    });
    
    
    // AUTHOR
    //store the author details from the request in the variable "author"
    var author = {
        id: req.user.id,
        username: req.user.username
    };
    //add the author to the activity object using dot notation
    req.body.activity.author = author;
    
    
    // CREATE ACTIVITY
    //Create a new activity and save to database
    Activity.create(req.body.activity, function(err, newlyCreated){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            //redirect back to activities page
            req.flash("successMessage", "Successfully created activity - once it's been reviewed we'll add it to the map!");
            res.redirect("/activities/" + newlyCreated._id); //redirects to the newly created activity
        }
    }); 
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;