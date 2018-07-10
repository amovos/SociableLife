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
        .populate({
            path: 'updateRequests',
            model: 'UpdateRequest', //needed to specify the model for the sort to work with the multiple level nesting
            options: { sort: '-createdAt' },
            populate: { path: 'author', select: '_id displayName isMod isAdmin avatar' } //nested populate, limit the information is returned about the author
        })
        .populate({
            path: 'updateRequests',
            model: 'UpdateRequest', //needed to specify the model for the sort to work with the multiple level nesting
            options: { sort: '-createdAt' },
            populate: { path: 'isDoneUser', select: '_id displayName isMod isAdmin avatar' } //nested populate, limit the information is returned about the author
        })
        .populate({
            path: 'updateHistory',
            model: 'ActivityUpdateHistory', //needed to specify the model for the sort to work with the multiple level nesting
            options: { sort: '-updatedAt' },
            populate: { path: 'author', select: '_id displayName isMod isAdmin avatar' } //nested populate, limit the information is returned about the author
        })
        .exec(function(err, foundActivity){ //inside the returned object "foundActivity" it will now contain actual comments and not just reference ids
        
        
        
        if(err || !foundActivity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            
            //if the requesting user is in the "owner" array on the activity then send through "isOwner"
            var isOwner = false;
            if(req.user) {
                isOwner = foundActivity.owner.some(function(owner){
                    return owner.equals(req.user._id);
                });
            }

            //if the requesting user has liked this activity then pass that through to change the color of the heart text on the EJS
            var loveColorClass = "text-white";
            if(req.user){
                var isInLoveArray = foundActivity.loves.some(function (user) {
                    return user.equals(req.user._id);
                });
                if(isInLoveArray){loveColorClass = "text-dark"}
            }
            
            //if a comment doesn't have an author then remove it from the array before passing it to the page
            //this stops the page load error if a user was deleted but their comments weren't
            foundActivity.comments.forEach(function(comment){
                if(!comment.author){
                    foundActivity.comments.splice(foundActivity.comments.indexOf(comment), 1);
                }
            });
            
            var showAllUpdateRequests = false;
            if(req.query.showAllUpdateRequests === "true") {
                showAllUpdateRequests = true;
            }
            
            var pendingUpdateRequests = [];
            foundActivity.updateRequests.forEach(function(updateRequest){
                if(!updateRequest.isDone) {
                    pendingUpdateRequests.push(updateRequest);
                }
            });
            
            res.render("activities/show", { activity: foundActivity, 
                                            loveColorClass: loveColorClass, 
                                            showAllUpdateRequests: showAllUpdateRequests, 
                                            pendingUpdateRequests: pendingUpdateRequests,
                                            isOwner: isOwner
                                        });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = showRoute;