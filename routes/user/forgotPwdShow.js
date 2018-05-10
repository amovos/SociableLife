// ==========================
// FORGOT PASSWORD ROUTE
// ==========================

var forgotPwdRoute = function(req, res){
    res.render("users/forgot", {page: 'forgot'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = forgotPwdRoute;









