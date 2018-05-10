// ==========================
// USER NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    res.render("users/register", {page: 'register'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;