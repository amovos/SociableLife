// ==========================
// ALL COMMENTS SHOW ROUTE
// ==========================

var Comment = require("../../models/comment");
var Activity = require("../../models/activity");

var allEndDatesShow = async function(req, res) {

    var allActivities = await Activity.find({}).sort({endDate: 1});
    
    res.render("admin/allEndDates", {activities: allActivities});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = allEndDatesShow;