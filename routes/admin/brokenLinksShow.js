// ==========================
// BROKEN LINKS SHOW ROUTE
// ==========================

var genericErrorResponse = require("../shared/genericErrorResponse"); //require the shared function for a database error
var Activity = require("../../models/activity"); //require the activity database model
var request = require('request');
var requestPromise = require('request-promise');

var brokenLinks = async function(req, res) {
    var returnedLinkArray = [];
    var brokenLinkArrayError = [];
    var brokenLinkArray404 = [];
    var brokenLinkArrayOther = [];
    
    var foundActivities = await Activity.find();
    
        //run through list of all activities and check their website links
        //then return that list as an object to the page which can then be displayed
        //(this could be an admin API and it displays the returned data, but this is quicker for now)
    
    await foundActivities.forEach(async function(activity, index){
        //if activity has broken link push it onto brokenLinkArray
        request(activity.website, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log("Broken: " + activity.name);
                if(error){
                    brokenLinkArrayError.push(activity);
                    console.log("error: " + error);
                } else if(response.statusCode === 404) {
                    brokenLinkArray404.push(activity);
                } else {
                    brokenLinkArrayOther.push(activity);
                }
                
                returnedLinkArray.push(activity);
                console.log("Returned " + returnedLinkArray.length + "/" + foundActivities.length);
              
                if(returnedLinkArray.length === foundActivities.length){
                    console.log("Rendering Page Now from Broken");
                    res.render("admin/brokenLinks",
                        {
                            activitiesError: brokenLinkArrayError,
                            activities404: brokenLinkArray404,
                            activitiesOther: brokenLinkArrayOther
                        }
                    );
                }
            } else {
                returnedLinkArray.push(activity);
                console.log("Returned " + returnedLinkArray.length + "/" + foundActivities.length);

                if(returnedLinkArray.length === foundActivities.length){
                    console.log("Rendering Page Now from OK");
                    res.render("admin/brokenLinks",
                        {
                            activitiesError: brokenLinkArrayError,
                            activities404: brokenLinkArray404,
                            activitiesOther: brokenLinkArrayOther
                        }
                    );
                }
            }
        });
        
        
    });

    
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = brokenLinks;