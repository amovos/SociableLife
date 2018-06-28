// ==========================
// ACTIVITY NEW CHECK ROUTE
// ==========================

var newCheckRoute =  function(req, res){ 
    res.render("activities/newCheck", {page: 'newCheck'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newCheckRoute;