// ==========================
// ACTIVITY UPDATE STATUS ROUTE
// ==========================

var Activity = require("../../models/activity");
var genericErrorResponse = require("../shared/genericErrorResponse");

var updateStatusRoute =  function(req, res){ 

    Activity.findById(req.body.activityId, async function(err, foundActivity){
        if(err){
            genericErrorResponse(req, res, err);
        } else {
            if(foundActivity.status !== req.body.status) {
                foundActivity.status = req.body.status;
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