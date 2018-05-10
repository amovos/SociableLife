// ==========================
// LOGIN NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    res.render("login", {page: 'login'}); //why not a redirect? This is the route that actually tells it what to render.
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;