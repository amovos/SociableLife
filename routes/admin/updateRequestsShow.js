// ===============================
// ALL UPDATE REQUESTS SHOW ROUTE
// ===============================

var UpdateRequest = require("../../models/updateRequest");
var Activity = require("../../models/activity");

var allUpdateRequestsShow = async function(req, res) {
    var foundUpdateRequests = await UpdateRequest.find().sort({updatedAt: -1})
        .populate({
            path: 'author',
            model: 'User'
        })
        .populate({
            path: 'isDoneUser',
            model: 'User'
        });
        
    var allActivities = await Activity.find();
    
    var showAllUpdateRequests = false;
    if(req.query.showAllUpdateRequests === "true") {
        showAllUpdateRequests = true;
    }
    
    
    var currentWithUpdates = [];
    var removedWithUpdates = [];
    var reviewNoUpdates = [];
    
    await allActivitiesLoop(allActivities, foundUpdateRequests, "current", currentWithUpdates);
    await allActivitiesLoop(allActivities, foundUpdateRequests, "removed", removedWithUpdates);
    
    await allActivities.forEach(async function(activity) {
        var counter = 0;
        if(activity.status === "review") {
            
            //count all update requests with isDone
            activity.updateRequests.forEach(function(updateRequestId) {
                foundUpdateRequests.forEach(async function(updateRequest) {
                    if(updateRequest._id.toString() === updateRequestId.toString()) {
                        if(updateRequest.isDone) {
                            await counter ++;
                        }
                    }
                });
            });
            
            //if isDone is the same as the total number of requests then it shouldn't be in "review"
            if(activity.updateRequests.length === counter) {
                await reviewNoUpdates.push(activity);
            }
        }
    });

    
    
    res.render("admin/updateRequestsShow", {    updateRequests: foundUpdateRequests, 
                                                activities: allActivities, 
                                                showAllUpdateRequests: showAllUpdateRequests,
                                                currentWithUpdates: currentWithUpdates,
                                                removedWithUpdates: removedWithUpdates,
                                                reviewNoUpdates: reviewNoUpdates
                                        });
};

async function allActivitiesLoop(allActivities, foundUpdateRequests, status, array) {
    allActivities.forEach(function(activity) {
        if(activity.status === status) {
            activity.updateRequests.forEach(function(updateRequestId) {
                foundUpdateRequests.forEach(async function(updateRequest) {
                    if(updateRequest._id.toString() === updateRequestId.toString()) {
                        if(!updateRequest.isDone) {
                            if(!(array.includes(activity))) {
                                await array.push(activity);
                            }
                        }
                    }
                });
            });
        }
    });
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allUpdateRequestsShow;