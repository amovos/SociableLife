// ==========================
// USER DESTROY ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var Comment = require("../../models/comment");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var UpdateRequest = require("../../models/updateRequest");
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
                            await foundActivities.forEach(async function(activity){
                                activity.author = foundCommunityUser._id;
                                activity.status = "review"; //if a person deletes an account it's likely that any activities they added will need to be checked again
                                await activity.save();
                            });
                        }
                    });
                }
            });
            
            await User.findOne().where('username').equals(process.env.COMMUNITY_USERNAME).exec(async function(err, foundCommunityUser){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    
                    //change author of any update histories to community user
                    await ActivityUpdateHistory.find({author: foundUser._id}).exec(function(err, foundUpdateHistories){
                        if(err){
                            genericErrorResponse(req, res, err);
                        } else {
                            foundUpdateHistories.forEach(async function(foundUpdateHistory){
                                foundUpdateHistory.author = foundCommunityUser._id;
                                await foundUpdateHistory.save(); //allowed as it's only updating this once
                            });
                        }
                    });
                    
                    //**********
                    //Instead of using .save() for the update requests I could do a pull and push
                    
                    //change author of any update requests to community user
                    await UpdateRequest.find({author: foundUser._id}).exec(async function(err, foundUpdateRequest){
                        if(err){
                            genericErrorResponse(req, res, err);
                        } else {
                            await foundUpdateRequest.forEach(async function(updateRequest){
                                updateRequest.author = foundCommunityUser._id;
                                await updateRequest.save();
                            });
                        }
                    });
                    
                    //change isDoneUser of any update requests to community user
                    await UpdateRequest.find({isDoneUser: foundUser._id}).exec(async function(err, foundUpdateRequest){
                        if(err){
                            genericErrorResponse(req, res, err);
                        } else {
                            await foundUpdateRequest.forEach(async function(updateRequest){
                                updateRequest.isDoneUser = foundCommunityUser._id;
                                await updateRequest.save();
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
                    await cloudinary.v2.uploader.destroy(foundUser.avatarId);
                } catch(err) {
                    if(err) {
                        genericErrorResponse(req, res, err);
                    }
                }
            }
            
            //delete all comments by that user
            await Comment.find().where('author').equals(foundUser._id).exec(async function(err, foundComments){
                if(err){
                    genericErrorResponse(req, res, err);
                } else if(foundComments.length > 0) {
                    await foundComments.forEach(async function(comment){
                        //remove reference to deleted comment from activity
                        await Activity.findOne({ 'comments' : comment._id }, async function(err, foundCommentActivity){
                            if(err){
                                genericErrorResponse(req, res, err);
                            } else {
                                await Activity.update( { _id: foundCommentActivity._id }, { $pullAll: { comments: [comment._id] } } );
                                
                                //once the comment has been removed from the activity, then remove the actual comment
                                await comment.remove();
                            }
                        });
                    });
                }
            });

            //delete all loves by that user
            await Activity.find({loves: foundUser._id}).exec(async function(err, foundLoveActivities){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    await foundLoveActivities.forEach(async function(foundLoveActivity){
                        await Activity.update( { _id: foundLoveActivity._id }, { $pullAll: { loves: [foundUser._id] } } );
                    });
                }
            });
            
            //delete all instances where user owns an activity
            await Activity.find({owner: foundUser._id}).exec(async function(err, foundOwnerActivities){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    await foundOwnerActivities.forEach(async function(foundOwnerActivity){
                        await Activity.update( { _id: foundOwnerActivity._id }, { $pullAll: { owner: [foundUser._id] } } );
                    });
                }
            });
            
            //delete user
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