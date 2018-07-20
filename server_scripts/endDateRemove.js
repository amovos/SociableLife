// ==============================
// REMOVE OLD ACTIVITIES SCRIPT
// ==============================

var Activity = require("../models/activity");
var User = require("../models/user");
var ActivityUpdateHistory = require("../models/activityUpdateHistory");
var genericErrorResponse = require("../routes/shared/genericErrorResponse");

var communityUserId;

async function removeOldActivities(){
    
    //Find Community User
    communityUserId = await User.findOne({ username: process.env.COMMUNITY_USERNAME }, function(err, user) {
        if(err){
            return;
        } else {
            return user._id;
        }
    });
    
    console.log("HERE");
    
    var foundActivities = await Activity.find();
    
    await foundActivities.forEach(async function(activity, index){
        
        if(activity.status === "current" && activity.endDate && activity.endDate < new Date()) {
            console.log("OUT OF DATE: " + activity.name);
            
            // UPDATE STATUS
            activity.status = "removed";
            
            // SET UPDATED AT DATE
            activity.updatedAt = new Date().toISOString();
            
            // CREATE UPDATE HISTORY LOG
            await activity.updateHistory.push(await createUpdateHistoryLog(activity));
            
            // UPDATE ACTIVITY IN DATABASE
            await activity.save();
        }
    });
}

module.exports = removeOldActivities;



async function createUpdateHistoryLog(foundActivity) {
    var updateLog = {};
    updateLog.author = communityUserId;
    updateLog.updateType = "Info Changed";
    updateLog.oldStatus = foundActivity.status;
    updateLog.newStatus = foundActivity.status;
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}

//find all activities
//for each activity check status
    //if status === "current"
        //if activity has an endDate set
            //if endDate is before now
                //set activity status to "removed"
                //create an update history log