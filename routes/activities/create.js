// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var Activity = require("../../models/activity");
var User = require("../../models/user");
var geocoder = require("../shared/geocoder");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");
var request = require("request");

var activityCreateObject = require("./activityCreateObject");

var createRoute = async function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    //if multer error - display here
    if(req.fileValidationError) {
        return res.render("activities/newReview", activityCreateObject(req, res));
    }
    
    //while testing
    return;
    
    // CHECK CAPTCHA
    if (!req.body.captcha) {
        req.fileValidationError = "<i class='fas fa-exclamation-triangle'></i> Please select reCAPTCHA";
        return res.render("activities/newReview", activityCreateObject(req, res));
    } else {
        // secret key
        var secretKey = process.env.CAPTCHA_SECRET;
        // Verify URL
        var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
        // Make request to Verify URL
        await request.get(verifyURL, (err, response, body) => {
            if(err){
                req.fileValidationError = "<i class='fas fa-exclamation-triangle'></i> Captcha failed, please try again";
                return res.render("activities/newReview", activityCreateObject(req, res));
            }
            // if not successful
            if (body.success !== undefined && !body.success) {
                req.fileValidationError = "<i class='fas fa-exclamation-triangle'></i> Captcha failed, please try again";
                return res.render("activities/newReview", activityCreateObject(req, res));
            }
        });
    }
    
    
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
    
    console.log("BEFORE GEOCODE");
    
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
    
    
    console.log("BEFORE SET AUTHOR");
    
    // SET AUTHOR
    if(req.user) {
        req.body.author = req.user._id;
    } else {
        //set it to be the community user (do a BD search to find the ID)
        await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
            if(err){
                genericErrorResponse(req, res, err);
            } else {
                req.body.activity.author = user._id;
            }
        });
    }
    
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