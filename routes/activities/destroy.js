// ==========================
// ACTIVITY DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var destroyRoute = function(req, res){
    // FOR NOW I DON'T WANT AN ACTIVITY TO BE DELETED ACCIDENTALLY
    
    // Activity.findById(req.params.id, async function(err, activity) {
    //     if(err){
    //         req.flash("errorMessage", "Activity not found");
    //         res.redirect("/activities");
    //     }
    //     try {
    //         // set cloudinary config from shared file
    //         cloudinary.config(cloudinaryConf);
            
    //         // delete activity image if it exists
    //         if(activity.imageId){
    //             await cloudinary.v2.uploader.destroy(activity.imageId);
    //         }
            
    //         // DELETE ACTIVITY
    //         activity.remove();
            
    //         req.flash('successMessage', 'Activity deleted successfully!');
    //         res.redirect('/activities');
    //     } catch(err) {
    //         if(err) {
    //             genericErrorResponse(req, res, err);
    //         }
    //     }
    // });
    
    res.redirect("/activities");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;