// ==========================
// ACTIVITY INDEX ROUTE
// ==========================
var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var indexRoute = function(req, res){ //This still goes to /activities but that is specified in app.js when it is used: app.use("/activities", activityRoutes);
    //Get all activities from DB
    Activity.find({}, function(err, allActivities){
        if(err){
            // This could be set up so that the submitted activity is checked and rejected if invalid
            dbErrorResponse(req, res, err);
        } else {
            res.render("activities/index", {activities: allActivities, page: 'activities'}); //pass through the page name so the nav bar highlights the correct icon
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = indexRoute;