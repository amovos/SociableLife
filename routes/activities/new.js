// ==========================
// ACTIVITY NEW ROUTE
// ==========================

var newRoute =  function(req, res){ //REST convention for route to form that will be submitted to /activities POST route
    res.render("activities/new");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;