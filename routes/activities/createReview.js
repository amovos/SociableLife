// ==========================
// ACTIVITIES CREATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var User = require("../../models/user");
var geocoder = require("../shared/geocoder");

var createRoute = async function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    var errorFlag = false;
    var formattedLocation;

    // CHECK FOR LENGTH OF INPUTS
    if(req.body.name.length         > 100) {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Name is too long (" + req.body.name.length + "/100 characters)"})}
    if(req.body.summary.length      > 300) {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Summary is too long (" + req.body.summary.length + "/300 characters)"})}
    if(req.body.location.length     > 300) {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Location  is too long (" + req.body.location.length + "/300 characters)"})}
    if(req.body.description.length  > 2000) {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Description is too long (" + req.body.description.length + "/2000 characters)"})}

    // CHECK GEOCODE LOCATION
    //generate geocode data, use "await" to make sure it completes before creating activity
    await geocoder.geocode(req.body.location + " UK", function (err, data) {
        if (err || !data.length) {
            errorFlag = true;
            return res.send({type: "error", message: "Sorry that address can't be found, please try a post code"});
        } else {
            formattedLocation = data[0].formattedAddress;
        }
    });
    
    //If no error then send success response
    if (!errorFlag) { 
        return res.send({type: "success", location: formattedLocation});
    }
    
    //Don't actually create the activity yet, just run all the checks
    
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;