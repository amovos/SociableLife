// ==========================
// ACTIVITY UPDATE ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var Activity = require("../../models/activity");
var geocoder = require("../shared/geocoder");

var updateRoute = function(req, res){
    
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
            if (!(/\S/.test(req.body.activity.age)))            {req.flash("errorMessage", "Activity Age can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.when)))           {req.flash("errorMessage", "Activity When can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.price)))          {req.flash("errorMessage", "Activity Cost can't be empty"); return res.redirect("back")}
            if (!(/\S/.test(req.body.activity.frequency)))      {req.flash("errorMessage", "Activity Type can't be empty"); return res.redirect("back")}
            
            //check optional inputs are not just whitespace
            if(req.body.activity.contactEmail) {
                if (!(/\S/.test(req.body.activity.contactEmail)))   {req.flash("errorMessage", "Contact Email can't be just white space"); return res.redirect("back")}
            }
            if(req.body.activity.contactNum) {
                if (!(/\S/.test(req.body.activity.contactNum)))     {req.flash("errorMessage", "Contact Number can't be just white space"); return res.redirect("back")}
            }

            // CHECK FOR LENGTH OF INPUTS
            if(req.body.activity.name.length         > 100)     {req.flash("errorMessage", "Activity Name is too long"); return res.redirect("back")}
            if(req.body.activity.summary.length      > 300)     {req.flash("errorMessage", "Summary is too long"); return res.redirect("back")}
            if(req.body.activity.description.length  > 2000)    {req.flash("errorMessage", "Description is too long"); return res.redirect("back")}
            if(req.body.activity.location.length     > 300)     {req.flash("errorMessage", "Location is too long"); return res.redirect("back")}
            if(req.body.activity.age.length          > 10)      {req.flash("errorMessage", "Age is too long"); return res.redirect("back")}
            if(req.body.activity.when.length         > 300)     {req.flash("errorMessage", "When is too long"); return res.redirect("back")}
            if(req.body.activity.price.length        > 300)     {req.flash("errorMessage", "Cost is too long"); return res.redirect("back")}
            if(req.body.activity.frequency.length    > 50)      {req.flash("errorMessage", "Type is too long"); return res.redirect("back")}
            
            //check optional inputs lengths
            if(req.body.activity.contactEmail) {
                if(req.body.activity.contactEmail.length > 300) {req.flash("errorMessage", "Contact Email is too long"); return res.redirect("back")}
            }
            if(req.body.activity.contactNum) {
                if(req.body.activity.contactNum.length > 50)    {req.flash("errorMessage", "Contact Number is too long"); return res.redirect("back")}
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
            activity.age = req.body.activity.age;
            activity.when = req.body.activity.when;
            activity.price = req.body.activity.price;
            activity.frequency = req.body.activity.frequency;
            activity.contactEmail = req.body.activity.contactEmail;
            activity.contactNum = req.body.activity.contactNum;
            
            //create new update history log
            var updateLog = {};
            updateLog.author = req.user._id;
            updateLog.updateType = "Info Changed";
            updateLog.oldStatus = activity.status;
            updateLog.newStatus = activity.status;
            
            await ActivityUpdateHistory.create(updateLog, async function(err, updateLog){
                if(err){
                    genericErrorResponse(req, res, err);
                } else {
                    activity.updateHistory.push(updateLog);
                    await activity.save();
                }
            });
            
            // UPDATE ACTIVITY IN DATABASE
            await activity.save();
            
            // Return success message
            req.flash("successMessage", "Successfully updated activity");
            res.redirect("/activities/" + req.params.id);
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;