// ==========================
// ACTIVITY EDIT ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var editRoute = function(req, res) {
    Activity.findById(req.params.id, function(err, foundActivity){ //foundActivity.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
        if(err || !foundActivity){
            genericErrorResponse(req, res, err);
        } else {
            res.render("activities/edit", {activity: foundActivity});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editRoute;