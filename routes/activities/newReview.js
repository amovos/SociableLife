// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var activityCreateObject = require("./activityCreateObject");

var newReviewRoute =  function(req, res){
    
    res.render("activities/newReview", activityCreateObject(req, res));
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newReviewRoute;