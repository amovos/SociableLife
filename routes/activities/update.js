// ==========================
// ACTIVITY UPDATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var Activity = require("../../models/activity");
var geocoder = require("../shared/geocoder");

var req;
var res;

var updateRoute = function(localReq, localRes){
    
    req = localReq;
    res = localRes;
    
    Activity.findById(req.params.id, async function(err, activity){
        if(err || !activity){
            req.flash("errorMessage", "Activity not found");
            res.redirect("/activities");
        } else {
            // VALIDATE ALL INPUTS
            // These should already have been passed in the UI to get to this point, but to stop people adding activities without validating data perform the checks again
            
            //check if inputs are not just whitespace
            if (!(/\S/.test(req.body.activity.name)))           {req.flash("errorMessage", "Activity Name can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.summary)))        {req.flash("errorMessage", "Activity summary can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.description)))    {req.flash("errorMessage", "Activity description can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.location)))       {req.flash("errorMessage", "Activity location can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.when)))           {req.flash("errorMessage", "Activity When can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.price)))          {req.flash("errorMessage", "Activity Cost can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.frequency)))      {req.flash("errorMessage", "Activity Type can't be empty"); return res.redirect("back")}
            
            //check optional inputs are not just whitespace
            if(req.body.activity.contactEmail) {    if (!(/\S/.test(req.body.activity.contactEmail)))   {req.flash("errorMessage", "Contact Email can't be just white space"); return res.redirect("back")}}
            if(req.body.activity.contactNum) {      if (!(/\S/.test(req.body.activity.contactNum)))     {req.flash("errorMessage", "Contact Number can't be just white space"); return res.redirect("back")}}
            if(req.body.activity.website) {         if (!(/\S/.test(req.body.activity.website)))        {req.flash("errorMessage", "Website address can't be just white space"); return res.redirect("back")}}
            if(req.body.activity.facebook) {        if (!(/\S/.test(req.body.activity.facebook)))       {req.flash("errorMessage", "Facebook address can't be just white space"); return res.redirect("back")}}
            if(req.body.activity.twitter) {         if (!(/\S/.test(req.body.activity.twitter)))        {req.flash("errorMessage", "Twitter address can't be just white space"); return res.redirect("back")}}
            if(req.body.activity.videoUrl) {        if (!(/\S/.test(req.body.activity.videoUrl)))       {req.flash("errorMessage", "Video address can't be just white space"); return res.redirect("back")}}

            // CHECK FOR LENGTH OF INPUTS
            if(req.body.activity.name.length         > 100)     {req.flash("errorMessage", "Activity Name is too long"); return res.redirect("back")}
            if(req.body.activity.summary.length      > 300)     {req.flash("errorMessage", "Summary is too long"); return res.redirect("back")}
            if(req.body.activity.description.length  > 2000)    {req.flash("errorMessage", "Description is too long"); return res.redirect("back")}
            if(req.body.activity.location.length     > 300)     {req.flash("errorMessage", "Location is too long"); return res.redirect("back")}
            if(req.body.activity.when.length         > 300)     {req.flash("errorMessage", "When is too long"); return res.redirect("back")}
            if(req.body.activity.price.length        > 300)     {req.flash("errorMessage", "Cost is too long"); return res.redirect("back")}
            if(req.body.activity.frequency.length    > 50)      {req.flash("errorMessage", "Type is too long"); return res.redirect("back")}
            
            //check optional inputs lengths
            if(req.body.activity.contactEmail)  { if(req.body.activity.contactEmail.length > 300) {req.flash("errorMessage", "Contact Email is too long"); return res.redirect("back")}}
            if(req.body.activity.contactNum)    { if(req.body.activity.contactNum.length > 50)    {req.flash("errorMessage", "Contact Number is too long"); return res.redirect("back")}}
            if(req.body.activity.website)       { if(req.body.activity.website.length > 2000)     {req.flash("errorMessage", "Website address is too long"); return res.redirect("back")}}
            if(req.body.activity.facebook)      { if(req.body.activity.facebook.length > 2000)    {req.flash("errorMessage", "Facebook address is too long"); return res.redirect("back")}}
            if(req.body.activity.twitter)       { if(req.body.activity.twitter.length > 2000)     {req.flash("errorMessage", "Twitter address is too long"); return res.redirect("back")}}
            if(req.body.activity.videoUrl)      { if(req.body.activity.videoUrl.length > 2000)    {req.flash("errorMessage", "Video address is too long"); return res.redirect("back")}}
            
            
            //check if neither age box has been checked
            if(!req.body.activity.isAdult && !req.body.activity.isChild) { {req.flash("errorMessage", "No age selected"); return res.redirect("back")}}
            
            //check if neither suitable box has been checked
            if(!req.body.activity.isPhysical && !req.body.activity.isLearning) { {req.flash("errorMessage", "No ability selected"); return res.redirect("back")}}


            //check endDate is formatted correctly
            if(req.body.activity.endDate) {
                if (!(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
                .test(req.body.activity.endDate))) {
                    req.flash("errorMessage", "End date format is wrong (DD/MM/YYYY)"); 
                    return res.redirect("back");
                }
            }

            // GEOCODER 
            // check if location info has changed otherwise don't re-geocode and charge for it
            if(req.body.activity.location !== activity.location){
                await geocoder.geocode(req.body.activity.location, function (err, data) {
                        if (err || !data.length) {
                        req.flash('errorMessage', 'Invalid address');
                        return res.redirect('back');
                    }
                    //overwrite existing location values with new geocoded values
                    activity.lat = data[0].latitude;
                    activity.lng = data[0].longitude;
                    activity.location = data[0].formattedAddress;
                });
            }
            
            // Update any additional fields
            activity.name = req.body.activity.name;
            activity.summary = req.body.activity.summary;
            activity.description = req.body.activity.description;
            if(req.body.activity.isAdult) { activity.age.isAdult = true; } else { activity.age.isAdult = false; }
            if(req.body.activity.isChild) { activity.age.isChild = true; } else { activity.age.isChild = false; }
            if(req.body.activity.isPhysical) { activity.suitable.isPhysical = true; } else { activity.suitable.isPhysical = false; }
            if(req.body.activity.isLearning) { activity.suitable.isLearning = true; } else { activity.suitable.isLearning = false; }
            activity.when = req.body.activity.when;
            activity.price = req.body.activity.price;
            activity.frequency = req.body.activity.frequency;
            activity.contactEmail = req.body.activity.contactEmail;
            activity.contactNum = req.body.activity.contactNum;
            activity.tags = req.body.activity.tags;
            
            //sanitize protocol from links if given (so that it works with the <a> tag as a link) and update
            if(req.body.activity.website){   activity.website = req.body.activity.website.replace(/^https?\:\/\/|\/$/i, "") } else { activity.website = '' }
            if(req.body.activity.facebook){  activity.facebook = req.body.activity.facebook.replace(/^https?\:\/\/|\/$/i, "") } else { activity.facebook = '' }
            if(req.body.activity.twitter){   activity.twitter = req.body.activity.twitter } else {  activity.twitter = '' }
            
            //Youtube URL
            activity.videoUrl = req.body.activity.videoUrl;
            if(req.body.activity.videoUrl) {
                activity.youtubeVideoId = await getYoutubeUrlId(req.body.activity.videoUrl);
            }
            
            // SET END DATE
            if(req.body.activity.endDate) {
                //convert string to date format for MongoDB
                var endDateDD = req.body.activity.endDate.substring(0, 2);
                var endDateMM = req.body.activity.endDate.substring(3, 5);
                var endDateYYYY = req.body.activity.endDate.substring(6, 10);
                
                var endDate = new Date();
                endDate.setYear(endDateYYYY);
                endDate.setMonth(endDateMM - 1); //zero index on months
                endDate.setDate(endDateDD);
                
                //check the endDate is in the future from now
                if(endDate < new Date()) {
                    req.flash("errorMessage", "End date can't be in the past"); 
                    return res.redirect("back");
                }
                
                activity.endDate = endDate.toISOString();
            } else {
                activity.endDate = undefined;
            }
            
            await activity.updateHistory.push(await createUpdateHistoryLog(activity));
            
            // SET UPDATED AT DATE
            activity.updatedAt = new Date().toISOString();
            
            // UPDATE ACTIVITY IN DATABASE
            await activity.save();
            
            // Return success message
            req.flash("successMessage", "Successfully updated activity");
            res.redirect("/activities/" + req.params.id);
        }
    });
};

function getYoutubeUrlId(url){
    var code = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    
    if(code) {
        return (typeof code[1] == 'string') ? code[1] : false;
    } else {
        return;
    }
}

async function createUpdateHistoryLog(foundActivity) {
    var updateLog = {};
    updateLog.author = req.user._id;
    updateLog.updateType = "Info Changed";
    updateLog.oldStatus = foundActivity.status;
    updateLog.newStatus = foundActivity.status;
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;