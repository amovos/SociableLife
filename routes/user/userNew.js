// ==========================
// USER NEW ROUTE
// ==========================

var newRoute =  function(req, res){
    if(true) { //if(req.query.inviteCode === process.env.INVITE_CODE){
        res.render("users/register", {page: 'register'});
    } else {
        req.flash("errorMessage", "Sorry, that invite code isn't right");
        
        var returnUrl = "/inviteCode";
        
        if(req.query.return_url){
            returnUrl += "?return_url=" + req.query.return_url;
        }
        
        if(req.query.activityName){
            returnUrl += "&activityName=" + req.query.activityName;
        }
        
        res.redirect(returnUrl);
    }
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;