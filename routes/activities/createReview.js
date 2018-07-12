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
    if(req.body.contactEmail)   { if (!(/\S/.test(req.body.contactEmail)))  {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Email can't be just spaces"})}}
    if(req.body.contactNum)     { if (!(/\S/.test(req.body.contactNum)))    {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Number can't be just spaces"})}}
    if(req.body.website)        { if (!(/\S/.test(req.body.website)))       {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Website can't be just spaces"})}}
    if(req.body.facebook)       { if (!(/\S/.test(req.body.facebook)))      {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Facebook can't be just spaces"})}}
    if(req.body.twitter)        { if (!(/\S/.test(req.body.twitter)))       {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Twitter can't be just spaces"})}}
    if(req.body.videoUrl)       { if (!(/\S/.test(req.body.videoUrl)))      {errorFlag = true; return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Video address can't be just spaces"})}}

    // CHECK FOR LENGTH OF INPUTS
    if(req.body.name.length         > 100)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Name is too long (" + req.body.name.length + "/100 characters)"})}
    if(req.body.summary.length      > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Summary is too long (" + req.body.summary.length + "/300 characters)"})}
    if(req.body.description.length  > 2000) {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Description is too long (" + req.body.description.length + "/2000 characters)"})}
    if(req.body.location.length     > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Location is too long (" + req.body.location.length + "/300 characters)"})}
    if(req.body.when.length         > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity When is too long (" + req.body.when.length + "/300 characters)"})}
    if(req.body.price.length        > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Cost is too long (" + req.body.price.length + "/300 characters)"})}

    //check optional inputs for lengths
    if(req.body.contactEmail) { if(req.body.contactEmail.length > 300)  {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Email is too long (" + req.body.contactEmail.length + "/300 characters)"})}}
    if(req.body.contactNum) {   if(req.body.contactNum.length > 50)     {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Contact Number is too long (" + req.body.contactNum.length + "/50 characters)"})}}
    if(req.body.website) {      if(req.body.website.length > 2000)      {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Website Address is too long (" + req.body.website.length + "/2000 characters)"})}}
    if(req.body.facebook) {     if(req.body.facebook.length > 2000)     {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Facebook Address is too long (" + req.body.facebook.length + "/2000 characters)"})}}
    if(req.body.twitter) {      if(req.body.twitter.length > 2000)      {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Twitter Address is too long (" + req.body.twitter.length + "/2000 characters)"})}}
    if(req.body.videoUrl) {     if(req.body.videoUrl.length > 2000)     {errorFlag = true;   return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Activity Video Address is too long (" + req.body.twitter.length + "/2000 characters)"})}}
    
    //check if neither age box has been checked
    if(req.body.isAdult === "false" && req.body.isChild === "false") {
        errorFlag = true; 
        return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Please select ages for this activity"});
    }
    
    //check if neither suitable box has been checked
    if(req.body.isPhysical === "false" && req.body.isLearning === "false") {
        errorFlag = true; 
        return res.send({type: "error", message: "<i class='fas fa-exclamation-triangle'></i> Please select suitable abilities for this activity"});
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
    
    
    var formattedWebsite;
    var formattedFacebook;
    var formattedTwitter;
    //sanitize protocol from links if given (so that it works with the <a> tag as a link)
    if(req.body.website){   formattedWebsite = req.body.website.replace(/^https?\:\/\/|\/$/i, "") }
    if(req.body.facebook){  formattedFacebook = req.body.facebook.replace(/^https?\:\/\/|\/$/i, "") }
    if(req.body.twitter){   formattedTwitter = req.body.twitter.replace(/^https?\:\/\/|\/$/i, "") }
    
    //If no error then send success response
    if (!errorFlag) { 
        return res.send({   type: "success", 
                            location: formattedLocation,
                            website: formattedWebsite,
                            facebook: formattedFacebook,
                            twitter: formattedTwitter
        });
    }
    
    //Don't actually create the activity yet, just run all the checks
    
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;