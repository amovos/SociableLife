// ==========================
// COMMENT EDIT ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var Comment = require("../../models/comment");

var editRoute = function(req, res){
    Activity.findById(req.params.id, function(err, foundActivity){
        if(err || !foundActivity){ //need to check if the activity is valid before editing the comment. As they might own the comment, but if the activity doesn't exist it will crash the server
            console.log(err);
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    dbErrorResponse(req, res, err);
                } else {
                    res.render("comments/edit", {activity_id: req.params.id, comment: foundComment}); //this is the activity id that comes from the app.js
                }
            });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editRoute;