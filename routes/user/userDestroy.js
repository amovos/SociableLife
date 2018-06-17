// ==========================
// USER DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var Comment = require("../../models/comment");
var User = require("../../models/user");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var destroyUserRoute = function(req, res){
    //transfer any activities to "Community User"
    User.findById(req.params.id, async function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            return res.redirect('/activities');
        } else if(foundUser.username === process.env.ADMIN_USERNAME || foundUser.username === process.env.COMMUNITY_USERNAME) {
            //can't delete admin or community users
            req.flash("errorMessage", "You can't delete the admin or community user!");
            return res.redirect('back');
        } else {
            // Search DB for all activities owned by the current user
            await Activity.find().where('author').equals(foundUser._id).exec(async function(err, foundActivities){
                if(err){
                    genericErrorResponse(req, res, err);
                } else if(foundActivities.length > 0) {
                    //find community user
                    await User.findOne().where('username').equals(process.env.COMMUNITY_USERNAME).exec(async function(err, foundCommunityUser){
                        //change owner of all activities to "Sociable Life Community" user
                        if(err){
                            genericErrorResponse(req, res, err);
                        } else {
                            foundActivities.forEach(async function(activity){
                                //console.log("CHANING ACTIVITY OWNERSHIP");
                                activity.author = foundCommunityUser._id;
                                activity.status = "review"; //if a person deletes an account it's likely that any activities they added will need to be checked again
                                await activity.save();
                            });
                        }
                    });
                }
            });
            
            //delete user profile image from cloudinary (if it exists and it's not the placeholder it will have an ID set in the DB)
            if(foundUser.avatarId){
                try {
                    // set cloudinary config from shared file
                    cloudinary.config(cloudinaryConf);
                    //delete avatar from cloudinary
                    //console.log("DELETING AVATAR");
                    await cloudinary.v2.uploader.destroy(foundUser.avatarId);
                } catch(err) {
                    if(err) {
                        genericErrorResponse(req, res, err);
                    }
                }
            }
            
            //delete all comments by that user
            await Comment.find().where('author').equals(foundUser._id).exec(function(err, foundComments){
                if(err){
                    genericErrorResponse(req, res, err);
                } else if(foundComments.length > 0) {
                    foundComments.forEach(async function(comment){
                        //console.log("DELETING COMMENT");
                        await comment.remove();
                    });
                }
            });

            //delete all loves by that user
            await Activity.find({loves: foundUser._id}).exec(function(err, foundLoveActivities){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    foundLoveActivities.forEach(async function(foundLoveActivity){
                        foundLoveActivity.loves.splice(foundLoveActivity.loves.indexOf(foundUser._id), 1);
                        await foundLoveActivity.save();
                    });
                }
            });
            
            //delete user
            //console.log("DELETED USER: " + foundUser.name);
            await foundUser.remove();
            
            req.flash("successMessage", "User has been deleted");
            return res.redirect("/activities");
        }
    });
    
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyUserRoute;