// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var Activity = require("../../models/activity");
var Comment = require("../../models/comment");
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
    
    //not sure why it's in this format here but just req.body.captcha for registering a user
    req.body.captcha = req.body['g-recaptcha-response'];

    // CHECK CAPTCHA (only if no current user)
    if(!req.user) {
        if (!req.body.captcha) {
            req.fileValidationError = "Please select reCAPTCHA (you might also need to reselect your image)";
            return res.render("activities/newReview", activityCreateObject(req, res));
        } else {
            // secret key
            var secretKey = process.env.CAPTCHA_SECRET;
            // Verify URL
            var verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
            // Make request to Verify URL
            await request.get(verifyURL, (err, response, body) => {
                if(err){
                    req.fileValidationError = "Captcha failed, please try again";
                    return res.render("activities/newReview", activityCreateObject(req, res));
                }
                // if not successful
                if (body.success !== undefined && !body.success) {
                    req.fileValidationError = "Captcha failed, please try again";
                    return res.render("activities/newReview", activityCreateObject(req, res));
                }
            });
        }
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
    
    // GEOCODE Location
    //generate geocode data, use "await" to make sure it completes before creating activity
    await geocoder.geocode(req.body.activity.location, function (err, data) {
        if (err || !data.length) {
          req.fileValidationError = "Location is invalid, please edit to fix"; 
          return res.render("activities/newReview", activityCreateObject(req, res));
        }
        //add the geocode data to the activity object using dot notation
        req.body.activity.lat = data[0].latitude;
        req.body.activity.lng = data[0].longitude;
        req.body.activity.location = data[0].formattedAddress; //This uses the nicely formatted location that is returned by geocoder and replaces the original content 
    });
    
    
    //ADDITIONAL CHECKS
    // These should already have been passed in the UI to get to this point, but to stop people adding activities without validating data perform the checks again
    
    // CHECK FOR LENGTH OF INPUTS
    if(req.body.activity.name.length         > 100) {req.fileValidationError = "Activity Name is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.summary.length      > 300) {req.fileValidationError = "Summary is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.location.length     > 300) {req.fileValidationError = "Location is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}
    if(req.body.activity.description.length  > 2000) {req.fileValidationError = "Description is too long, please edit to fix"; return res.render("activities/newReview", activityCreateObject(req, res))}


    // SET AUTHOR
    if(req.user) {
        req.body.activity.author = req.user._id;
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
    
    // SET STATUS (could just be the default in the DB model in future, but then my seed DB script won't work so for now this is fine)
    req.body.activity.status = "review";
    
    
    
    // CREATE ACTIVITY
    //Create a new activity and save to database
    Activity.create(req.body.activity, async function(err, newlyCreatedActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            
            //find the sociable life community user and add a love and first comment
            await User.findOne({ username: process.env.COMMUNITY_USERNAME }, async function(err, communityUser) {
                if(err){
                    genericErrorResponse(req, res, err);
                } else { 
                    //add first love
                    newlyCreatedActivity.loves.push(communityUser._id);
                    
                    //if user is currently logged in the automatically add them to the love list as well
                    if(req.user) {
                        newlyCreatedActivity.loves.push(req.user._id);
                    }
                    
                    var firstComment = {};
                    firstComment.text = "Thanks for adding this activity to Sociable Life!";
                    
                    //add first comment
                    await Comment.create(firstComment, async function(err, comment){
                        if(err){
                            genericErrorResponse(req, res, err);
                        } else {
                            comment.author = communityUser._id;
                            comment.save();
                            
                            // connect new comment to the currently found activity
                            newlyCreatedActivity.comments.push(comment);
                            // save activity with new comment
                            await newlyCreatedActivity.save();
                            
                            //then redirect back to new activity page
                            req.flash("successMessage", "You activity has been created - once it's been reviewed we'll add it to the map!");
                            res.redirect("/activities/" + newlyCreatedActivity._id); //redirects to the newly created activity
                        }
                    });
                }
            });
        }
    }); 
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;