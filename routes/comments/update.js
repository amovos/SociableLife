// ==========================
// COMMENT UPDATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Comment = require("../../models/comment");

var updateRoute = function(req, res){
    if(req.body.comment && req.body.comment.text.length > 2500) { //the counter isn't quite accurate on the browser, so add a bit of buffer into the validation
        console.log("req.body.comment.text.length: " + req.body.comment.text.length);
        //warning message is displayed with browser validation before sending here
        req.flash("errorMessage", "Comment too long (2000 characters max)");
        res.redirect("/activities/" + req.params.id);
    } else {
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
            if(err || !updatedComment){
                genericErrorResponse(req, res, err);
            } else {
                //req.flash("successMessage", "Successfully edited comment");
                res.redirect("/activities/" + req.params.id + "#comment-" + updatedComment._id); //this is the ID of the activity that comes from the first part of the request URL that's in the app.js file
            }
        });
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;