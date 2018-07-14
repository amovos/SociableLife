// ============================
// ACTIVITY DESTROY SHOW ROUTE
// ============================

var Activity = require("../../models/activity");

var destroyActivityShowRoute = function(req, res){

    Activity.findById(req.params.id, function(err, foundActivity){
        if(err || !foundActivity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            res.render("activities/destroy", {activity: foundActivity});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyActivityShowRoute;