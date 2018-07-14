// =======================================
// ACTIVITY OWNER AND AUTHOR UPDATE ROUTE
// =======================================

var genericErrorResponse = require("../shared/genericErrorResponse"); 
var Activity = require("../../models/activity"); 
var User = require("../../models/user"); 
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");

var req;
var res;

var updateActivityOwnerAndAuthorRoute = async function(localReq, localRes) {
    
    req = localReq;
    res = localRes;
    
    var errorFlag = false;
    
    await Activity.findById(req.params.id, async function(err, foundActivity){
        if(err || !foundActivity){
            genericErrorResponse(req, res, err);
        } else {
            //if new author ID has been set then check it's a valid ID then update the activity
            if(req.body.newAuthorId) {
                await User.findById(req.body.newAuthorId, function(err, foundAuthor){
                    if(err || !foundAuthor){
                        errorFlag = true;
                        req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new author");
                        res.redirect("back");
                    } else {
                        foundActivity.author = foundAuthor;
                    }
                });
            }
        
            //if a new owner/owners have been added then check the IDs are valid then add them to the activity owner array
            if(req.body.newOwnerId.length > 0 && req.body.newOwnerId[0] !== "") {
                var newOwnerValidatedArray = [];
                
                for(var i=0; i<req.body.newOwnerId.length; i++) {
                    await User.findById(req.body.newOwnerId[i], async function(err, foundOwner){
                        if(err || !foundOwner){
                            errorFlag = true;
                            req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new owner");
                            res.redirect("back");
                        } else {
                            await newOwnerValidatedArray.push(foundOwner._id);
                        }
                    });
                }
                
                //once all the owner IDs have been validated then save them to the activity
                if(!errorFlag) {
                    //need to add a check here so only unique IDs are added
                    foundActivity.owner = newOwnerValidatedArray;
                } else {
                    req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new owner");
                    res.redirect("back");
                }
            } else {
                //no owner set so clear owner
                foundActivity.owner = [];
            }
            
            if(!errorFlag){
                
                // SET UPDATED AT DATE
                foundActivity.updatedAt = new Date().toISOString();
                
                await foundActivity.updateHistory.push(await createUpdateHistoryLog(foundActivity));
                
                await foundActivity.save();
                
                // Return success message
                req.flash("successMessage", "Successfully updated activity");
                res.redirect("/activities/" + req.params.id);
            }
        }
    });
};

async function createUpdateHistoryLog(foundActivity) {
    var updateLog = {};
    updateLog.author = req.user._id;
    updateLog.updateType = "Owner/Author Changed";
    updateLog.oldStatus = foundActivity.status;
    updateLog.newStatus = foundActivity.status;
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateActivityOwnerAndAuthorRoute;