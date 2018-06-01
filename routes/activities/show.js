// ==========================
// ACTIVITY SHOW ROUTE
// ==========================

var Activity = require("../../models/activity"); //require the activity database model

var showRoute = function(req, res){
    //find the activity from the database using the id provided in the request (:id)
    Activity.findById(req.params.id)
        .populate({
            path: 'author',
            model: 'User'
        })
        .populate({
            path: 'comments',
            model: 'Comment', //needed to specify the model for the sort to work with the multiple level nesting
            options: { sort: '-createdAt' },
            populate: { path: 'author', select: '_id displayName' } //nested populate, limit the information is returned about the author
        })
        .exec(function(err, foundActivity){ //inside the returned object "foundActivity" it will now contain actual comments and not just reference ids
        
        if(err || !foundActivity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            res.render("activities/show", {activity: foundActivity}); //pass the found activity to the show template
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = showRoute;