// ============================
// UPDATE REQUEST CREATE ROUTE
// ============================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var User = require("../../models/user");
var UpdateRequest = require("../../models/updateRequest");

var createUpdateRequestRoute = function(req, res){
    
    //if user isn't logged in then require captcha?
    
    //server side validation for length of update request (shouldn't ever be used, but stops any problems if someone added too much data)
    if(req.body.updateRequest && req.body.updateRequest.text.length > 2500) {
        //warning message is displayed with browser validation before sending here
        req.flash("errorMessage", "Update Request too long (2000 characters max)");
        res.redirect("/activities/" + req.params.id);
    } else {
        //look up activity using id
        Activity.findById(req.params.id, function(err, activity){
            if(err){
                genericErrorResponse(req, res, err);
            } else { //so the activity has been found in the db
                //create new updateRequest
                UpdateRequest.create(req.body.updateRequest, async function(err, newUpdateRequest){
                    if(err){
                        genericErrorResponse(req, res, err);
                    } else {
                        // SET AUTHOR
                        // if there is a current user then set them as the author
                        if(req.user) {
                            newUpdateRequest.author = req.user._id;
                        } else {
                            //else set it to be the community user (do a BD search to find the ID)
                            await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
                                if(err){
                                    genericErrorResponse(req, res, err);
                                } else {
                                    newUpdateRequest.author = user._id;
                                }
                            });
                        }

                        // save updateRequest
                        await newUpdateRequest.save();
                        // connect new updateRequest to the currently found activity
                        await activity.updateRequests.push(newUpdateRequest);
                        
                        // set activity status to "review"
                        activity.status = "review";
                        
                        // save activity with new updateRequest
                        await activity.save();
                        //redirect back to activity show page
                        req.flash("successMessage", "Mesage sent, thank you for helping to support Sociable Life!");
                        res.redirect("/activities/" + activity._id);
                    }
                });
            }
        });
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createUpdateRequestRoute;