// ==========================
// USER EDIT ROUTE
// ==========================

var User = require("../../models/user");

var editUserRoute = function(req, res){
    
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            res.redirect("/activities");
        } else {
            res.render("users/userEdit", {user: foundUser});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editUserRoute;