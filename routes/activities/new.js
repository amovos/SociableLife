// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var activityCreateObject = require("./activityCreateObject");

var newRoute = function(req, res){
    
    if(req.query.activityName){
        req.body.queryName = req.query.activityName;
    }
    
    res.render("activities/new", activityCreateObject(req, res));

};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;