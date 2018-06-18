// ==========================
// USER NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    if(req.query.inviteCode === process.env.INVITE_CODE){
        res.render("users/register", {page: 'register'});
    } else {
        req.flash("errorMessage", "Sorry, that invite code isn't right");
        if(req.query.return_url){
            res.redirect("/inviteCode?return_url=" + req.query.return_url);
        } else {
            res.redirect("/inviteCode");
        }
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;