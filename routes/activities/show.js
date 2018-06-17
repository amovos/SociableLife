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
            populate: { path: 'author', select: '_id displayName isMod isAdmin avatar' } //nested populate, limit the information is returned about the author
        })
        .exec(function(err, foundActivity){ //inside the returned object "foundActivity" it will now contain actual comments and not just reference ids
        
        if(err || !foundActivity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            
            //if the requesting user has liked this activity then pass that through to change the color of the heart text on the EJS
            var loveColorClass = "text-white";
            if(req.user){
                var isInLoveArray = foundActivity.loves.some(function (user) {
                    return user.equals(req.user._id);
                });
                if(isInLoveArray){loveColorClass = "text-dark"}
            }
            
            res.render("activities/show", {activity: foundActivity, loveColorClass: loveColorClass}); //pass the found activity to the show template
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = showRoute;