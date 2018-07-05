// ==========================
// MIDDLEWARE
// ==========================

// Require models for the data structures to perform the database searches
var Activity = require("../models/activity");
var Comment = require("../models/comment");
var User = require("../models/user");

// Define empty object, fill with functions, then export
var middlewareObj = {};

// CHECK ACTIVITY OWNERSHIP
middlewareObj.checkActivityOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Activity.findById(req.params.id, function(err, foundActivity){ //foundActivity.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
            if(err || !foundActivity){ //handles the error of a valid ID being sent to the database and it returning null (stops the app crashing)
                req.flash("errorMessage", "Activity not found");
                res.redirect("/activities");
            } else {
                
                var isOwner = false;
                if(req.user) {
                    isOwner = foundActivity.owner.some(function(owner){
                        return owner.equals(req.user._id);
                    });
                }
            
                //is the requesting user the author, owner, mod or an admin?
                if(foundActivity.author._id.equals(req.user._id) || isOwner || req.user && (req.user.isAdmin || req.user.isMod)){ //use this mongoose method .equals() to make a comparison of user ids
                    next(); // if everything works, the middleware is done and it carries on with the code in the particular route
                } else {
                    req.flash("errorMessage", "You don't have permission to edit this activity");
                    res.redirect("/activities");
                }
            }
        });
    } else {
        req.flash("errorMessage", "You need to be logged in to edit an activity");
        res.redirect("/login");
    }
};


// CHECK COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){ //foundActivity.author.id isn't a string (even though it may look like it when printed out) it's actually a mongoose object
            if(err || !foundComment){
                req.flash("errorMessage", "Comment not found");
                res.redirect("/activities");
            } else {
                //does user own comment?
                if(foundComment.author._id.equals(req.user._id) || req.user && (req.user.isAdmin || req.user.isMod)){ //use this mongoose method .equals() to make a comparison of user ids
                    next(); //if everything works, the middleware is done and it carries on with the code in the particular route
                } else {
                    req.flash("errorMessage", "You don't have permission to edit that comment");
                    res.redirect("/activities");
                }
            }
        });
    } else {
        req.flash("errorMessage", "You need to be logged in to do that");
        res.redirect("/login");
    }
};


// CHECK USER PROFILE OWNERSHIP
middlewareObj.userProfileOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("errorMessage", "User not found");
                res.redirect("/activities");
            } else {
                if(foundUser._id.equals(req.user._id) || req.user && req.user.isAdmin){
                    next();
                } else {
                    req.flash("errorMessage", "You don't have permission to edit that user");
                    res.redirect("/activities");
                }
            }
        });
    } else {
        req.flash("errorMessage", "You need to be logged in to do that");
        res.redirect("/login");
    }
};


// CHECK ISLOGGEDIN
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("errorMessage", "You need to be logged in to do that");
    res.redirect("/login");
};

// CHECK ISADMIN
middlewareObj.isAdmin = function(req, res, next){
    if(req.user && req.user.isAdmin){
        return next();
    }
    req.flash("errorMessage", "You need to be an admin to do that");
    res.redirect("/");
};

// CHECK ISADMIN OR ISMOD
middlewareObj.isAdminOrMod = function(req, res, next){
    if(req.user && (req.user.isAdmin || req.user.isMod)){
        return next();
    }
    req.flash("errorMessage", "You need to be an admin or moderator to do that");
    res.redirect("/");
};



// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = middlewareObj;