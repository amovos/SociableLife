// ==========================
// MAP API ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model

var allMapActivities = function(req, res) {
    Activity.find().lean().exec(function (err, foundActivity) {
        return res.send(JSON.stringify(foundActivity));
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allMapActivities;