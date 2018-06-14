// ==========================
// USER AVATAR EDIT ROUTE
// ==========================

var User = require("../../models/user");

var userAvatarEdit = async function(req, res) {
    
    User.findById(req.params.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            res.redirect("/activities");
        } else {
            res.render("users/userAvatarEdit", {user: foundUser});
        }
    });
    
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userAvatarEdit;