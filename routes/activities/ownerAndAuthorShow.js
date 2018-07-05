// =====================================
// ACTIVITY OWNER AND AUTHOR SHOW ROUTE
// =====================================

var genericErrorResponse = require("../shared/genericErrorResponse"); 
var Activity = require("../../models/activity"); 

var updateActivityOwnerAndAuthorRoute = function(req, res) {
    Activity.findById(req.params.id, function(err, foundActivity){
        if(err || !foundActivity){
            genericErrorResponse(req, res, err);
        } else {
            res.render("activities/ownerAndAuthorShow", {activity: foundActivity});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateActivityOwnerAndAuthorRoute;