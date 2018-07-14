// ==========================================
// ACTIVITY UPDATE STATUS OWNER AUTHOR ROUTE
// ==========================================

var Activity = require("../../models/activity");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var genericErrorResponse = require("../shared/genericErrorResponse");

var req;
var res;

var updateStatusOwnerAuthorRoute = function(localReq, localRes){ 
    
    req = localReq;
    res = localRes;
    
    Activity.findById(req.params.id, async function(err, foundActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            if(foundActivity.status !== "removed") {
                await foundActivity.updateHistory.push(await createUpdateHistoryLog(foundActivity));
                
                foundActivity.status = "removed";
                
                // SET UPDATED AT DATE
                foundActivity.updatedAt = new Date().toISOString();
                
                await foundActivity.save();
                return res.send();
            }
        }
    });
};

async function createUpdateHistoryLog(foundActivity) {
    var updateLog = {};
    updateLog.author = req.user._id;
    updateLog.updateType = "Status Changed";
    updateLog.oldStatus = foundActivity.status;
    updateLog.newStatus = "removed";
    
    var newUpdateLog = await ActivityUpdateHistory.create(updateLog);
    return newUpdateLog;
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateStatusOwnerAuthorRoute;