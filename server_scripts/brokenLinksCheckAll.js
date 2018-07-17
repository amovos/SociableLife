// ==============================
// CHECK ALL BROKEN LINKS SCRIPT
// ==============================

var Activity = require("../models/activity"); //require the activity database model
var request = require('request');

async function checkAllBrokenLinks(timeStamp){
    
    var foundActivities = await Activity.find();
    
    await foundActivities.forEach(async function(activity, index){
        
        if(activity.website) {
            
            var websiteURL;
        
            //if website doesn't have "http" or "https" at the start then add it
            if(!(activity.website.match(/^https?\:\/\/|\/$/i))) {
                websiteURL = "http://" + activity.website;
            } else {
                websiteURL = activity.website;
            }
            
            console.log(websiteURL);
            
            
            request(websiteURL, function (error, response, body) {
                if (error) {
                    //save "error" to error message
                    if(!activity.linkStatus.isLinkBroken){ //if it's not yet broken, set the start date
                        activity.linkStatus.dateFirstBroken = timeStamp;
                    }
                    
                    activity.linkStatus.isLinkBroken = true;
                    activity.linkStatus.errorMessage = error;
                    activity.linkStatus.dateLastChecked = timeStamp;
                    
                    // UPDATE ACTIVITY IN DATABASE
                    activity.save();
                } else if (response.statusCode !== 200) {
                    //save status code to error message (so you can query it later)
                    
                    if(!activity.linkStatus.isLinkBroken){ //if it's not yet broken, set the start date
                        activity.linkStatus.dateFirstBroken = timeStamp;
                    }
                    
                    activity.linkStatus.isLinkBroken = true;
                    activity.linkStatus.errorMessage = response.statusCode;
                    activity.linkStatus.dateLastChecked = timeStamp;
                    activity.save();
                } else {
                    //the link is probably working, so reset the link stats in the database including the "last checked" date
                    activity.linkStatus.dateFirstBroken = undefined;
                    activity.linkStatus.errorMessage = undefined;
                    
                    activity.linkStatus.isLinkBroken = false;
                    activity.linkStatus.dateLastChecked = timeStamp;
                    activity.save();
                }
            });
        }
    });
}

module.exports = checkAllBrokenLinks;