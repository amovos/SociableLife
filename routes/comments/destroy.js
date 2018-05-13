// ==========================
// COMMENT DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Comment = require("../../models/comment");

var destroyRoute = function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully deleted comment");
            res.redirect("/activities/" + req.params.id);
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;