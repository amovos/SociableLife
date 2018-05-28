// ==========================
// ACTIVITY INDEX ROUTE
// ==========================

var indexRoute = function(req, res){ //This still goes to /activities but that is specified in app.js when it is used: app.use("/activities", activityRoutes);
    res.render("activities/index", {page: 'activities'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = indexRoute;