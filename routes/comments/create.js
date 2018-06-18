// ==========================
// COMMENT CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var Comment = require("../../models/comment");

var createRoute = function(req, res){
    if(req.body.comment && req.body.comment.text.length > 2500) { //the counter isn't quite accurate on the browser, so add a bit of buffer into the validation
        console.log("req.body.comment.text.length: " + req.body.comment.text.length);
        //warning message is displayed with browser validation before sending here
        req.flash("errorMessage", "Comment too long (2000 characters max)");
        res.redirect("/activities/" + req.params.id);
    } else {
        //look up activity using id
        Activity.findById(req.params.id, function(err, activity){
            if(err){
                genericErrorResponse(req, res, err);
            } else { //so the activity has been found in the db
                //create new comment
                Comment.create(req.body.comment, function(err, comment){
                    if(err){
                        genericErrorResponse(req, res, err);
                    } else {
                        // add username and id to comment
                        comment.author = req.user._id;
                        // save comment
                        comment.save();
                        
                        // connect new comment to the currently found activity
                        activity.comments.push(comment);
                        // save activity with new comment
                        activity.save();
                        //redirect back to activity show page
                        req.flash("successMessage", "Successfully added comment");
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
module.exports = createRoute;