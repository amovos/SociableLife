// ==========================
// USER AVATAR UPDATE ROUTE
// ==========================

var User = require("../../models/user");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var updateAvatarRoute = async function(req, res){

    User.findById(req.params.id, async function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            return res.redirect('/activities');
        }
        
        //if multer error - display here
        if(req.fileValidationError) {
            req.flash("errorMessage", req.fileValidationError);
            return res.redirect("/users/" + foundUser._id + "/avatar");
        }
        
        //if an image has been added (and passed the multer checks) then upload it to Cloudinary
        if(req.file){
            // CLOUDINARY
            cloudinary.config(cloudinaryConf);
        
            // set image location to correct folder on Cloudinary
            var public_id = "sl-" + process.env.ENV_ID + "/avatars/" + req.file.filename; //could change to a random string
            
            // delete previous image (if one existed) then upload the new one
            if(foundUser.avatarId){
                await cloudinary.v2.uploader.destroy(foundUser.avatarId);
            }
            
            // Upload the image to Cloudinary and wait for a response
            await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, async function(err, result) {
                if(err) {
                    req.flash("errorMessage", "There was a problem uploading your profile picture, please try again");
                    return res.redirect("/users/" + foundUser._id + "/avatar");
                }
                // add cloudinary url for the image to the newUser
                foundUser.avatar = result.secure_url;
                // add image's public_id to newUser object
                foundUser.avatarId = result.public_id;
                
                //save new avatar to user
                await foundUser.save();
                
                req.flash("successMessage", "Successfully updated profile picture");
                return res.redirect("/users/" + foundUser._id);
            });
        } else {
            //if no error or file then nothing was selected or uploaded
            req.flash("errorMessage", "Please choose a file, no image was selected");
            return res.redirect("/users/" + foundUser._id + "/avatar");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateAvatarRoute;