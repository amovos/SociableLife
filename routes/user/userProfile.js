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
        
            var points = 0;
            var loves = 0;
            
            // Search DB for all activities submitted by the current user
            await Activity.find().where('author').equals(foundUser._id).exec(async function(err, foundActivities){
                if(err){
                    req.flash("errorMessage", "Error connecting to database, please try again.");
                    return res.redirect('/activities');
                } else {
                    await Comment.find().where('author').equals(foundUser._id).exec(function(err, foundComments){
                        if(err){
                            req.flash("errorMessage", "Error connecting to database, please try again.");
                            return res.redirect('/activities');
                        } else {
                            res.render("users/profileShow", {   user: foundUser, 
                                                                activities: foundActivities, 
                                                                comments: foundComments.length, 
                                                                loves: loves, 
                                                                points: points,
                                                                page: 'profile'
                                                            }
                            );
                        }
                    });
                }
            });
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userProfileRoute;