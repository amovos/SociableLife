// ==========================
// ACTIVITY INDEX ROUTE
// ==========================
var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var indexRoute = function(req, res){ //This still goes to /activities but that is specified in app.js when it is used: app.use("/activities", activityRoutes);
    
    var noMatch = false

    // If search term has been entered then only find those matching activitise
    if(req.query.search) {
        const regex = new RegExp(searchRegex(req.query.search), 'gi'); // g: global, i: ignore case?
        
        Activity.find({name: regex}, function(err, allActivities){ // search on multiple fields - https://stackoverflow.com/questions/11725708/node-js-and-mongoose-regex-query-on-multiple-fields
            if(err){
                // This could be set up so that the submitted activity is checked and rejected if invalid
                genericErrorResponse(req, res, err);
            } else {
                if(allActivities.length < 1) { //if search doesn't find any results
                    noMatch = true;
                }
                res.render("activities/index", {activities: allActivities, noMatch: noMatch, page: 'activities'}); //pass through the page name so the nav bar highlights the correct icon
            }
        });
    } else {
        // Else, if no search term in present then find all activities from DB
        Activity.find({}, function(err, allActivities){
            if(err){
                // This could be set up so that the submitted activity is checked and rejected if invalid
                genericErrorResponse(req, res, err);
            } else {
                res.render("activities/index", {activities: allActivities, noMatch: noMatch, page: 'activities'}); //pass through the page name so the nav bar highlights the correct icon
            }
        });
    }
};


function searchRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = indexRoute;