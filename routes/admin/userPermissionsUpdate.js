// =============================
// USER PERMISSIONS UPDATE ROUTE
// =============================

var User = require("../../models/user");

var userPermissionsUpdate = async function(req, res) {
    
    await User.findById(req.body.id, function(err, foundUser){
        if(err || !foundUser){
            req.flash("errorMessage", "User not found");
            res.redirect("/admin/userPermissions");
            return;
        }

        // update isAdmin
        if(req.body.isAdmin === "on"){
            foundUser.isAdmin = true;
        } else {
            foundUser.isAdmin = false;
        }
        
        // update isMod
        if(req.body.isMod === "on"){
            foundUser.isMod = true;
        } else {
            foundUser.isMod = false;
        }
        
        foundUser.save(function(err){
            if(err){
                req.flash("errorMessage", "Error saving user permissions");
                res.redirect("/admin/userPermissions");
            } else {
                req.flash("successMessage", "Updated User Permissions for: " + foundUser.username);
                res.redirect("/admin/userPermissions");
            }
        });
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userPermissionsUpdate;