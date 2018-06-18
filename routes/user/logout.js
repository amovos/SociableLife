// ==========================
// LOGOUT ROUTE
// ==========================

var newRoute =  function(req, res) {
    req.logout();
    req.flash("successMessage", "You've been logged out, come back soon :)");
    res.redirect("/activities");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;









