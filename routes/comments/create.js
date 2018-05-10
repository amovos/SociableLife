// ==========================
// COMMENT CREATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var Comment = require("../../models/comment");

var createRoute = function(req, res){
    //look up activity using id
    Activity.findById(req.params.id, function(err, activity){
        if(err){
            dbErrorResponse(req, res, err);
        } else { //so the activity has been found in the db
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    dbErrorResponse(req, res, err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    
                    // connect new comment to the currently found activity
                    activity.comments.push(comment);
                    // save activity with new comment
                    activity.save();
                    //redirect back to activity show page
                    console.log(comment);
                    req.flash("successMessage", "Successfully added comment");
                    res.redirect("/activities/" + activity._id);
                }
            });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;