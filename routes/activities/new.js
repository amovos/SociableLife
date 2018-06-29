// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var activityCreateObject = require("./activityCreateObject");

var newRoute = function(req, res){
    
    console.log("HERE");
    
    if(req.query.activityName){
        req.body.queryName = req.query.activityName;
    }
    
    res.render("activities/new", activityCreateObject(req, res));

};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;