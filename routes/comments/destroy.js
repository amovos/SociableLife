// ==========================
// COMMENT DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Comment = require("../../models/comment");
var Activity = require("../../models/activity");

var destroyRoute = function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, async function(err){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            //once comment has been deleted remove the reference from the activity
            await Activity.findById(req.params.id, async function(err, foundActivity){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    foundActivity.comments.splice(foundActivity.comments.indexOf(req.params.comment_id), 1);
                    await foundActivity.save();
                    
                    req.flash("successMessage", "Successfully deleted comment");
                    res.redirect("/activities/" + req.params.id);
                }
            });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;