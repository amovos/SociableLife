// ==========================
// COMMENT NEW ROUTE
// ==========================

var Activity = require("../../models/activity"); //require the activity database model

var newRoute =  function(req, res){
    //find activity by the id from the url and check it exists
    Activity.findById(req.params.id, function(err, foundActivity){
        if(err || !foundActivity){
            req.flash("errorMessage", "That activity does not exist");
            res.redirect("/activities");
        } else {
            res.render("comments/new", {activity: foundActivity});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;