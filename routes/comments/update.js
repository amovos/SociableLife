// ==========================
// COMMENT UPDATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Comment = require("../../models/comment");

var updateRoute = function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            dbErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully updated comment");
            res.redirect("/activities/" + req.params.id); //this is the ID of the activity that comes from the first part of the request URL that's in the app.js file
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;