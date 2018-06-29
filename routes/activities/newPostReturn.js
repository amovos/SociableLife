// ===============================
// ACTIVITY NEW POST RETURN ROUTE
// ===============================

var activityCreateObject = require("./activityCreateObject");

var newPostReturnRoute =  function(req, res){
    
    // This route is for the "Edit Info" button on the Review page when creating an activity
    
    res.render("activities/new", activityCreateObject(req, res));
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newPostReturnRoute;