// ============================
// ACTIVITY UPDATE STATUS ROUTE
// ============================

var Activity = require("../../models/activity");
var ActivityUpdateHistory = require("../../models/activityUpdateHistory");
var genericErrorResponse = require("../shared/genericErrorResponse");

var updateStatusRoute =  function(req, res){ 
    Activity.findById(req.body.activityId, async function(err, foundActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            if(foundActivity.status !== req.body.status) {
                //add change to activity updateHistory
                var updateLog = {};
                updateLog.author = req.user._id;
                updateLog.updateType = "Status Changed";
                updateLog.oldStatus = foundActivity.status;
                updateLog.newStatus = req.body.status;
                
                await ActivityUpdateHistory.create(updateLog, async function(err, updateLog){
                    if(err){
                        genericErrorResponse(req, res, err);
                    } else {
                        // connect new comment to the currently found activity
                        foundActivity.updateHistory.push(updateLog);
                        await foundActivity.save();
                    }
                });
                
                foundActivity.status = req.body.status;
                
                // SET UPDATED AT DATE
                foundActivity.updatedAt = new Date().toISOString();
                
                await foundActivity.save();
                return res.send();
            }
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateStatusRoute;