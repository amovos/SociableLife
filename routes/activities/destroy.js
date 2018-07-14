// ==========================
// ACTIVITY DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");
var Comment = require("../../models/comment");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var UpdateRequest = require("../../models/updateRequest");

var destroyRoute = function(req, res){
    Activity.findById(req.params.id, async function(err, activity) {
        if(err || !activity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        }
        try {
            // set cloudinary config from shared file
            cloudinary.config(cloudinaryConf);
            
            // delete activity image if it exists
            if(activity.imageId){
                await cloudinary.v2.uploader.destroy(activity.imageId);
            }
            
            //delete all comments
            //for each comment in comments array, remove it.
            await activity.comments.forEach(async function(comment) {
                await Comment.findById(comment, async function(err, foundComment) {
                    if(err || !foundComment){
                        genericErrorResponse(req, res, err);
                    } else {
                        await foundComment.remove();
                    }
                });
            });
            
            //delete all update requests
            await activity.updateRequests.forEach(async function(updateRequest) {
                await UpdateRequest.findById(updateRequest, async function(err, foundUpdateRequest) {
                    if(err || !foundUpdateRequest){
                        genericErrorResponse(req, res, err);
                    } else {
                        await foundUpdateRequest.remove();
                    }
                });
            });
            
            //delete all update history logs
            await activity.updateHistory.forEach(async function(updateHistory) {
                await ActivityUpdateHistory.findById(updateHistory, async function(err, foundUpdateHistory) {
                    if(err || !foundUpdateHistory){
                        genericErrorResponse(req, res, err);
                    } else {
                        await foundUpdateHistory.remove();
                    }
                });
            });
            
            // DELETE ACTIVITY
            await activity.remove();
            
        } catch(err) {
            if(err) {
                genericErrorResponse(req, res, err);
            }
        }
    });
    
    req.flash('successMessage', 'Activity deleted successfully!');
    res.redirect('/activities');
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;