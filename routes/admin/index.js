// ==========================
// ADMIN INDEX ROUTE
// ==========================

var adminIndex =  function(req, res){
    res.render("admin/index", {page: 'admin'});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = adminIndex;