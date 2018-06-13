// ==========================
// USER PERMISSIONS SHOW ROUTE
// ==========================

var User = require("../../models/user");

var userPermissionsShow = async function(req, res) {
    //find all users and pass them into
    var foundUsers = await User.find();
    
    res.render("admin/userPermissions", {users: foundUsers});
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = userPermissionsShow;