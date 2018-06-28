// ==========================
// ACTIVITY NEW CHECK ROUTE
// ==========================

var newCheckRoute =  function(req, res){ 
    res.render("activities/newCheck", {page: 'addActivity'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newCheckRoute;