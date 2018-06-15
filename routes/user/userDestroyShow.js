// ==========================
// USER DESTROY SHOW ROUTE
// ==========================

var User = require("../../models/user");

var destroyUserShowRoute = function(req, res){

    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            res.redirect("/activities");
        } else {
            res.render("users/userDestroy", {user: foundUser});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyUserShowRoute;