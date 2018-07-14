// ==========================
// INVITE CODE ROUTE
// ==========================

var newRoute =  function(req, res){
    //res.render("users/inviteCode", {page: 'register'}); // pass through "register" so that the the nav bar highlights correctly
    res.redirect("/register");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;