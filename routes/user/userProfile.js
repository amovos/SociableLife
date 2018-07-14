// ==========================
// USER PROFILE ROUTE
// ==========================

var User = require("../../models/user");
var Comment = require("../../models/comment");
var Activity = require("../../models/activity");

var userProfileRoute = async function(req, res){
    
    await User.findById(req.params.id, async function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            return res.redirect('/activities');
        } else {
            try {
                var authorActivities = await Activity.find().where('author').equals(foundUser._id);
                var ownerActivities = await Activity.find({ 'owner' : foundUser._id });
                
                //just pass through the owner and author IDs to add to the page
                var authorActivityIds = [];
                var ownerActivityIds = "";
                
                authorActivities.forEach(function(activity) {
                    authorActivityIds.push(activity._id);
                });
                ownerActivities.forEach(function(activity) {
                    var activityIdString = activity._id.toString();
                    ownerActivityIds += activityIdString; //not a good way to do it but I don't understand why it didn't work the same as for the author
                });
                
                var allActivities = authorActivities;
                
                ownerActivities.forEach(function(activity) {
                    var isInArray = allActivities.some(function(allActivity){
                        return allActivity.equals(activity._id);
                    });
                    
                    if(!isInArray) {
                        allActivities.push(activity);
                    }
                });
                
                var foundComments = await Comment.find().where('author').equals(foundUser._id);
                var foundLoves = await Activity.find({loves: foundUser._id});
                var foundPoints = 0;

                res.render("users/profileShow", {   user: foundUser, 
                                                    allActivities: allActivities,
                                                    authorActivityIds: authorActivityIds, 
                                                    ownerActivityIds: ownerActivityIds, 
                                                    comments: foundComments.length, 
                                                    loves: foundLoves.length, 
                                                    points: foundPoints,
                                                    page: 'profile'
                                                });
            } catch(err) {
                req.flash("errorMessage", "Error connecting to database, please try again.");
                return res.redirect('/activities');
            }
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userProfileRoute;