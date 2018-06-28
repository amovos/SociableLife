// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var newRoute =  function(req, res){ //REST convention for route to form that will be submitted to /activities POST route
    
    var activityName = "";
    
    if(req.query.activityName){
        activityName = req.query.activityName;
    }
    
    res.render("activities/new", {page: 'addActivity', activityNameQuery: activityName});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;