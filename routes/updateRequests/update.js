// ============================
// UPDATE REQUEST UPDATE ROUTE
// ============================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var UpdateRequest = require("../../models/updateRequest");

var updateUpdateRequestRoute = function(req, res){
    
    UpdateRequest.findById(req.params.updateRequest_id, async function(err, foundUpdateRequest){
        if(err || !foundUpdateRequest){
            genericErrorResponse(req, res, err);
        } else {
            
            //if isDone is already set then return
            if(foundUpdateRequest.isDone) {
                req.flash("successMessage", "That update request has already been completed");
                res.redirect("/activities/" + req.params.id);
            }
            
            //set isDone to true
            foundUpdateRequest.isDone = true;
            
            //set isDoneDate to current date;
            foundUpdateRequest.isDoneDate = new Date().toISOString();
            
            //set isDoneValue to the reason submitted in the req.body
            foundUpdateRequest.isDoneValue = req.body.changeValue;
            
            //set isDoneUser to the req.user._id
            foundUpdateRequest.isDoneUser = req.user._id;
            
            await foundUpdateRequest.save();
            
            req.flash("successMessage", "Thank you for updating this activity!");
            res.redirect("/activities/" + req.params.id); //this is the ID of the activity that comes from the first part of the request URL that's in the app.js file
        }
    });
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateUpdateRequestRoute;