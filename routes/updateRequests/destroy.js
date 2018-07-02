// ============================
// UPDATE REQUEST DESTROY ROUTE
// ============================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var UpdateRequest = require("../../models/updateRequest");
var Activity = require("../../models/activity");

var destroyUpdateRequestRoute = function(req, res){
    UpdateRequest.findByIdAndRemove(req.params.updateRequest_id, async function(err){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            //once updateRequest has been deleted remove the reference from the activity
            await Activity.findById(req.params.id, async function(err, foundActivity){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    foundActivity.updateRequests.splice(foundActivity.updateRequests.indexOf(req.params.updateRequest_id), 1);
                    await foundActivity.save();
                    
                    req.flash("successMessage", "Successfully deleted update request");
                    res.redirect("/activities/" + req.params.id);
                }
            });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyUpdateRequestRoute;