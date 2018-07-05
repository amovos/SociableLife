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
                var foundActivities = await Activity.find().where('author').equals(foundUser._id);
                var ownerActivities = await Activity.find({ 'owner' : foundUser._id });
                var allActivities = foundActivities.concat(ownerActivities);
                
                var foundComments = await Comment.find().where('author').equals(foundUser._id);
                var foundLoves = await Activity.find({loves: foundUser._id});
                var foundPoints = 0;

                res.render("users/profileShow", {   user: foundUser, 
                                                    activities: allActivities, 
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