// ====================
// CUSTOM SCRIPT ROUTE
// ====================

var User = require("../../models/user");

var endDateRemove = require("../../server_scripts/endDateRemove");

var customScript = async function(req, res){
    
    // var users = await User.find({});
    
    // users.forEach(function(user) { 
    //     user.lowerDisplayName = user.displayName.toLowerCase();
    //     user.save();
    // });
    
    
    
    // endDateRemove();    
    // req.flash("successMessage", "Custom Script Ran...");

    
    
    
    req.flash("errorMessage", "No Custom Script Found");
    
    res.redirect("/admin");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = customScript;