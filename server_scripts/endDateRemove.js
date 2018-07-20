// ==============================
// REMOVE OLD ACTIVITIES SCRIPT
// ==============================

var Activity = require("../models/activity");
var User = require("../models/user");
var ActivityUpdateHistory = require("../models/activityUpdateHistory");

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
    
    var foundActivities = await Activity.find();
    
    await foundActivities.forEach(async function(activity){
        
        if(activity.status === "current" && activity.endDate && activity.endDate < new Date()) {
            // SET UPDATED AT DATE
            activity.updatedAt = new Date().toISOString();
            
            // CREATE UPDATE HISTORY LOG
            await activity.updateHistory.push(await createUpdateHistoryLog(activity));
            
            // UPDATE STATUS
            activity.status = "removed";
            
            // UPDATE ACTIVITY IN DATABASE
            await activity.save();
        }
    });
}

module.exports = removeOldActivities;


async function createUpdateHistoryLog(foundActivity) {
    
    var updateLog = {};
    updateLog.author = communityUserId;
    updateLog.updateType = "Status Changed";
    updateLog.oldStatus = foundActivity.status;
    updateLog.newStatus = "removed";
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}