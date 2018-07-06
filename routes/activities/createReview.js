// ==============================
// ACTIVITIES CREATE REVIEW ROUTE
// ==============================

var genericErrorResponse = require("../shared/genericErrorResponse");
var User = require("../../models/user");
var geocoder = require("../shared/geocoder");

var createRoute = async function(req, res){
    
    var errorFlag = false;
    var formattedLocation;
    
    //check if inputs are not just whitespace
    if (!(/\S/.test(req.body.name)))            {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Name can't be empty"})}
    if (!(/\S/.test(req.body.summary)))         {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Summary can't be empty"})}
    if (!(/\S/.test(req.body.description)))     {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Description can't be empty"})}
    if (!(/\S/.test(req.body.location)))        {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Location can't be empty"})}
    if (!(/\S/.test(req.body.when)))            {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity When can't be empty"})}
    if (!(/\S/.test(req.body.price)))           {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Cost can't be empty"})}
    
    //check optional inputs for whitespace
    if(req.body.contactEmail) {
        if (!(/\S/.test(req.body.contactEmail)))    {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Email can't be just spaces"})}
    }
    if(req.body.contactNum) {
        if (!(/\S/.test(req.body.contactNum)))      {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Number can't be just spaces"})}
    }

    // CHECK FOR LENGTH OF INPUTS
    if(req.body.name.length         > 100)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Name is too long (" + req.body.name.length + "/100 characters)"})}
    if(req.body.summary.length      > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Summary is too long (" + req.body.summary.length + "/300 characters)"})}
    if(req.body.description.length  > 2000) {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Description is too long (" + req.body.description.length + "/2000 characters)"})}
    if(req.body.location.length     > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Location is too long (" + req.body.location.length + "/300 characters)"})}
    if(req.body.when.length         > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity When is too long (" + req.body.when.length + "/300 characters)"})}
    if(req.body.price.length        > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Cost is too long (" + req.body.price.length + "/300 characters)"})}

    //check optional inputs for lengths
    if(req.body.contactEmail) {
        if(req.body.contactEmail.length > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Email is too long (" + req.body.contactEmail.length + "/300 characters)"})}
    }
    if(req.body.contactNum) {
        if(req.body.contactNum.length > 50)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Number is too long (" + req.body.contactNum.length + "/50 characters)"})}
    }


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