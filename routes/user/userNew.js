// ==========================
// USER NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    res.render("register", {page: 'register'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;