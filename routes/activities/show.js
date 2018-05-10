// ==========================
// ACTIVITY SHOW ROUTE
// ==========================

var Activity = require("../../models/activity"); //require the activity database model

var showRoute = function(req, res){
    //find the activity from the database using the id provided in the request (:id)
    Activity.findById(req.params.id).populate("comments").exec(function(err, foundActivity){ //inside the returned object "foundActivity" it will now contain actual comments and not just reference ids
       if(err || !foundActivity){
            console.log(err);
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
       } else {
            res.render("activities/show", {activity: foundActivity}); //pass the found activity to the show template
       }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = showRoute;