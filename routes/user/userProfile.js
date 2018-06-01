// ==========================
// USER PROFILE ROUTE
// ==========================

var User = require("../../models/user");
var Activity = require("../../models/activity");

var userProfileRoute =  function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            return res.redirect('/activities');
        }
        // Search DB for all activities submitted by the current user
        Activity.find().where('author').equals(foundUser._id).exec(function(err, activities){
            if(err){
                req.flash("errorMessage", "Error connecting to database, please try again.");
                return res.redirect('/activities');
            } else {
                res.render("users/profileShow", {user: foundUser, activities: activities}); //pass in the local variable of foundUser
            }
        });
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userProfileRoute;