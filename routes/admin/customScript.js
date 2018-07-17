// ====================
// CUSTOM SCRIPT ROUTE
// ====================

var User = require("../../models/user");

var customScript = async function(req, res){
    
    var users = await User.find({});
    
    users.forEach(function(user) { 
        user.lowerDisplayName = user.displayName.toLowerCase();
        user.save();
    });
    
    
    
    
    req.flash("successMessage", "Custom Script Ran...");
    res.redirect("/admin");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = customScript;