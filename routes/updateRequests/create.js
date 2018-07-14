// ============================
// UPDATE REQUEST CREATE ROUTE
// ============================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var User = require("../../models/user");
var UpdateRequest = require("../../models/updateRequest");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");

var async = require("async");

var req;
var res;

var createUpdateRequestRoute = async function(localReq, localRes){
    
    req = localReq;
    res = localRes;
    
    //server side validation for length of update request (shouldn't ever be used, but stops any problems if someone added too much data)
    if(req.body.updateRequest && req.body.updateRequest.text.length > 2500) {
        //warning message is displayed with browser validation before sending here
        req.flash("errorMessage", "Update Request too long (2000 characters max)");
        res.redirect("/activities/" + req.params.id);
    } else {

        try {
            var activity = await Activity.findById(req.params.id);
            // SET AUTHOR
            // if there is a current user then set them as the author
            if(req.user) {
                req.body.updateRequest.author = req.user._id;
            } else {
                //else set it to be the community user (do a BD search to find the ID)
                var communityUser = await User.findOne({ username: process.env.COMMUNITY_USERNAME });
                req.body.updateRequest.author = communityUser._id;
            }

            var updateRequest = await UpdateRequest.create(req.body.updateRequest);
            
            // connect new updateRequest to the currently found activity
            await activity.updateRequests.push(updateRequest);
            
            if(activity.status != "review") {
                await activity.updateHistory.push(await createUpdateHistoryLogStatusChange(activity));
            }
            
            await activity.updateHistory.push(await createUpdateHistoryLogUpdateRequest(activity));
            
            activity.status = "review";
            
            // SET UPDATED AT DATE
            activity.updatedAt = new Date().toISOString();
            
            // save activity with new updateRequest
            await activity.save();
            
            //redirect back to activity show page
            req.flash("successMessage", "Mesage sent, thank you for helping to support Sociable Life!");
            res.redirect("/activities/" + activity._id);
        } catch(err) {
            if(err) {
                genericErrorResponse(req, res, err);
            }
        }
    }
};

async function createUpdateHistoryLogUpdateRequest(activity) {
    var updateLog = {};
    
    if(req.user) {
        updateLog.author = req.user._id;
    } else {
        var communityUser = await User.findOne({ username: process.env.COMMUNITY_USERNAME });
        updateLog.author = communityUser._id;
    }
    
    updateLog.updateType = "Update Requested";
    updateLog.oldStatus = "review";
    updateLog.newStatus = "review";
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}

async function createUpdateHistoryLogStatusChange(activity) {
    //create an update history log for the status change
    //add change to activity updateHistory
    var updateLogStatusChange = {};
    
    if(req.user) {
        updateLogStatusChange.author = req.user._id;
    } else {
        var communityUser = await User.findOne({ username: process.env.COMMUNITY_USERNAME });
        updateLogStatusChange.author = communityUser._id;
    }
    
    updateLogStatusChange.updateType = "Status Changed";
    updateLogStatusChange.oldStatus = activity.status;
    updateLogStatusChange.newStatus = "review";
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLogStatusChange);
    return newUpdateLog;
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createUpdateRequestRoute;