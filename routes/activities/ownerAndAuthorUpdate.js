// =======================================
// ACTIVITY OWNER AND AUTHOR UPDATE ROUTE
// =======================================

var genericErrorResponse = require("../shared/genericErrorResponse"); 
var Activity = require("../../models/activity"); 
var User = require("../../models/user"); 

var updateActivityOwnerAndAuthorRoute = async function(req, res) {
    var errorFlag = false;
    
    await Activity.findById(req.params.id, async function(err, foundActivity){
        if(err || !foundActivity){
            genericErrorResponse(req, res, err);
        } else {
            //if new author ID has been set then check it's a valid ID then update the activity
            if(req.body.newAuthorId) {
                await User.findById(req.body.newAuthorId, function(err, foundAuthor){
                    if(err || !foundAuthor){
                        errorFlag = true;
                        req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new author");
                        res.redirect("back");
                    } else {
                        foundActivity.author = foundAuthor;
                        foundActivity.save();
                    }
                });
            }
        
            //if a new owner/owners have been added then check the IDs are valid then add them to the activity owner array
            if(req.body.newOwnerId.length > 0 && req.body.newOwnerId[0] !== "") {
                var newOwnerValidatedArray = [];
                
                for(var i=0; i<req.body.newOwnerId.length; i++) {
                    await User.findById(req.body.newOwnerId[i], async function(err, foundOwner){
                        if(err || !foundOwner){
                            errorFlag = true;
                            req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new owner");
                            res.redirect("back");
                        } else {
                            await newOwnerValidatedArray.push(foundOwner._id);
                        }
                    });
                }
                
                //once all the owner IDs have been validated then save them to the activity
                if(!errorFlag) {
                    //need to add a check here so only unique IDs are added
                    foundActivity.owner = newOwnerValidatedArray;
                    foundActivity.save();
                } else {
                    req.flash("errorMessage", "Sorry, we couldn't find a user with that ID for the new owner");
                    res.redirect("back");
                }
            }
            
            if(!errorFlag){
                // Return success message
                req.flash("successMessage", "Successfully updated activity");
                res.redirect("/activities/" + req.params.id);
            }
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateActivityOwnerAndAuthorRoute;