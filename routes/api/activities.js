// ==========================
// ALL ACTIVITIES API ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var allActivities = function(req, res) {
    Activity.find()
    .then(function(foundActivities){
        res.json(foundActivities);
    })
    .catch(function(err){
        res.send(err);
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allActivities;