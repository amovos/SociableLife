// ==========================
// USER NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    if(req.query.inviteCode === process.env.INVITE_CODE){
        res.render("users/register", {page: 'register'});
    } else {
        req.flash("errorMessage", "Sorry, that invite code isn't right");
        res.redirect("/inviteCode");
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;