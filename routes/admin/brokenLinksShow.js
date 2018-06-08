// ==========================
// BROKEN LINKS SHOW ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var brokenLinks = function(req, res) {
    Activity.find()
    .then(function(foundActivities){
        
        //run through list of all activities and check their website links
        //then return that list as an object to the page which can then be displayed
        //(this could be an admin API and it displays the returned data, but this is quicker for now)
        
        res.render("admin/brokenLinks", {activities: foundActivities});
    })
    .catch(function(err){
        res.send(err);
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = brokenLinks;