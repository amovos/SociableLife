// ============================
// ACTIVITY IMAGE UPDATE ROUTE
// ============================

var Activity = require("../../models/activity");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var genericErrorResponse = require("../shared/genericErrorResponse");
var cloudinary = require('cloudinary');
var cloudinaryConf = require("../shared/cloudinary");

var updateAvatarRoute = async function(req, res){

    Activity.findById(req.params.id, async function(err, foundActivity){
        if(err || !foundActivity){
            req.flash("errorMessage", "Activity not found");
            return res.redirect('/activities');
        }
        
        //if multer error - display here
        if(req.fileValidationError) {
            req.flash("errorMessage", req.fileValidationError);
            return res.redirect("/activities/" + foundActivity._id + "/editImage");
        }
        
        //if an image has been added (and passed the multer checks) then upload it to Cloudinary
        if(req.file){
            // CLOUDINARY
            cloudinary.config(cloudinaryConf);
        
            // set image location to correct folder on Cloudinary
            var public_id = "sl-" + process.env.ENV_ID + "/activities/" + req.file.filename; //could change to a random string
            
            // delete previous image (if one existed) then upload the new one
            if(foundActivity.imageId){
                await cloudinary.v2.uploader.destroy(foundActivity.imageId);
            }
            
            // Upload the image to Cloudinary and wait for a response
            await cloudinary.v2.uploader.upload(req.file.path, {public_id: public_id}, async function(err, result) {
                if(err) {
                    req.flash("errorMessage", "There was a problem uploading your activity picture, please try again");
                    return res.redirect("/activities/" + foundActivity._id + "/editImage");
                }
                // add cloudinary url for the image to the foundActivity
                foundActivity.image = result.secure_url;
                // add image's public_id to foundActivity object
                foundActivity.imageId = result.public_id;
                
                //add change to activity updateHistory
                var updateLog = {};
                updateLog.author = req.user._id;
                updateLog.updateType = "Picture Changed";
                updateLog.oldStatus = foundActivity.status;
                updateLog.newStatus = foundActivity.status;
                
                await ActivityUpdateHistory.create(updateLog, async function(err, updateLog){
                    if(err){
                        genericErrorResponse(req, res, err);
                    } else {
                        // connect new comment to the currently found activity
                        await foundActivity.updateHistory.push(updateLog);
                        await foundActivity.save();
                    }
                });
                
                // SET UPDATED AT DATE
                foundActivity.updatedAt = new Date().toISOString();
                
                //save new avatar to foundActivity
                await foundActivity.save();
                
                req.flash("successMessage", "Successfully updated activity picture");
                return res.redirect("/activities/" + foundActivity._id);
            });
        } else {
            //if no error or file then nothing was selected or uploaded
            req.flash("errorMessage", "Please choose a file, no image was selected");
            return res.redirect("/activities/" + foundActivity._id + "/editImage");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateAvatarRoute;