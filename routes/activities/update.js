// ==========================
// ACTIVITY UPDATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var geocoder = require("../shared/geocoder");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var updateRoute = function(req, res){
    
    //find campground to see what needs updating 
    Activity.findById(req.params.id, async function(err, activity){
        if(err){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            // CLOUDINARY
            // Check if a new image has been uploaded
            if (req.file) {
                try {
                    // set cloudinary config from shared file
                    cloudinary.config(cloudinaryConf);

                    // delete previous image (if one existed) then upload the new one
                    if(activity.imageId){
                        await cloudinary.v2.uploader.destroy(activity.imageId);
                    }
                    // set image location to correct folder on Cloudinary
                    var public_id = "sl-" + process.env.ENV_ID + "/activities/" + req.file.filename;
                    
                    // upload image
                    var result = await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id});
                    
                    // store the URL of the new image in the req.body.activity to be saved at the end of this route
                    activity.image = result.secure_url;
                    activity.imageId = result.public_id;
                    
                } catch(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            
            // GEOCODER 
            // check if location info has changed otherwise don't re-geocode and charge for it
            if(req.body.activity.location !== activity.location){
                await geocoder.geocode(req.body.activity.location, function (err, data) {
                        if (err || !data.length) {
                        req.flash('errorMessage', 'Invalid address');
                        return res.redirect('back');
                    }
                    //overwrite existing location values with new geocoded values
                    activity.lat = data[0].latitude;
                    activity.lng = data[0].longitude;
                    activity.location = data[0].formattedAddress;
                });
            }
        }
        
        // Update any additional fields
        activity.name = req.body.activity.name;
        activity.description = req.body.activity.description;
        activity.price = req.body.activity.price;
        
        // UPDATE ACTIVITY IN DATABASE
        activity.save();
        
        // Return success message
        req.flash("successMessage", "Successfully updated activity");
        res.redirect("/activities/" + req.params.id);
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;