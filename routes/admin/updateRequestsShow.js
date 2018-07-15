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
    
    res.render("admin/updateRequestsShow", {updateRequests: foundUpdateRequests, activities: allActivities, showAllUpdateRequests: showAllUpdateRequests});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allUpdateRequestsShow;