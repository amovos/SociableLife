// ==========================
// ACTIVITY EDIT IMAGE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var Activity = require("../../models/activity");

var editImageRoute = function(req, res) {
    Activity.findById(req.params.id, function(err, foundActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            res.render("activities/editImage", {activity: foundActivity});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editImageRoute;