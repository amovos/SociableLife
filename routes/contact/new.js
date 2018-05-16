// ==========================
// CONTACT NEW ROUTE
// ==========================

var newRoute =  function(req, res) {
    res.render("general/contact", {page: 'contact'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;